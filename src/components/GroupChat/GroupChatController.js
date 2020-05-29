import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {getChatGroups, getGroupMessages, postMessage, postReaction} from '../../services/chatService'
import UserInfo from './UserInfo/UserInfo'
import GroupTabs from './GroupTabs/GroupTabs'
import GroupInfo from './GroupInfo/GroupInfo'
import GroupMessages from './GroupMessages/GroupMessages'
import SendMessage from './SendMessage/SendMessage'

import ErrorBoundary from './ErrorBoundary'
import './GroupChat.css'

class GroupChatController extends Component{
    static propTypes = {
        user: PropTypes.string
    }

    constructor(props) {
        super(props);

        this.state = {
            currentUser: props.user, //get from hooks
            loginTime: Date.now(),
            onlineDuration : 0,
            chatGroups : [],
            selectedGroupId : 0,
            selectedGroup:null,
            selectedGroupMessages:[]
        }
    }

    intervalHandle = null

    componentDidMount() {
        //Make API call & setup a server-sent event connection

        getChatGroups()
            .then(groups => {
                this.setState({chatGroups: groups,
                    selectedGroup:groups[0],
                    selectedGroupId: groups[0].id
                })

                //now load messages
                //TODO can we load messages in Messages component?
                const selectedGroupMessages = getGroupMessages(groups[0].id)
                return selectedGroupMessages
            })
            .then( (messages) => {
                this.setState({selectedGroupMessages:messages})

                //SSE persistent connection
                this.setupGroupMessagesStream(this.state.selectedGroupId)

            })
            .catch( (err) => {
                console.error(err)
                throw new Error(err)
            })

        //Update user's logged in duration every minute
        this.intervalHandle = setInterval(this.updateLoginTime, 60000 /*every minute*/)

    }

    updateLoginTime = () => {
        this.setState({onlineDuration: Math.floor((Date.now() - this.state.loginTime) / (60000))})
    }

    //Event handler
    selectGroup = (id) => {
        const findGroups = this.state.chatGroups.filter(group => group.id === id)
        let selectedGroup = findGroups[0]

        //show new user in the group info
        let findCurrentUser = selectedGroup.users.filter( u => u.toLowerCase() === this.state.currentUser.toLowerCase())
        if(findCurrentUser.length === 0){
            //add new user to the current group
            selectedGroup = Object.assign({}, selectedGroup,{users: [...selectedGroup.users, this.state.currentUser]})
        }

        this.setState({selectedGroupId:id, selectedGroup:selectedGroup})


        //Get latest messages : SSE persistent connection
        //this.setupGroupMessagesStream(id)

        //load chat
        getGroupMessages(id)
        .then(selectedGroupMessages => {
            this.setState({selectedGroupMessages:selectedGroupMessages})

            //SSE persistent connection
            this.setupGroupMessagesStream(id)

        })
        .catch( (err) => {
            console.error(err)
            throw new Error(err)
        })

    }

    //Event handler
    sendMessage = (message) => {
        const {selectedGroupId, currentUser, selectedGroupMessages} = this.state

        postMessage(selectedGroupId,currentUser, message )
        .then( (messageReturned) => {
            let updatedMessages = [...selectedGroupMessages, messageReturned]
            this.setState({selectedGroupMessages:updatedMessages})
        })
        .catch( (err) => {
            console.error(err)
            throw new Error(err)
        })
    }

    //FUTURE: Event handler for adding reaction for a message
    addReaction = (groupId, messageId, reaction) => {
        //POST message reaction
        //on success : update state.selectedGroupMessages
        console.log('Reaction Added', groupId, messageId, reaction)

        postReaction(groupId, messageId, this.state.currentUser, reaction)
    }

    //function to create a new SSE persistent connection for the current chat group
    sseEventSource = null
    setupGroupMessagesStream = (groupId) =>{

        //close existing SSE if groupId changed
        if(this.sseEventSource){
            //console.log("$$$$$ SSE connection closed for other group")
            this.sseEventSource.close()
        }

        //register a new Server-sent Event to get other group members' messages
        this.sseEventSource = new EventSource(`http://localhost:8080/api/rooms/${groupId}/message-stream`);

        //Update the Chats if someone else posted a new message
        this.sseEventSource.onmessage = e => {
            //console.log("$$$$$ SSE data", e.type, JSON.parse(e.data))
            const currentGroup = JSON.parse(e.data)
            if(currentGroup){
                if(currentGroup.users.length !== this.state.selectedGroup.users.length){
                    this.setState({selectedGroup:currentGroup})
                }
                const currentGroupMessages =  currentGroup.messages

                // if(currentGroupMessages && currentGroupMessages.length !== this.state.selectedGroupMessages.length){
                //     //console.log("$$$$$ SSE data update!!")
                //     //TODO: Add reactionchange logics
                //     this.setState({selectedGroupMessages:currentGroupMessages})
                // }

                this.setState({selectedGroupMessages:currentGroupMessages})

            }

        }

        this.sseEventSource.onopen = e => {
            //console.log("$$$$$ SSE connection opened", e.type, e)
        }

        this.sseEventSource.onerror = e => {
            //console.log("$$$$$ SSE error", e.type, e)
        }
    }

    //CLEANUP
    componentWillUnmount() {
        //clean up setInterval
        clearInterval(this.intervalHandle)

        //SSE unregister
        if(this.sseEventSource){
            this.sseEventSource.close()
        }
    }

    render(){
        let {currentUser, onlineDuration, chatGroups,
            selectedGroup, selectedGroupId, selectedGroupMessages} = this.state

        return (
            <ErrorBoundary>
                <div className="group-chat">
                    <div className="left-bar">
                        <div className="user-info">
                            <UserInfo name={currentUser} onlineDuration={onlineDuration} />
                        </div>
                        <div className="groups">
                            <GroupTabs
                                chatGroups={chatGroups}
                                selectedGroupId={selectedGroupId}
                                selectGroup={this.selectGroup}
                            />
                        </div>
                    </div>
                    <div className="right-bar">
                        <div className="group-details">
                            <GroupInfo name={selectedGroup?selectedGroup.name:''}
                                       users={selectedGroup?selectedGroup.users:[]}
                                       currentUser={this.state.currentUser}
                            />
                        </div>
                        <div className="read-chat">
                            <GroupMessages selectedGroupId={selectedGroupId}
                                           messages={selectedGroupMessages}
                                           currentUser={currentUser}
                                           addReaction={this.addReaction}
                            />
                        </div>
                        <div className="send-chat">
                            <SendMessage sendMessage={this.sendMessage} />
                        </div>
                    </div>
                </div>
            </ErrorBoundary>
        )
    }

}

export default GroupChatController
