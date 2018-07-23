import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import URL from '../../urls';
import TweeterMessage from '../../lib/TweeterMessage';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

/**
 * Create a new tweet message to store
 */
class CreateMessage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      errors: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this._getMessages = this._getMessages.bind(this);
    this._getShortMessage = this._getShortMessage.bind(this);
  }

  /**
   * Handle change in the input field on Change update state
   * @param  {[EventEmitter]} e event of input change
   */
  handleChange(e) {
    const message = e.target.value;
    this.setState({ message, errors: '' });
  }

  /**
   *  create snippet of the message to show
   * @return {[String]} short string is generated
   */
  _getShortMessage() {
    const { message } = this.state;
    if (message.length <= 20) {
      return message;
    }
    return `${message.slice(0,17)}...`;
  }

  /**
   * get messages and shortMessage from message.
   * If message can not be splited it throws an error
   *
   * @return {[String, Array(String)]} Short Snippet and Messages are returned.
   */
  _getMessages() {
    const shortMessage = this._getShortMessage();
    const { message } = this.state;
    const tweeterMessage = new TweeterMessage(message);
    const [isValid, reason] = tweeterMessage.isValid();
    if (isValid) {
      const messages = tweeterMessage.splitMessage();
      return [shortMessage, messages];
    }
    throw new Error(reason);
  }

  /**
   * Executed on Submit button pressed.
   *
   * Does a post API call to save the message.
   */
  handleSubmit() {
    let shortMessage;
    let messages;
    const { onSave } = this.props;
    try {
      [shortMessage, messages] = this._getMessages()
    } catch (err) {
      this.setState({ errors: err.message });
    }
    axios.post(URL.messages, { messages,short_message: shortMessage })
      .then(() => this.setState({ message: '', errors: '' }, onSave))
      .catch(err => this.setState({ errors: err.message }));
  }

  /**
   * Render input form.
   * input field and submit button to save message.
   *
   */
  render() {
    const { errors, message } = this.state;
    const { classes } = this.props;
    return (
      <Paper elevation={1}>
        <TextField
          fullWidth
          label="Tweeter Message"
          value={message}
          className={classes.textField}
          onChange={this.handleChange}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          onClick={this.handleSubmit}
        >
            Submit
        </Button>
        {errors.length ? (
          <Typography component="p">
            {errors}
          </Typography>) : null}
      </Paper>
    );
  }
}

CreateMessage.propTypes = {
  onSave: PropTypes.func.isRequired, // Execute on Save
  classes: PropTypes.object.isRequired, // Classname and css style
};
export default withStyles(styles)(CreateMessage);
