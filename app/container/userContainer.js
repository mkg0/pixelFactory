import React from "react";
import Editor from "component/editor/editor";
import PropTypes from "prop-types";

import { exportFont } from "../lib";

export default class UserContainer extends React.Component {
  constructor(props) {
    super(props);
    this.handleSave = this.handleSave.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.state = {
      font: null
    };
  }
  componentWillMount() {
    var { match } = this.props;
    var font = JSON.parse(localStorage.getItem(match.params.name));
    if (!font) {
      this.handleDelete();
      return;
    }
    font.letters = Object.keys(font.letters).map(
      letter => font.letters[letter]
    );
    this.setState({ font });
  }
  handleDelete() {
    var key = this.props.match.params.name;
    localStorage.removeItem(key);
    var existedFonts = localStorage.getItem("fonts");
    existedFonts = existedFonts ? JSON.parse(existedFonts) : [];
    existedFonts = existedFonts.filter(item => item !== key);
    localStorage.setItem("fonts", JSON.stringify(existedFonts));
    this.props.history.push("/");
  }
  handleSave(changedFont) {
    var { match } = this.props;
    var source = exportFont(changedFont);
    var key = match.params.name;
    localStorage.setItem(key, JSON.stringify(source));
    this.props.history.push("/");
  }
  render() {
    return (
      <div>
        <Editor
          data={this.state.font}
          onSave={this.handleSave}
          delete
          onDelete={this.handleDelete}
        />
      </div>
    );
  }
}

UserContainer.propTypes = {
  match: PropTypes.object,
  history: PropTypes.object
};
