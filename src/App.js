import React, {useState} from 'react';
import './App.css';

import GroupChatController from './components/GroupChat/GroupChatController'
import JoinChat from './components/JoinChat/JoinChat'

function App() {

    //User joins chat room
    const [user, setUser] = useState(null)

  return (
    <div className="App">

        {!user &&
        <JoinChat setUser={setUser} />
        }

        {user &&
        <GroupChatController user={user}/>
        }

    </div>
  );
}

export default App;
