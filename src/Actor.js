import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import generateId from './generateId'
const {Component, PropTypes} = React
const noop = () => {}

const ActorDecorator = (options = {}) => (DecoratedComponent) => {
  const displayName =
    DecoratedComponent.displayName ||
    DecoratedComponent.name ||
    'Component';

  class Actor extends Component {
    constructor (props) {
      super(props)
      this.show = this.show.bind(this)
      this.hide = this.hide.bind(this)
      this.id = generateId()
    }

    componentDidMount () {
      this.detachActor = this.context.visCont.registerActor(this)
    }

    componentWillUnmount () {
      ;(this.detachActor || noop)()
    }

    getChildContext () {
      return {
        visCont: this.context.visCont,
        actorId: this.id
      }
    }

    hide (...args) {
      this.refs.node.hide(...args)
    }

    show (...args) {
      this.refs.node.show(...args)
    }

    render () {
      return (
        <DecoratedComponent
          ref='node'
          {...this.props}
        />
      )
    }
  }
  Actor.childContextTypes = {
    visCont: PropTypes.object.isRequired,
    actorId: PropTypes.string.isRequired
  }
  Actor.contextTypes = {visCont: PropTypes.object.isRequired}
  Actor.displayName = `Actor(${displayName})`
  return Actor
}

export default ActorDecorator
