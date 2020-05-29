import React from 'react'
import PropTypes from 'prop-types'
import './GroupTabs.css'

function GroupTabs({chatGroups, selectedGroupId, selectGroup}){

    const renderGroups = () => {
        return chatGroups.map( (group) => {
            return (
                <li key={`group-${group.id}`}
                    className={selectedGroupId === group.id? 'group selected-group': 'group'}
                    onClick={() => {selectGroup(group.id)}} >

                    {group.name}
                </li>
            )
        })
    }

    return (
        <ul className="group-tabs" data-testid="group-tabs">
            {renderGroups()}
        </ul>
    )
}

GroupTabs.propTypes = {
    chatGroups: PropTypes.array.isRequired,
    selectedGroupId: PropTypes.string.isRequired,
    selectGroup: PropTypes.func.isRequired
}

export default GroupTabs
