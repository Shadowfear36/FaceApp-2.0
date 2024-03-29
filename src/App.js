import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


//const Clarifai = require('clarifai');
const app = new Clarifai.App({
  apiKey: 'ad315a0f77b74b03bef35f94dfb04327'
});

const particleOptions = {
  particles: {
    number: {
      value: 30,
      density: {
        enable: true,
        value_area: 800,
      }
    }
  }
}


class App extends Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false
      user: {
        id: '123',
        name: 'John',
        password: 'cookies',
        email: 'john@gmail.com',
        entries: 0,
        joined: new Date(),
      }
    }
  }


  calculateFaceLocation = (data) => {

      const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
      const image = document.getElementById('inputimage');
      const width = Number(image.width);
      const height = Number(image.height);
      console.log(width, height);
     return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
      }
  }


  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageURL: this.state.input})
    app.model
    .predict(
      Clarifai.FACE_DETECT_MODEL,
      this.state.input
      )
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    }else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
   const { isSignedIn, imageURL, route, box } = this.state;
    return (
      <div className="App">
        <Particles className='particles'
              params={particleOptions}
          />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      
        { route === 'home' 
            ? <div>
                <Logo />

                <Rank />

                <ImageLinkForm 
                  onInputChange={this.onInputChange} 
                  onButtonSubmit={this.onButtonSubmit}/>

                <FaceRecognition 
                box={box}
                imageURL={imageURL}/>
            </div>
            : (
                route === 'signin'
                ? <Signin onRouteChange={this.onRouteChange}/>
                : <Register onRouteChange={this.onRouteChange}/>
              )
        }
      </div>
    );
  }
}

export default App;
