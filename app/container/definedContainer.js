import React from "react";
import Editor from "component/editor/editor.jsx";
import PropTypes from "prop-types";

import { exportFont } from "../lib";
import Prompt from "../component/prompt.jsx";

export default class DefinedContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.setFontName = this.setFontName.bind(this);
    this.state = {
      font: null,
      prompt: false
    };
  }
  componentWillMount() {
    var { match } = this.props;
    var font = require(`../fonts/${match.params.name}`);
    font.letters = Object.values(font.letters).sort(
      (a, b) => a.order - b.order
    );
    this.setState({ font });
  }
  setFontName() {
    this.setState({ prompt: true });
  }
  handleSave() {
    var source = exportFont(this.state.font);
    var key = this.state.font.name.replace(/[\s. ]+/g, "_");
    localStorage.setItem(key, JSON.stringify(source));
    var existedFonts = localStorage.getItem("fonts");
    existedFonts = existedFonts ? JSON.parse(existedFonts) : [];
    if (!existedFonts.some(item => item === key)) {
      existedFonts.push(key);
    }
    localStorage.setItem("fonts", JSON.stringify(existedFonts));
    this.setState({ prompt: false });
    this.props.history.push("/");
  }
  render() {
    return (
      <div>
        <Editor data={this.state.font} onSave={this.handleSave} />
        <Prompt
          title="Set Font Name"
          visible={this.state.prompt}
          onChange={this.handleSave}
          onClose={() => this.setState({ prompt: false })}
        />
      </div>
    );
  }
}

DefinedContainer.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
};
