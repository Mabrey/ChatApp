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
        this.props.messages.map(message =>  <p>{message}</p>);


    render() { 
        return ( 
            <div id='Chatbox Container'>
                <div>{this.mapMesssageArrayToComponents()}</div>
            </div>
         );
    }
}
 
export default Chatbox;