import React from 'react'
import PropTypes from 'prop-types'
import {userInfo, userName, userOnlineTime} from  './UserInfoStyles'

function UserInfo({name, onlineDuration}){

    //NOTE: Using a different way to apply styles to reduce className conflicts in the whole app,
    //and ensure specificity with element style property
    //However not very IDE-CSS-hints friendly!

    return (
        <div style={userInfo}>
            <div style={userName}>{name}</div>
            <small style={userOnlineTime}>{`Online for ${onlineDuration} minutes`}</small>
        </div>
    )
}

UserInfo.propTypes = {
    name: PropTypes.string.isRequired,
    onlineDuration: PropTypes.number.isRequired
}

export default UserInfo
