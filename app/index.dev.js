import React from "react";
import ReactDOM from "react-dom";
import Root from "./Root.js";
import { AppContainer } from "react-hot-loader";

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Root />
    </AppContainer>,
    document.querySelector("#root")
  );
};
render();

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept("./Root.js", render);
}
