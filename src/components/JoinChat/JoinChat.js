import React, {useState} from 'react'
import {joinUser, fieldValidationError, joinButton, userBox, title} from './JoinChatStyles'

function JoinChat({setUser}) {

    const [name, setName] = useState(null)
    const [errors, setErrors] = useState({
        name : null
    })

    const onJoin = (event) => {
        event.preventDefault()
        //field validation
        if(!name){
            setErrors({
                name : 'Please add a valid user name!'
            })
        }else {
            setUser(name)
        }
    }

    const onEnter = (event) => {
        //clear errors
        setErrors({
            name : ''
        })

        if(event.key === 'Enter'){
            onJoin(event)
        }
    }

    return(
        <div style={joinUser}>
            <h1 style={title}>Group Chat with Server-Sent Events for Message Push</h1>
            <input type="text" value={name} placeholder="Type your username..."
                   onChange={e => setName(e.target.value)}
                   onKeyPress={onEnter}
                   noValidate
                   style={userBox}
                   data-testid='login-text'
            />
            {errors.name && errors.name.length > 0 &&
            <span style={fieldValidationError}>{errors.name}</span>}

            <button onClick={onJoin} data-testid='login-button'
                  style={joinButton} >Let's Chat!</button>
        </div>
    )
}

export default JoinChat
