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
      userID: '',
      messages: [],
      currentlyInLobby: false,
      roomID: '',
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

    this.ws.onopen = evt =>{
      console.log('connected to ws!');
    }

    this.ws.onmessage = evt =>{
      const message = JSON.parse(evt.data);
      // const message = evt.data;


      if('clientID' in message){

        if(this.props.location.search){
          let query = queryString.parse(this.props.location.search);
          if (query.game !== undefined){
            this.setState({
              ...this.state,
              roomID: query.game,
              userID: message.clientID,
            }, () => this.joinLobby())
          }
        }
        else {
          this.setState({
            ...this.state,
            userID: message.clientID,
          })
        }
      }

      if('author' in message){
        const messages = [...this.state.messages, message];
        this.setState({...this.state, messages})
      }
    }

    this.ws.onclose = () =>{
      console.log('disconnected');
    }

    console.log(this.state.roomID);
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
    this.setState({...this.state, outgoingMessage: event.target.value});
  }

  handleSubmit = () => {
    let message = {
      author: this.state.userID,
      roomID: this.state.roomID,
      message: this.state.outgoingMessage
    }

    this.setState(state => {
      const messages = [...state.messages, message];
      return{...state, messages}
    })

    let messageString = JSON.stringify(message);
    this.ws.send(messageString);

  }

  checkIfLobbyIsActive = async (roomID) => {
    const response = await fetch(`/is_room_active?roomID=${roomID}`);
    const body = await response.json();

    if(response.status !== 200){
      throw Error(body.message)
    }

    return body;
  }

  createLobby = async () => {
    console.log(this.state.userID);
    const response = await fetch(`/create_room?userID=${this.state.userID}`);
    const body = await response.json();

    if(response.status !== 200){
      throw Error(body.message)
    }

    this.setState({...this.state, roomID: body.roomID});
    this.enterLobby();

    return body;
  }

  joinLobby = async () => {
    if(this.checkIfLobbyIsActive(this.state.roomID)){
      const response = await fetch(`/join_room?userID=${this.state.userID}&roomID=${this.state.roomID}`);
      const body = await response.json();

      if(response.status !== 200){
        throw Error(body.message)
      }
      console.log(body.roomJoinStatus);
      if(body.roomJoinStatus === "Success"){
        this.enterLobby();
      }

      return body;

    }

  }

  leaveRoom = async () => {
    const response = await fetch(`/leave_room?userID=${this.state.userID}&roomID=${this.state.roomID}`);
    const body = await response.json();

    if(response.status !== 200){
      throw Error(body.message)
    }
    console.log(body.roomJoinStatus);
    if(body.roomLeaveStatus === "Success"){
      this.clearRoomInfo();
    }

    if(body.roomJoinStatus === "Failed"){
      console.log (body.roomJoinStatus);
    }
    return body;


  }

  clearRoomInfo = () => {
    this.setState({...this.state, currentlyInLobby: false, roomID: '', messages: []});
  }

  changeLobbyState = () =>{
    this.setState({...this.state, currentlyInLobby: !this.state.currentlyInLobby})
  }

  enterLobby = () =>{
    this.setState({...this.state, currentlyInLobby: true})
  }

  handleRoomJoinText = (event) =>{
    this.setState({...this.state, roomID: event.target.value});
  }



  render(){
    return (
      <div className="App">
        <header className="App-header">
          <h1 id="appTitle">Chat App</h1>
          {(!this.state.currentlyInLobby)
            ? <HomeContainer
                joinLobby={this.joinLobby}
                createLobby={this.createLobby}
                roomID={this.state.roomID}
                handleRoomJoinText={this.handleRoomJoinText}/>
            : <Chatbox
                ws={this.ws}
                messages={this.state.messages}
                handleChange={this.handleChange}
                handleSubmit={this.handleSubmit}
                leaveRoom={this.leaveRoom}
                outgoingMessage={this.state.outgoingMessage}
                roomID={this.state.roomID}/>
          }

        </header>
      </div>
    );
  }
}

export default App;
