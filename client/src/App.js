import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";

import Register from "./components/register";
import Login from "./components/login";
import Dashboard from "./components/dashboard";
import Error from "./components/error";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" component={Register} exact />
            <Route path="/login" component={Login} />
            <Route path="/dashboard" component={Dashboard} />
            <Route component={Error} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
