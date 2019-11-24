import React, { Component } from 'react'
import Home from './Home';

export default class HomeContainer extends Component {

    enterLobby = this.props.enterLobby;
    createLobby = this.props.createLobby;
    // joinLobby = this.props.joinLobby;
    joiningLobbyState = false;

    state = {
        joiningLobby : false,
    }

    // createLobby = () =>{
    //     this.enterLobby();
    //     console.log("Create Lobby!")
    // }

    joinLobby = () => {
        this.setState({...this.state, joiningLobby: true,})
    }



    render() {
        return (
            <Home joiningLobby={this.state.joiningLobby} createLobby={this.createLobby} joinLobby={this.joinLobby}/>
        )
    }
}
