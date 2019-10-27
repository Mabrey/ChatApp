import React, {Component} from 'react';
import queryString from 'query-string';
import './App.css';

class App extends Component {
  state = {
      data: null,
      requestID: null
    };

    componentDidMount() {
        // Call our fetch function below once the component mounts
      this.apiRes()
        .then(res => this.setState({ data: res.express }))
        .catch(err => console.log(err));

      const lobby = queryString.parse(this.props.location.search);
      console.log(lobby.game);
    }

  apiRes = async () => {
    const response = await fetch('/express_backend');

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


  render(){
    return (
      <div className="App">
        <header className="App-header">
          <p>{this.state.data}</p>
        </header>
      </div>
    );
  }
}

export default App;
