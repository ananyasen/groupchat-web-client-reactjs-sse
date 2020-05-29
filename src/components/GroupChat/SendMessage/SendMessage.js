import React, { useState } from 'react'
import './SendMessage.css'

function SendMessage({sendMessage}){

    const [message, setMessage] = useState(null)
    const [errors, setErrors] = useState({
        message : null
    })

    const onSend = (event) => {
        event.preventDefault()

        //field validation
        if(!message){
            setErrors({
                message : 'Please type a message!'
            })
        }else{
            sendMessage(message)
            setMessage('')
        }
    }

    const onEnter = (event) => {
        //clear error
        setErrors({
            message : ''
        })

        if(event.key === 'Enter'){
            onSend(event)
        }
    }

    return (
        <div className="send-container">
            <div className="send-message">
                <input type="text" value={message} placeholder="Type a message..."
                       onChange={e => setMessage(e.target.value)}
                       onKeyPress={onEnter}
                       noValidate
                       className="message-box"
                       data-testid="send-text"
                />
                <span onClick={onSend} className="send" data-testid="send-btn">Send</span>
            </div>

            {errors.message && errors.message.length > 0 &&
            <span className='field-validation-error'>{errors.message}</span>}
        </div>
    )
}

export default SendMessage
