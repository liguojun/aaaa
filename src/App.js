import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './App.css';
import LoginForm from "./login/LoginForm";
import ShowHoldBook from "./components/ShowHoldBook";
import Statistics from "./components/Statistics";


class App extends Component {
  render() {
    return (
        <Router>
          <Switch>
            <Route path="/" exact component={LoginForm} />
            <Route path="/showholdbook" exact component={ShowHoldBook} />
            <Route path="/statistics" exact component={Statistics} />
          </Switch>
        </Router>
    );
  }
}

export default App;
