import PropTypes from 'prop-types'
import React from 'react'
import {
  StyleSheet,
  View,
  Keyboard,
  ViewPropTypes,
  EmitterSubscription,
  ViewStyle,
} from 'react-native'

import Composer from './Composer'
import Send from './Send'
import Actions from './Actions'
import Color from './Color'

const styles = StyleSheet.create({
  container: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Color.defaultColor,
    backgroundColor: Color.white,
    bottom: 0,
    left: 0,
    right: 0,
  },
  primary: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  accessory: {
    height: 44,
  },
})

interface InputToolbarProps {
  options?: { [key: string]: any }
  optionTintColor?: string
  containerStyle?: ViewStyle
  primaryStyle?: ViewStyle
  accessoryStyle?: ViewStyle
  renderAccessory?(props: InputToolbarProps): React.ReactNode
  renderActions?(props: Actions['props']): React.ReactNode
  renderSend?(props: Send['props']): React.ReactNode
  renderComposer?(props: Composer['props']): React.ReactNode
  onPressActionButton?(): void
}

export default class InputToolbar extends React.Component<
  InputToolbarProps,
  { position: string }
> {
  static defaultProps = {
    renderAccessory: null,
    renderActions: null,
    renderSend: null,
    renderComposer: null,
    containerStyle: {},
    primaryStyle: {},
    accessoryStyle: {},
    onPressActionButton: () => {},
  }

  static propTypes = {
    renderAccessory: PropTypes.func,
    renderActions: PropTypes.func,
    renderSend: PropTypes.func,
    renderComposer: PropTypes.func,
    onPressActionButton: PropTypes.func,
    containerStyle: ViewPropTypes.style,
    primaryStyle: ViewPropTypes.style,
    accessoryStyle: ViewPropTypes.style,
  }

  state = {
    position: 'absolute',
  }

  keyboardWillShowListener?: EmitterSubscription = undefined
  keyboardWillHideListener?: EmitterSubscription = undefined

  componentWillMount() {
    this.keyboardWillShowListener = Keyboard.addListener(
      'keyboardWillShow',
      this.keyboardWillShow,
    )
    this.keyboardWillHideListener = Keyboard.addListener(
      'keyboardWillHide',
      this.keyboardWillHide,
    )
  }

  componentWillUnmount() {
    if (this.keyboardWillShowListener) {
      this.keyboardWillShowListener.remove()
    }
    if (this.keyboardWillHideListener) {
      this.keyboardWillHideListener.remove()
    }
  }

  keyboardWillShow = () => {
    if (this.state.position !== 'relative') {
      this.setState({
        position: 'relative',
      })
    }
  }

  keyboardWillHide = () => {
    if (this.state.position !== 'absolute') {
      this.setState({
        position: 'absolute',
      })
    }
  }

  renderActions() {
    const { containerStyle, ...props } = this.props
    if (this.props.renderActions) {
      return this.props.renderActions(props)
    } else if (this.props.onPressActionButton) {
      return <Actions {...props} />
    }
    return null
  }

  renderSend() {
    if (this.props.renderSend) {
      return this.props.renderSend(this.props)
    }
    return <Send {...this.props} />
  }

  renderComposer() {
    if (this.props.renderComposer) {
      return this.props.renderComposer(this.props)
    }

    return <Composer {...this.props} />
  }

  renderAccessory() {
    if (this.props.renderAccessory) {
      return (
        <View style={[styles.accessory, this.props.accessoryStyle]}>
          {this.props.renderAccessory(this.props)}
        </View>
      )
    }
    return null
  }

  render() {
    return (
      <View
        style={
          [
            styles.container,
            this.props.containerStyle,
            { position: this.state.position },
          ] as ViewStyle
        }
      >
        <View style={[styles.primary, this.props.primaryStyle]}>
          {this.renderComposer()}
          {this.renderActions()}
          {this.renderSend()}
        </View>
        {this.renderAccessory()}
      </View>
    )
  }
}
