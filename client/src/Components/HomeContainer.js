import React, { Component } from 'react'
import Home from './Home';

export default class HomeContainer extends Component {

    joinLobby = this.props.joinLobby;
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

    selectJoinLobby = () => {
        this.setState({...this.state, joiningLobbyState: true,})
    }



    render() {
        return (
            <Home
                joiningLobbyState={this.state.joiningLobbyState}
                selectJoinLobby={this.selectJoinLobby}
                createLobby={this.createLobby}
                joinLobby={this.joinLobby}
                roomID = {this.props.roomID}
                handleRoomJoinText ={this.props.handleRoomJoinText}
                />
        )
    }
}
