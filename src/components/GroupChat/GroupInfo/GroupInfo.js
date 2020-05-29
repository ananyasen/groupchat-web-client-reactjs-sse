import React from 'react'
import PropTypes from 'prop-types'
import './GroupInfo.css'

function GroupInfo({name='', users=[], currentUser=''}){
    const renderUsers = () => {
        return users.map( (user, index) => {
            return (
                <small key={`group-user-${user.toLowerCase()}`}
                       className={user.toLowerCase() === currentUser.toLowerCase()? 'group-user current-user': 'group-user'}>

                    {index === users.length -1 ? user : `${user}, ` }
                </small>
            )
        })
    }

    return (
        <div className="group-info" data-testid="group-info">
            <div >{name}</div>
            <div>
                {renderUsers()}
            </div>
        </div>
    )
}

GroupInfo.propTypes = {
    name: PropTypes.string.isRequired,
    users: PropTypes.array,
    currentUser: PropTypes.string.isRequired
}

export default GroupInfo
