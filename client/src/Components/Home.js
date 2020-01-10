import React from 'react'

const Home = ({joiningLobbyState, selectJoinLobby, createLobby, joinLobby, handleRoomJoinText}) => {

    // handleRoomJoinText = handleRoomJoinText;
    // joinLobby = joinLobby;

    return(
        (joiningLobbyState)
        ?   <div id='ChatButtons'>
                <input
                    type='text'
                    onChange={handleRoomJoinText}/>
                <button onClick={joinLobby}>Submit</button>
            </div>
        :   <div id='LobbyButtons'>
                <button
                 id="CreateLobbyButton"
                 className="LobbyButton"
                 onClick={createLobby}>Create Lobby</button>
                <button
                 id="JoinLobbyButton"
                 className="LobbyButton"
                 onClick={selectJoinLobby}>Join Lobby</button>
            </div>
    )
}

export default Home

