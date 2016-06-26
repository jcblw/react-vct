import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import generateId from './generateId'
import serializeCSSBlock from './serializeCSS'
const {Component} = React;
const initialStyles = {
  position: 'fixed',
  left: 0,
  right: 0
};

class Lead extends Component {
  constructor (...args) {
    super(...args)
    this.state = {
      isInInitialState: true,
      isReadyToAnimate: false
    }
  }

  componentDidUpdate () {
    const {isInInitialState, isReadyToAnimate} = this.state;
    const {isAnimating, timeout, clearAnimation, frames, onAnimationDone} = this.props;
    const frame = frames[0];
    if (isInInitialState && isAnimating && isReadyToAnimate) {
      this._timeout = setTimeout(() => {
        onAnimationDone();
        clearAnimation();
        this.setState({
          isInInitialState: true,
          isReadyToAnimate: false
        });
      }, timeout)
      this.setState({isInInitialState: false})
    }

    if (isInInitialState && !isReadyToAnimate && frame) {
      this._timeout = setTimeout(() => this.setState({isReadyToAnimate: true}), 0)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.frames.length && !this.props.frames.length) {
      clearTimeout(this._timeout)
      const {frames, timeout} = nextProps;
      this.id = generateId()
      const css = serializeCSSBlock(
        this.id,
        mapFrameStyles(frames[0]) || {},
        mapFrameStyles(frames[1]) || {},
        timeout
      )
      this.setState({
        css
      })
    }
  }

  render () {
    const {isInInitialState, isReadyToAnimate, css} = this.state
    const {frames, timeout} = this.props
    const frame = isInInitialState ? null : this.props.frames[1]
    const styles = Object.assign({}, initialStyles, mapFrameStyles(frame || {}, timeout))
    return (
      <span>
        <style type='text/css'>{css}</style>
        <div
          id={`vc-${this.id}`}
          className={`Lead ${isReadyToAnimate ? 'is-animating' : ''} ${frame ? 'has-frame' : ''}`}
        >
          {this.props.children}
        </div>
      </span>
    )
  }
}

export default Lead

export function mapFrameStyles (frame = {}, timeout) {
  const {width, height, x, y} = frame
  return Object.assign({
    transform: `translate3d(${x}px, ${y}px, 0)`
  }, frame)
}

export function uniqueKeys (style, style2) {
  return Object.keys(style)
    .filter(k => style[k] !== style2[k] && unwantedKeys.indexOf(k) === -1)
}
