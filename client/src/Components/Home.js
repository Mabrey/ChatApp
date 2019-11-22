import React from 'react'

const Home = ({createLobby, joinLobby}) => {
    return(
    <>
        <button onClick={createLobby}>Create Lobby</button>
        <button onClick={joinLobby}>Join Lobby</button>
    </>
    )
}

export default Home
