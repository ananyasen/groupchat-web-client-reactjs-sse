import React, {useEffect, useRef} from 'react'
import PropTypes from 'prop-types'
import './GroupMessages.css'
import addReaction from '../../../assets/addReaction.svg'
import frowny from '../../../assets/frowny.svg'
import smiley from '../../../assets/smiley.svg'
import tada from '../../../assets/tada.svg'

const reactions = {
    DEFAULT: 'addReaction',
    SMILE:'smiley'
}

function GroupMessages({selectedGroupId='', messages=[], currentUser='', addReaction}){

    //scroll to the bottom
    const messagesEndRef = useRef(null)
    const scrollToBottom = () => {
        if(messagesEndRef && messagesEndRef.current && messagesEndRef.current.scrollIntoView){
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }
    useEffect(scrollToBottom, [messages]);

    const renderMessages = () => {
        return messages.map( message => {

            const addMessageReaction = (evt) => {
                //Future: different reaction popover component
                addReaction(selectedGroupId, message.id, message.reaction?null:1)
            }

            return (
                <div key={`message-${message.id}`}
                     className={message.name.toLowerCase() !== currentUser.toLowerCase() ? "group-message": "group-message self-message"}>

                    <div>
                        <div className={message.name.toLowerCase() !== currentUser.toLowerCase() ? "message": "message my-message"}>
                            {message.message}
                        </div>

                        {message.name.toLowerCase() !== currentUser.toLowerCase() &&
                        <div className="user-reaction">
                            <small className="message-user">{message.name}</small>
                            <div className='reaction' onClick={addMessageReaction}  >
                                {message.reaction?
                                    <span>♥️️</span>
                                    :
                                    <span>+1</span>
                                }
                                {/*<img src={message.reaction?reactions.SMILE:reactions.DEFAULT} onClick={addMessageReaction}  />*/}
                            </div>
                        </div>
                        }
                    </div>
                </div>
            )
        })
    }

    return(
        <div data-testid="messages">
            {renderMessages()}
            <div ref={messagesEndRef} />
        </div>
    )
}

GroupMessages.propTypes = {
    messages: PropTypes.array.isRequired,
    selectedGroupId: PropTypes.string.isRequired,
    currentUser: PropTypes.string.isRequired,
    addReaction: PropTypes.func
}

export default GroupMessages
