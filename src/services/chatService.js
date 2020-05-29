import fetch from 'cross-fetch'

export const getChatGroups = async () => {
    try {
        const res = await fetch('http://localhost:8080/api/rooms');
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        const groups = await res.json();

        //fetch group users
        const promises = groups.map(async group => {
            const res = await fetch(`http://localhost:8080/api/rooms/${group.id}`);
            if (res.status >= 400) {
                console.log("Unable to fetch group details", group)
                //throw new Error("Bad response from server");
            }
            const groupDetails = await res.json()
            return groupDetails
        })

        const groupsWithDetails = await Promise.all(promises)

        return groupsWithDetails

    } catch (err) {
        throw new Error(err)
    }
}

export const getGroupMessages = async (groupId) => {
    try{
        const res = await fetch(`http://localhost:8080/api/rooms/${groupId}/messages`);
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        const messages = await res.json();

        return messages
    }catch(err){
        throw new Error(err)
    }
}

export const postMessage = async (groupId, username, message) => {
    try{
        const res = await fetch(`http://localhost:8080/api/rooms/${groupId}/messages`, {
                                method: 'POST',
                                body: JSON.stringify({name: username, message:message}),
                                headers: { 'Content-Type': 'application/json' }
                            })
        if (res.status >= 400){
            throw new Error('Bad response from server')
        }
        const messageReturned = await res.json()
        return messageReturned
    }catch(err){
        throw new Error(err)
    }
}

//POST Reaction
export const postReaction = async (groupId, messageId, username, reaction) => {
    console.log('POST SERVER OK REACTION')
    try{
        const res = await fetch(`http://localhost:8080/api/rooms/${groupId}/messages/${messageId}`, {
            method: 'POST',
            body: JSON.stringify({reaction}),
            headers: { 'Content-Type': 'application/json' }
        })
        if (res.status >= 400){
            throw new Error('Bad response from server')
        }
        const data = await res.json()

        console.log('SERVER OK REACTION', data)

        return data.message
    }catch(err){
        console.log('Add reaction', groupId, messageId, err)
        throw new Error(err)
    }
}

