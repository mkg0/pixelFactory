import React from "react";
import Layout from "./view/Layout.js";

import { BrowserRouter as Router, Route } from "react-router-dom";
import IndexContainer from "container/indexContainer";
import DefinedContainer from "container/definedContainer";
import UserContainer from "container/userContainer";

export default class Root extends React.Component {
  render() {
    return (
      <Layout>
        <Router>
          <div>
            <Route exact path="/" component={IndexContainer} />
            <Route path="/defined/:name" component={DefinedContainer} />
            <Route path="/user/:name" component={UserContainer} />
          </div>
        </Router>
      </Layout>
    );
  }
}
