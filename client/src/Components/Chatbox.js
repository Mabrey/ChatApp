import React, { Component } from 'react';

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
            <div id='Chatbox Container'>
                <p>Room ID: {this.props.roomID}</p>
                <input type='text' onChange={handleChange} value ={this.state.outgoingMessage} />
                <button onClick={handleSubmit}>Submit</button>
                <button onClick={leaveRoom}>Leave</button>
                <div>{this.mapMesssageArrayToComponents()}</div>
            </div>
         );
    }
}

export default Chatbox;
