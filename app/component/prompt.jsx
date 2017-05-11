import React, { Component } from "react";
import PropTypes from "prop-types";

import Modal from "antd/lib/modal";
import "antd/lib/modal/style/index.css";
import Input from "antd/lib/input";
import "antd/lib/input/style/index.css";

class Prompt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: ""
    };
    this.handleOk = this.handleOk.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleOk() {
    this.props.onChange(this.state.value);
  }
  handleChange(e) {
    this.setState({ value: e.target.value });
  }
  componentWillReceiveProps(newProps) {
    this.setState({ value: newProps.defaultValue });
  }

  render() {
    return (
      <div>
        <Modal
          okText="Ok"
          cancelText="Cancel"
          title={this.props.title}
          visible={this.props.visible}
          onOk={this.handleOk}
          onCancel={this.props.onClose}
        >

          <Input
            size="large"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </Modal>

      </div>
    );
  }
}

Prompt.propTypes = {
  visible: PropTypes.bool,
  title: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired
};

Prompt.defaultProps = {
  visible: true
};

export default Prompt;
