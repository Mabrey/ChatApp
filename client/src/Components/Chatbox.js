import React, { Component } from 'react';
import "../Styles/Chatbox.css"

class Chatbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages,
            messagesComponent: [],
        }
    }

    mapMesssageArrayToComponents = () =>
        this.props.messages.map(message =>  <p>{`${message.author}: ${message.message}`}</p>);


    render() {

        const {handleSubmit, handleChange, leaveRoom} = this.props;

        return (
            <div id='ChatboxContainer'>
                <div id="ChatHeader">
                    <p id='RoomID'>Room ID: {this.props.roomID}</p>
                    <button id="LeaveButton" onClick={leaveRoom}>Leave</button>
                </div>


                <div id="TextAndSubmitContainer">
                    <input type='text' onChange={handleChange} value ={this.state.outgoingMessage} />
                    <button onClick={handleSubmit}>Submit</button>
                </div>

                <div id="MessageContainer">{this.mapMesssageArrayToComponents()}</div>
            </div>
         );
    }
}

export default Chatbox;
