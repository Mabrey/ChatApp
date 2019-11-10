import React, {Component} from 'react';
import queryString from 'query-string';
import './App.css';
import Chatbox from './Components/Chatbox';

class App extends Component {
  state = {
      data: null,
      requestID: null,
      user: null,
      messages: [],
  };

  ws = new WebSocket('ws://localhost:5000')
  
  componentDidMount() {
      // Call our fetch function below once the component mounts
    this.apiRes()
      .then(res => this.setState({ data: res.express }))
      .catch(err => console.log(err));

    // this.getUserID()
    //   .then(res=> this.setState({user: res.express}))
    //   .catch(err=> console.log(err));

    this.ws.onopen = () =>{
      console.log('connected to ws!');
    }

    this.ws.onmessage = evt =>{
      const message = evt.data;
      this.setState(state => {
        const messages = [...state.messages, message];
        return{...state, messages}
      })
      console.log(message)
    }

    this.ws.onclose = () =>{
      console.log('disconnected');
    }

    const lobby = queryString.parse(this.props.location.search);
    console.log(lobby.game);
  }

componentDidUpdate = () => {
  console.log(this.state.messages);
}

  apiRes = async () => {
    const response = await fetch('/express_backend');

    const body = await response.json();

    if(response.status !== 200){
      throw Error(body.message)
    }
    return body;
  };

  getUserID = async () => {
    const response = await fetch('/get_user_number');
    const body = await response.json();

    if(response.status !== 200){
      throw Error(body.message)
    }

    return body;
  };

  // apiRes2 = async () => {
  //   const response = await fetch('/');

  //   const body = await response.json();

  //   if(response.status !== 200){
  //     throw Error(body.message)
  //   }
  //   return body;
  // }


  handleChange = (event) => {
    this.setState({outgoingMessage: event.target.value});
  }

  handleSubmit = () => {
    this.ws.send(this.state.outgoingMessage);
    this.setState(state => {
      const messages = [...state.messages, this.state.outgoingMessage];
      return{...state, messages}
    })
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          <p>{this.state.data}</p>
          <p>{this.state.user}</p>
          <input type='text' onChange={this.handleChange} value ={this.state.outgoingMessage} />
          <button onClick={this.handleSubmit}>Submit</button>
          <p>{this.state.dataFromServer}</p>
          
          <Chatbox ws={this.ws} messages={this.state.messages}/>
        </header>
      </div>
    );
  }
}

export default App;
