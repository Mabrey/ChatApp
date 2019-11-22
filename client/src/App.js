import React, {Component} from 'react';
import queryString from 'query-string';
import './App.css';
import Chatbox from './Components/Chatbox';
import HomeContainer from './Components/HomeContainer';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: null,
      requestID: null,
      userID: null,
      messages: [],
      currentlyInLobby: (this.props.location.search
        ? true
        : false),
      lobby: (this.props.location.search
        ? queryString.parse(this.props.location.search).game
        : ''),
    };
  }

  ws = new WebSocket('ws://localhost:5000')

  componentDidMount() {
      // Call our fetch function below once the component mounts
    // this.apiRes()
    //   .then(res => this.setState({ data: res.express }))
    //   .catch(err => console.log(err));

    // this.getUserID()
    //   .then(res=> this.setState({user: res.express}))
    //   .catch(err=> console.log(err));

    let userID;
    this.getUserID().then(res => this.setState({...this.setState, userID: res}));


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

    // this.setState(() => ({...this.state, lobby: 'eh'}));
    console.log(this.state.lobby);
  }

  componentDidUpdate = () => {
    console.log(this.state.messages);
  }

  //Returns a unique id to identify this user.
  getUserID = async () => {
    const response = await fetch('/create_user_id');
    const body = await response.json();

    if(response.status !== 200){
      throw Error(body.message)
    }
    console.log(body.userID);
    return body.userID;
  };

  //returns url to request a WS connection.
  getWebsocketURL = async () => {
    const response = await fetch('/get_websocket_url');
    const body = await response.json();

    if(response.status !== 200){
      throw Error(body.message)
    }

    return body;
  }

  //returns a room id and tells the server to group this user into a party.
  createRoom = async () => {
    const response = await fetch('/create_room');
    const body = await response.json();

    if(response.status !== 200){
      throw Error(body.message)
    }

    return body;
  }

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

  createLobby = async () => {
    const response = await fetch(`/create_room?userID=${this.state.userID}`);
    const body = await response.json();

    if(response.status !== 200){
      throw Error(body.message)
    }

    this.setState({...this.state, gameID: body.gameID});
    //render the chatbox and connect to websocket

    return body;
  }

  joinLobby = () => {
    //create text box to input lobby info
  }

  changeLobbyState = () =>{
    this.setState({...this.state, currentlyInLobby: !this.state.currentlyInLobby})
  }

  render(){
    return (
      <div className="App">
        <header className="App-header">
          {(!this.state.currentlyInLobby)
            ? <HomeContainer enterLobby={this.changeLobbyState}/>
            : <Chatbox
                ws={this.ws}
                messages={this.state.messages}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                outgoingMessage={this.state.outgoingMessage}/>
          }
          <h1>{this.state.userID}</h1>
        </header>
      </div>
    );
  }
}

export default App;
