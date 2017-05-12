# React VCT

[![Greenkeeper badge](https://badges.greenkeeper.io/jcblw/react-vct.svg)](https://greenkeeper.io/)

### Visual Continuity Transitions

This set of components attempts to make doing visual continuity transitions easier.

[**what is visual continuity transitions**](https://material.google.com/motion/choreography.html#choreography-continuity)

> This is very alpha plz use with caution
> These animation are hard! This component does a lot to try to ease the pain of making these animation but is not a one size fits all solution.

### Usage

There are two main components that will need to be used to get basic animations setup.

#### Stage

The stage is the wrapper & controller of the animation. It has the initial and target components inside of it as refs. To apply a `<Stage />` to your components use the decorator pattern. eg.

```javascript
import {Stage} from 'react-vct'

@Stage({timeout: 500}) // timeout eg transition time
class MyComponent extends Component {
  render () {
    return (
      <div>
        <p>Foo</p>
      </div>
    )
  }
}
// can also use ES5 like this
const StagifiedComponent = Stage()(MyComponent)
```

That sets the stage for animations, but we cannot make animations without the next component `Actors`.

#### Actors

Actors are the components that will be transitioned from/to on the stage. You will need at least two actors to transition between. To apply the `<Actor />` to your components the same pattern is used as the `Stage` component.

```javascript
import {Actor} from 'react-vct'

@Actor()
class Card extends Component {
  render () {
    return (
      <div>
        <p>Bar</p>
      </div>
    )
  }
}
```

Now you should be ready to animate!

#### transitionOf

Using the Stage component to decorate your component will give the decorated component access to a method called `transitionOf`. The `transitionOf` takes two component instances, eg refs, and will create a transition between the two.

```javascript
import {Stage} from 'react-vct'
import Card from './Card'

@Stage({timeout: 500}) // timeout eg transition time
class MyComponent extends Component {
  onClick (ref, ref2) {
    return () => {
      this.props.transitionOf(
        this.refs[ref],
        this.refs[ref2]
      )
    }
  }
  render () {
    return (
      <div>
        <Card
          ref='smallCard'
          onClick={this.onClick('smallCard', 'largeCard')}
          position='bottom right'
          size='small'
        />
        <Card
          ref='largeCard'
          onClick={this.onClick('largeCard', 'smallCard')}
          position='top left'
          size='large'
        />
      </div>
    )
  }
}
```

This is the most basic setup, and should allow you to see how to setup a basic animation with `react-vct`
