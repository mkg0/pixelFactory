import React, { Component } from "react";
import fonts from "../fonts";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import Prompt from "../component/prompt";
import Button from "antd/lib/button";

class IndexView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prompt: false
    };
    this.createFont = this.createFont.bind(this);
  }
  createFont(value) {
    var newFont = {
      lineHeight: 7,
      name: value,
      link: "",
      letters: {}
    };
    var key = value.replace(/[\s. ]+/g, "_");
    localStorage.setItem(key, JSON.stringify(newFont));
    var existedFonts = localStorage.getItem("fonts");
    existedFonts = existedFonts ? JSON.parse(existedFonts) : [];
    existedFonts.push(key);
    localStorage.setItem("fonts", JSON.stringify(existedFonts));
    this.props.history.push("/user/" + key);
  }
  render() {
    return (
      <div>
        <h1 className="espas">Pixel Factory</h1>
        <section className="header espas">
          <p>Defined Fonts</p>
        </section>

        <section className="fonts espas">
          {fonts.map((font, i) => (
            <Link to={`/defined/${font}`} key={i}>
              <img src={require(`../img/${font}.png`)} alt={font} />
              {font}
            </Link>
          ))}

        </section>

        <section className="header espas">
          <p>User Fonts</p>
          <Button onClick={() => this.setState({ prompt: true })}>
            Add New
          </Button>
        </section>
        <section className="userFonts espas">
          {JSON.parse(localStorage.getItem("fonts") || "[]").map((font, i) => (
            <Link to={`/user/${font}`} key={i}>
              <p><span>{font}</span></p>
            </Link>
          ))}
        </section>
        <Prompt
          visible={this.state.prompt}
          title="Type font name"
          onChange={this.createFont}
          onClose={() => this.setState({ prompt: false })}
        />

      </div>
    );
  }
}

IndexView.propTypes = {
  history: PropTypes.object
};

export default IndexView;
