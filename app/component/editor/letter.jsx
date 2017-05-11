import React from "react";
import PropTypes from "prop-types";

export default class Letter extends React.PureComponent {
  constructor(props) {
    super(props);
    this._handleClick = this._handleClick.bind(this);
    this._togglePixel = this._togglePixel.bind(this);
    this._handleKey = this._handleKey.bind(this);
    this._addWidth = this._addWidth.bind(this);
    this._removeWidth = this._removeWidth.bind(this);
  }
  _addWidth() {
    var data = Object.assign({}, this.props.data);
    var xDimension = this.props.data.pixels.length / this.props.lineHeight;
    var newPixels = new Array(data.pixels.length + this.props.lineHeight);
    for (let i = 0, i2 = 0; i < data.pixels.length; i++, i2++) {
      newPixels[i2] = data.pixels[i];
      if (i % xDimension === xDimension - 1) newPixels[++i2] = 0;
    }
    data.pixels = newPixels;
    this.props.onChange(data);
  }
  _removeWidth() {
    var data = Object.assign({}, this.props.data);
    var xDimension = this.props.data.pixels.length / this.props.lineHeight;
    if (xDimension <= 1) return;
    var newPixels = new Array(data.pixels.length - this.props.lineHeight);
    for (let i = 0, i2 = 0; i < data.pixels.length; i++) {
      if (i % xDimension !== xDimension - 1) {
        newPixels[i2++] = data.pixels[i];
      }
    }
    data.pixels = newPixels;
    this.props.onChange(data);
  }
  _handleClick(e) {
    if (!this.props.active) {
      e.target.parentNode.querySelector("button:first-child").focus();
      this.props.onSelect(this.props.data);
      return;
    }
  }
  _togglePixel(e) {
    var data = Object.assign({}, this.props.data);
    // data.pixels = data.pixels.slice();
    var targetPixelIndex = Number(e._targetInst._currentElement.key);
    // toggle pixel
    data.pixels[targetPixelIndex] = ++data.pixels[targetPixelIndex] % 2;
    // calculate filled pixels
    data.filled = data.pixels.filter(pixel => !!pixel).length;
    // trigger onChange event
    this.props.onChange(data);
  }
  _handleKey(e) {
    var currentIndex = Number(e._targetInst._currentElement.key);
    var nextIndex = currentIndex;
    var xDimension = this.props.data.pixels.length / this.props.lineHeight;
    switch (e.keyCode) {
      case 38: // up
        e.preventDefault();
        nextIndex -= xDimension;
        break;
      case 40: // down
        e.preventDefault();
        nextIndex += xDimension;
        break;
      case 37: // left
        e.preventDefault();
        nextIndex--;
        break;
      case 39: // right
        e.preventDefault();
        nextIndex++;
        break;
      case 32 || 13: // toggle
        e.preventDefault();
        this._togglePixel(e);
        break;
    }
    var nextElement = e.target.parentNode.querySelector(
      `:nth-child(${nextIndex + 1})`
    );
    if (nextElement) nextElement.focus();
  }
  render() {
    var { data, lineHeight } = this.props;
    return (
      <span
        className={`letter ${this.props.active ? "active" : ""}`}
        style={{
          flexBasis: Math.ceil(data.pixels.length / lineHeight + 1) * 20
        }}
        onFocus={this._handleClick}
        onKeyDown={this._handleKey}
      >
        {data.pixels.map((fill, i) => (
          <button
            onClick={this._togglePixel}
            className={fill ? "filled" : "empty"}
            key={i}
          />
        ))}
        <div className="add" onClick={this._addWidth} />
        <div className="remove" onClick={this._removeWidth} />
        <div className="sel" onClick={this._handleClick} />
        <div className="key">[{data.key}]</div>
      </span>
    );
  }
}

Letter.propTypes = {
  data: PropTypes.object.isRequired,
  lineHeight: PropTypes.number.isRequired,
  onSelect: PropTypes.func,
  onChange: PropTypes.func,
  active: PropTypes.bool
};
