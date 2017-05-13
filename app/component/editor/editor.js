import React from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import Letter from "./letter";
import "./editor.css";

import { StickyContainer, Sticky } from "react-sticky";
import Prompt from "../prompt";
import Tabs from "antd/lib/tabs";
import Button from "antd/lib/button";
import Slider from "antd/lib/slider";
import Input from "antd/lib/input";
import Switch from "antd/lib/switch";
import Modal from "antd/lib/modal";

var Tab = Tabs.TabPane;
class Editor extends React.Component {
  static selectedLetter;
  constructor(props) {
    super(props);
    this._close = this._close.bind(this);
    this._selectLetter = this._selectLetter.bind(this);
    this._changeLetter = this._changeLetter.bind(this);

    this._deleteLetter = this._deleteLetter.bind(this);
    this._cloneLetter = this._cloneLetter.bind(this);
    this._clearPixels = this._clearPixels.bind(this);
    this._changeKey = this._changeKey.bind(this);
    this._toggleLineHeight = this._toggleLineHeight.bind(this);
    this._changeLineHeight = this._changeLineHeight.bind(this);
    this._updateSource = this._updateSource.bind(this);
    this._changeOrder = this._changeOrder.bind(this);
    this._changeOrderLeft = this._changeOrderLeft.bind(this);
    this._changeOrderRight = this._changeOrderRight.bind(this);
    this._addLetter = this._addLetter.bind(this);
    this._changeFontName = this._changeFontName.bind(this);
    this._changeFontInfo = this._changeFontInfo.bind(this);
    this._changeFontLink = this._changeFontLink.bind(this);
    this._changeFontHeight = this._changeFontHeight.bind(this);
    this.handleSave = this.handleSave.bind(this);
    var data = Object.assign({}, this.props.data);
    data.letters.sort((a, b) => a.order - b.order);
    this.state = {
      selectedIndex: -1,
      dataSet: data,
      source: "",
      prompt: false,
      sliderValue: null,
      warn: false
    };
  }
  _changeFontHeight() {
    var { dataSet } = this.state;
    var lineHeight = dataSet.lineHeight;
    var newLineHeight = this.state.sliderValue;

    var newLetters = dataSet.letters.map(letter => {
      if (letter.lineHeight) return letter;
      var newLetter = Object.assign({}, letter);
      var lineWidth = letter.pixels.length / lineHeight;
      var sub = Math.abs(lineHeight - newLineHeight);
      var newPixels = letter.pixels.slice();
      if (lineHeight > newLineHeight) {
        newPixels = newPixels.slice(0, letter.pixels.length - sub * lineWidth);
      } else if (lineHeight < newLineHeight) {
        console.log(sub);
        newPixels = [
          ...newPixels,
          ...Array(...Array(lineWidth * sub)).map(() => 0)
        ];
      }
      newLetter.pixels = newPixels;
      return newLetter;
    });

    this.setState({
      dataSet: Object.assign({}, dataSet, {
        letters: newLetters,
        lineHeight: newLineHeight
      }),
      warn: false
    });
  }
  _changeFontName(e) {
    var { dataSet } = this.state;
    dataSet.name = e.target.value;
    this.setState({ dataSet });
  }
  _changeFontInfo(e) {
    var { dataSet } = this.state;
    dataSet.info = e.target.value;
    this.setState({ dataSet });
  }
  _changeFontLink(e) {
    var { dataSet } = this.state;
    dataSet.link = e.target.value;
    this.setState({ dataSet });
  }
  handleSave() {
    this.props.onSave(this.state.dataSet);
  }
  _toggleLineHeight(e) {
    var { dataSet } = this.state;
    this._changeLineHeight(dataSet.lineHeight, !e);
  }
  _changeLineHeight(newLineHeight, close = false) {
    var { dataSet, selectedIndex } = this.state;
    var letter = dataSet.letters[selectedIndex];
    var lineHeight = letter.lineHeight || dataSet.lineHeight;
    var lineWidth = letter.pixels.length / lineHeight;
    var sub = Math.abs(lineHeight - newLineHeight);
    var newPixels = letter.pixels;
    if (lineHeight > newLineHeight) {
      newPixels = newPixels.slice(0, letter.pixels.length - sub * lineWidth);
    } else if (lineHeight < newLineHeight) {
      newPixels = [
        ...newPixels,
        ...Array(...Array(lineWidth * sub)).map(() => 0)
      ];
    }

    this._changeLetter({
      lineHeight: close ? undefined : newLineHeight,
      pixels: newPixels
    });
  }
  _changeOrderLeft() {
    this._changeOrder(false);
  }
  _changeOrderRight() {
    this._changeOrder(true);
  }
  _cloneLetter() {
    var { dataSet, selectedIndex } = this.state;
    var newDataSet = Object.assign({}, dataSet);
    var newLetter = Object.assign({}, dataSet.letters[selectedIndex]);
    newLetter.key = "_" + newLetter.key;
    newLetter.pixels = [...newLetter.pixels];
    var separated = newDataSet.letters.splice(selectedIndex + 1);
    newDataSet.letters = [...newDataSet.letters, newLetter, ...separated];
    this.setState({ dataSet: newDataSet });
  }
  _addLetter() {
    var { dataSet } = this.state;
    var newDataSet = Object.assign({}, dataSet);
    var newLetter = {
      key: "new",
      pixels: Array(...Array(dataSet.lineHeight * dataSet.lineHeight)).map(
        () => 0
      )
    };
    newDataSet.letters.push(newLetter);
    this.setState({
      dataSet: newDataSet,
      selectedIndex: newDataSet.letters.length - 1
    });
  }
  _changeOrder(plus) {
    var relative = plus ? 1 : -1;
    var { dataSet, selectedIndex } = this.state;
    if (
      selectedIndex + relative < 0 ||
      selectedIndex + relative >= this.state.dataSet.letters.length
    )
      return;
    var newDataSet = Object.assign({}, dataSet);
    var temp = newDataSet.letters[selectedIndex];
    newDataSet.letters[selectedIndex] =
      newDataSet.letters[selectedIndex + relative];
    newDataSet.letters[selectedIndex + relative] = temp;
    this.setState({ selectedIndex: selectedIndex + relative });

    this.setState({ dataSet: newDataSet });
  }
  _selectLetter(target) {
    this.setState({
      selectedIndex: this.state.dataSet.letters.findIndex(
        letter => letter === target
      )
    });
  }
  _updateSource() {
    var { dataSet } = this.state;
    var newDataSet = Object.assign({}, dataSet);
    var obj = {};
    newDataSet.letters.forEach((item, i) => {
      item.order = i;
      obj[item.key] = item;
    });
    newDataSet.letters = obj;
    this.setState({ source: JSON.stringify(newDataSet) });
  }
  _changeLetter(newData) {
    var { dataSet, selectedIndex } = this.state;
    var newDataSet = Object.assign({}, dataSet);
    newDataSet.letters[selectedIndex] = Object.assign(
      {},
      newDataSet.letters[selectedIndex],
      newData
    );
    this.setState({ dataSet: newDataSet });
  }
  _deleteLetter() {
    var newDataSet = Object.assign({}, this.state.dataSet);
    newDataSet.letters.splice(this.state.selectedIndex, 1);
    this.setState({ dataSet: newDataSet });
  }
  _changeKey(newKey) {
    var { dataSet, selectedIndex } = this.state;
    if (dataSet.letters[selectedIndex].key === newKey) {
      this.setState({ prompt: false });
      return;
    }
    var isKeyExisted = this.state.dataSet.letters.some(
      item => item.key === newKey
    );
    if (isKeyExisted || !newKey) {
      alert("this key is already in use or not valid.");
      return;
    }
    this._changeLetter({ key: newKey });
    this.setState({ prompt: false });
  }
  _clearPixels() {
    var newDataSet = Object.assign({}, this.state.dataSet);
    var newLetter = Object.assign(
      {},
      this.state.dataSet.letters[this.state.selectedIndex]
    );
    newLetter.pixels = newLetter.pixels.map(() => 0);

    newDataSet.letters[newLetter.key] = newLetter;
    this.setState({ dataSet: newDataSet });
  }
  _close() {
    this.props.history.push("/");
  }
  render() {
    var dataSet = this.state.dataSet;
    var selected = dataSet.letters[this.state.selectedIndex];
    return (
      <div>
        <div>
          <h1>{dataSet.name}</h1>
          <p>
            <a className="link" target="_blank" href={dataSet.link}>
              {dataSet.link}
            </a>
          </p>
        </div>
        <Tabs
          className="tabContainer"
          onChange={this._updateSource}
          tabBarExtraContent={
            <div>
              <Button style={{ marginRight: 10 }} onClick={this._close}>
                Close
              </Button>
              <Button
                type="danger"
                icon="delete"
                style={{
                  marginRight: 10,
                  display: this.props.delete ? "inline-block" : "none"
                }}
                onClick={this.props.onDelete}
              >
                Delete
              </Button>
              <Button onClick={this.handleSave} type="primary">Save</Button>
            </div>
          }
        >
          <Tab tab="Letters" key="1">
            <StickyContainer>
              <div className="row" style={{ margin: 0 }}>
                <div className="col-9">
                  <div className="letters row">
                    {dataSet.letters.map((letter, i) => {
                      return (
                        <Letter
                          key={i}
                          data={letter}
                          onSelect={this._selectLetter}
                          onChange={this._changeLetter}
                          active={i === this.state.selectedIndex}
                          lineHeight={letter.lineHeight || dataSet.lineHeight}
                        />
                      );
                    })}

                    <span
                      className={`newLetter`}
                      onClick={this._addLetter}
                      style={{ height: dataSet.lineHeight * 22 }}
                    >
                      Add New
                    </span>
                  </div>
                </div>
                <div className="col-3">
                  <Sticky>

                    {({ style }) => (
                      <div style={Object.assign(style, { padding: "10px 0" })}>

                        {!selected
                          ? <p> select for modify a letter </p>
                          : <div>
                              <Button
                                size="large"
                                icon="edit"
                                style={{ width: "100%", margin: "5px 0" }}
                                onClick={() =>
                                  this.setState({ prompt: !this.state.prompt })}
                              >
                                Change Key
                              </Button>
                              <Prompt
                                visible={this.state.prompt}
                                title="Please type letter key"
                                onChange={this._changeKey}
                                defaultValue={selected.key}
                                onClose={() =>
                                  this.setState({ prompt: !this.state.prompt })}
                              />

                              <Button
                                size="large"
                                icon="delete"
                                style={{ width: "100%", margin: "5px 0" }}
                                onClick={this._deleteLetter}
                              >
                                Delete Letter
                              </Button>
                              <Button
                                icon="copy"
                                size="large"
                                style={{ width: "100%", margin: "5px 0" }}
                                onClick={this._cloneLetter}
                              >
                                Clone Letter
                              </Button>
                              <Button
                                icon="retweet"
                                size="large"
                                style={{ width: "100%", margin: "5px 0" }}
                                onClick={this._clearPixels}
                              >
                                Clear Pixels
                              </Button>
                              <hr />
                              Custom Line Height
                              {" "}
                              <Switch
                                size="small"
                                style={{ marginLeft: 5 }}
                                checked={!!selected.lineHeight}
                                onChange={this._toggleLineHeight}
                              />
                              <Slider
                                value={
                                  selected.lineHeight ||
                                    this.state.dataSet.lineHeight
                                }
                                min={5}
                                max={15}
                                disabled={!selected.lineHeight}
                                onChange={this._changeLineHeight}
                              />
                              <hr />
                              <div className="row">
                                <div className="col-6">Filled Pixels:</div>
                                <div className="col-6">
                                  {selected.filled}
                                </div>
                                <div className="col-6">Total Pixels:</div>
                                <div className="col-6">
                                  {selected.pixels.length}
                                </div>
                                <div className="col-6">Order:</div>
                                <div className="col-6">
                                  <Button
                                    shape="circle"
                                    style={{ marginLeft: 5 }}
                                    onClick={this._changeOrderLeft}
                                  >
                                    -
                                  </Button>
                                  {` ${this.state.selectedIndex + 1} `}
                                  <Button
                                    shape="circle"
                                    style={{ marginLeft: 5 }}
                                    onClick={this._changeOrderRight}
                                  >
                                    +
                                  </Button>
                                </div>
                              </div>

                            </div>}
                      </div>
                    )}
                  </Sticky>
                </div>

              </div>
            </StickyContainer>
          </Tab>
          <Tab tab="Font Settings" key="2">
            <div className="row settings" style={{ margin: 0 }}>
              <div className="col-4">
                Font Name
              </div>
              <div className="col-8">
                <Input
                  size="large"
                  value={dataSet.name}
                  onChange={this._changeFontName}
                />
              </div>
              <div className="col-4">Link</div>
              <div className="col-8">
                <Input
                  size="large"
                  value={dataSet.link}
                  onChange={this._changeFontLink}
                />
              </div>
              <div className="col-4">Line Height</div>
              <div className="col-8">
                <Slider
                  defaultValue={dataSet.lineHeight}
                  min={5}
                  ref={ref => (this.lineHeight = ref)}
                  max={15}
                  disabled={!dataSet.lineHeight}
                  onAfterChange={val => {
                    this.setState({ warn: true, sliderValue: val });
                  }}
                />
                <Modal
                  title="Warning"
                  okText="Change"
                  cancelText="Cancel"
                  visible={this.state.warn}
                  closable={false}
                  onCancel={() => this.setState({ warn: false })}
                  onOk={this._changeFontHeight}
                >
                  <p>Are you sure to change whole line Height?</p>
                </Modal>
              </div>
              <div className="col-4">Info</div>
              <div className="col-8">
                <textarea
                  style={{ height: 100 }}
                  value={dataSet.info}
                  onChange={this._changeFontInfo}
                />
              </div>
            </div>
          </Tab>
          <Tab tab="Source" key="3">
            <textarea value={this.state.source} />
          </Tab>
        </Tabs>

      </div>
    );
  }
}

Editor.propTypes = {
  data: PropTypes.object.isRequired,
  history: PropTypes.object,
  delete: PropTypes.bool,
  onDelete: PropTypes.func,
  onSave: PropTypes.func
};

export default withRouter(Editor);
