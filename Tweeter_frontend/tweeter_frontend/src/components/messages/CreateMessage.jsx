import React, {Component} from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import URL from '../../urls';
import TweeterMessage from '../../lib/TweeterMessage'


/**
 * Create a new tweet message to store
 */
class CreateMessage extends Component {
  constructor(props) {
     super();
     this.state = {
       message: '',
       errors: "",
     }
     this.handleChange = this.handleChange.bind(this)
     this.handleSubmit = this.handleSubmit.bind(this)
     this._getMessages = this._getMessages.bind(this)
     this._getShortMessage = this._getShortMessage.bind(this)
  }

  /**
   * Handle change in the input field on Change update state
   * @param  {[EventEmitter]} e event of input change
   */
  handleChange(e) {
    const message = e.target.value;
    this.setState({ message , errors: ""})
  }

  /**
   *  create snippet of the message to show
   * @return {[String]} short string is generated
   */
  _getShortMessage() {
    let { message } = this.state;
    if (message.length <= 20) {
      return message;
    } else {
      return message.slice(0,17) + "..."
    }
  }

  /**
   * get messages and shortMessage from message.
   * If message can not be splited it throws an error
   *
   * @return {[String, Array(String)]} Short Snippet and Messages are returned.
   */
  _getMessages() {
    let shortMessage = this._getShortMessage()
    const tweeterMessage = new TweeterMessage(this.state.message)
    let [isValid, reason] = tweeterMessage.isValid()
    if (isValid) {
      const messages = tweeterMessage.splitMessage()
      return [shortMessage, messages]
    }
    throw new Error(reason)
  }

  /**
   * Executed on Submit button pressed.
   *
   * Does a post API call to save the message.
   */
  handleSubmit(){
    let shortMessage, messages;
    try {
      [shortMessage, messages] = this._getMessages()
    } catch(err) {
      console.log(err, "Error")
      this.setState({ errors: err.message})
    }
    console.log(shortMessage, messages)
    axios.post(URL.messages, { messages,short_messaage: shortMessage})
      .then( res => {
        this.setState({ message: '', errors: ""}, this.props.onSave)
      })
      .catch(err => {
        this.setState({ errors: err.message})
      })
  }

  /**
   * Render input form.
   * input field and submit button to save message.
   *
   */
  render() {
    return (
      <div>
        <input type="text" value={this.state.message} onChange={this.handleChange}/>
        <button onClick={this.handleSubmit}>Submit</button>
        {this.state.errors.length ? <p>{this.state.errors}</p>: null}
      </div>
    )
  }
}

CreateMessage.propTypes = {
    onSave: PropTypes.func.isRequired, // Execute on Save
};

export default CreateMessage
