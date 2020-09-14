import React from 'react';
import ReactDOM from 'react-dom';
import Nouns from './nouns'
import Verbs from './verbs'
import Notfound from './notfound'
import './index.css';
import * as serviceWorker from './serviceWorker';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

const nounPath = process.env.PUBLIC_URL + "/nouns"
const verbPath = process.env.PUBLIC_URL + "/verbs"

const routing = (
  <Router>
    <div>
      <nav className="navbar navbar-dark bg-dark navbar-expand-lg" >
        <div class="navbar-header">
          <a class="navbar-brand" href="#">Finnish Inflexion Drill</a>
        </div>
        <ul className="nav navbar-nav mr-auto">
          <li className="nav-item">
            <Link activeClassName="active" className="nav-link" to={nounPath}>Nouns</Link>
          </li>
          <li className="nav-item">
            <Link activeClassName="active" className="nav-link" to={verbPath}>Verbs</Link>
          </li>
        </ul>
      </nav>
      <Switch>
        <Route exact path={process.env.PUBLIC_URL}>{<Redirect to={nounPath} />}</Route>
        <Route path={nounPath} component={Nouns} />
        <Route path={verbPath} component={Verbs} />
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
