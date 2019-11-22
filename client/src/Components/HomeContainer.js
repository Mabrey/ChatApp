import React, { Component } from 'react'
import Home from './Home';

export default class HomeContainer extends Component {

    enterLobby = this.props.enterLobby;

    createLobby = () =>{
        this.enterLobby();
        console.log("Create Lobby!")
    }

    joinLobby = () => {
        this.enterLobby();
        console.log("Join Lobby!")
    }

    render() {
        return (
            <Home createLobby={this.createLobby} joinLobby={this.joinLobby}/>
        )
    }
}
