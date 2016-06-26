import React from 'react'
import ReactDOM from 'react-dom'
import {connect} from 'react-redux'
import generateId from './generateId'
const {Component, PropTypes} = React
const noop = () => {}

const PropDecorator = (options = {}) => (DecoratedComponent) => {
  const displayName =
    DecoratedComponent.displayName ||
    DecoratedComponent.name ||
    'Component';

  class Prop extends Component {
    constructor (props) {
      super(props)
      this.show = this.show.bind(this)
      this.hide = this.hide.bind(this)
      this.render = this.render.bind(this)
      this.componentDidMount =
      this.componentDidUpdate = this.registerProp.bind(this)
      this.id = generateId()
    }

    registerProp () {
      this.detachProp = this.context.visCont.registerProp(
        this.context.actorId,
        DecoratedComponent,
        this.props
      )
    }

    componentWillUnmount () {
      (this.detachProp || noop)()
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
  Prop.contextTypes = {
    visCont: PropTypes.object.isRequired,
    actorId: PropTypes.string.isRequired
  }
  Prop.displayName = `Prop(${displayName})`
  return Prop
}

export default PropDecorator
