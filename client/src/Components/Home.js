import React from 'react'

const Home = ({joiningLobbyState, selectJoinLobby, createLobby, joinLobby, handleRoomJoinText}) => {

    // handleRoomJoinText = handleRoomJoinText;
    // joinLobby = joinLobby;

    return(
        (joiningLobbyState)
        ?   <>
                <input
                    type='text'
                    onChange={handleRoomJoinText}/>
                <button onClick={joinLobby}>Submit</button>
            </>
        :   <>
                <button onClick={createLobby}>Create Lobby</button>
                <button onClick={selectJoinLobby}>Join Lobby</button>
            </>
    )
}

export default Home
