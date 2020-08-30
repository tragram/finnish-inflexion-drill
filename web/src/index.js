import React from 'react';
import ReactDOM from 'react-dom';
import Nouns from './nouns'
import Verbs from './verbs'
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'


function getTextWidth(inputText, font) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;
  const width = context.measureText(inputText).width;
  const formattedWidth = Math.ceil(width)// + "px"; 
  console.log(formattedWidth);
}

const routing = (
  <Router>
    <div>
      <Route exact path="/" component={Nouns} />
      <Route path="/nouns" component={Nouns} />
      <Route path="/verbs" component={Verbs} />
    </div>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
