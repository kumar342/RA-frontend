import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Dashboard from "./components/dashboard";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

export default class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route path={"/"} exact component={Dashboard} />
        </Switch>
      </BrowserRouter>
    );
  }
}
