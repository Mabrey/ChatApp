import React from 'react'

const Home = ({joiningLobby, createLobby, joinLobby}) => {

    return(
        (joiningLobby)
        ?   <>
                <input type='text'/>
                <button>Submit</button>
            </>
        :   <>
                <button onClick={createLobby}>Create Lobby</button>
                <button onClick={joinLobby}>Join Lobby</button>
            </>
    )
}

export default Home
