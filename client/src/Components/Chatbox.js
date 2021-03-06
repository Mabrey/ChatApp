import React, { Component } from 'react';

class Chatbox extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: props.messages,
            messagesComponent: [],
        }
    }

    handleSubmit = this.props.handleSubmit;
    handleChange = this.props.handleChange;

    mapMesssageArrayToComponents = () =>
        this.props.messages.map(message =>  <p>{`${message.author}: ${message.message}`}</p>);


    render() {
        return (
            <div id='Chatbox Container'>
                <p>Room ID: {this.props.roomID}</p>
                <input type='text' onChange={this.handleChange} value ={this.state.outgoingMessage} />
                <button onClick={this.handleSubmit}>Submit</button>
                <div>{this.mapMesssageArrayToComponents()}</div>
            </div>
         );
    }
}

export default Chatbox;
