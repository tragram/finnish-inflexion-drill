import React from 'react';
import ReactDOM from 'react-dom';
import Nouns from './nouns'
import Verbs from './verbs'
import Notfound from './notfound'
import './index.css';
import * as serviceWorker from './serviceWorker';
import { Route, Redirect, NavLink, BrowserRouter as Router, Switch } from 'react-router-dom'


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
      <ul>
        <li>
          <NavLink activeClassName="active" to="/nouns">Nouns</NavLink>
        </li>
        <li>
          <NavLink activeClassName="active" to="/verbs">Verbs</NavLink>
        </li>
      </ul>
      <Switch>
        <Route exact path="/">{<Redirect to="/nouns" />}</Route>
        <Route path="/nouns" component={Nouns} />
        <Route path="/verbs" component={Verbs} />
        <Route component={Notfound} />
      </Switch>
    </div>
  </Router>
)
ReactDOM.render(routing, document.getElementById('root'))

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
