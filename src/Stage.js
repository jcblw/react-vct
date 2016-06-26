import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import Lead from './Lead'
const {Component, PropTypes} = React
const identity = x => x
const wantedKeys = [
    'width',
    'height',
    'boxShadow',
    'borderWidth',
    'borderRadius',
    'borderColor',
    'borderStyle',
    'backgroundColor',
    'padding',
    'x',
    'y'
]
const wanted = pick(wantedKeys)
const StageDecorator = (options = {}) => (DecoratedComponent) => {
  const displayName =
    DecoratedComponent.displayName ||
    DecoratedComponent.name ||
    'Component';

  class Stage extends Component {
    constructor (props) {
      super(props)
      this.transitionOf = this.transitionOf.bind(this)
      this.registerActor = this.registerActor.bind(this)
      this.registerProp = this.registerProp.bind(this)
      this.actors = {}
    }

    registerActor ({id}) {
      if (typeof this.actors[id] === 'undefined') {
        Object.assign(this.actors, {[id]:{}})
      }
      return () => {
        if (this && this.actors) {
          delete this.actors[id]
        }
      }
    }

    registerProp (actorId, component, props) {
      if (typeof this.actors[actorId] === 'undefined') {
        this.registerActor({id: actorId})
      }
      Object.assign(this.actors[actorId], {
        prop: {component,  props},
        hasProp: true
      })
      return () => {
        if (this && this.actors && this.actors[actorId]) {
          delete this.actors[actorId].prop
        }
      }
    }

    getProp (actorId) {
      const {hasProp, prop} = this.actors[actorId]
      return hasProp ?
        React.cloneElement({
          type:prop.component
        }, prop.props) :
        null
    }

    transitionOf (...refs) {
      const {setAnimation} = this.props;
      const [ref, ref2] = refs
      const {id: actorId} = ref
      this.currentProp = this.getProp(actorId)
      setAnimation(
        refs.map(ref => {
          const el = ReactDOM.findDOMNode(ref)
          return wanted(
            Object.assign({}, getStyles(el), getNodeClientOffset(el))
          )
        }),
        options.timeout,
        ref2.show || identity
      )
      ;(ref.hide || identity)();
    }

    getChildContext () {
      return {
        visCont: {
          registerActor: this.registerActor,
          registerProp: this.registerProp
        }
      }
    }

    render () {
      const {visCont} = this.props;
      return (
        <div>
          <DecoratedComponent
            ref='node'
            transitionOf={this.transitionOf}
            {...this.props}
          />
          <Lead
            {...visCont}
            clearAnimation={this.props.clearAnimation}
          >
            {this.currentProp}
          </Lead>
        </div>
      )
    }
  }
  Stage.childContextTypes = {visCont: PropTypes.object.isRequired}
  Stage.displayName = `Stage(${displayName})`
  return connect(
    mapStateToProps,
    mapDispatchToProps
)(Stage)
}

export default StageDecorator

const ELEMENT_NODE = 1;
export function getNodeClientOffset (node) {
  const el = node.nodeType === ELEMENT_NODE ?
    node :
    node.parentElement

  if (!el) return

  const {top, left} = el.getBoundingClientRect()
  return {x: left, y: top}
}

export function getStyles (node) {
  const styles = document.defaultView.getComputedStyle(node, null)
  return Object.keys(styles)
    .filter(k => k.match(/[a-z]/gi))
    .reduce((accum, k) => {
      accum[k] = styles[k]
      return accum
    }, {})
}

export function pick (keys = []) {
  return (style = {}) => {
    return keys.reduce((accum, k) => {
      accum[k] = style[k]
      return accum
    }, {})
  }
}

export function mapStateToProps ({visCont}) {
  return {
    visCont
  }
}

export function mapDispatchToProps (dispatch) {
  return {
    clearAnimation: () => {
      dispatch({
        type: 'CLEAR_ANIMATION_FRAMES'
      })
    },
    setAnimation: (frames, timeout, onAnimationDone) => {
      dispatch({
        type: 'SET_ANIMATION_FRAMES',
        frames,
        timeout: timeout || 300,
        onAnimationDone
      })
    }
  }
}
