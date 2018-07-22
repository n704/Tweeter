import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Thread from '../thread';


/**
 * List of the message snippet in order to see
 */
class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state ={
      show: false,
      message: props.message,
      id: props.id
    };
  }

    /**
     * render messageItem,
     * On click all the tweets message in the chain are displayed.
     *
     */
    render() {
      return(
        <div onClick={e=> this.setState({ show: !this.state.show})}>
          {this.state.message}
          {this.state.show ? <Thread thread_id={this.state.id} /> : null}
        </div>
      )
    }
  }

MessageItem.propTypes = {
    message: PropTypes.string,
    id: PropTypes.number.isRequired,
};

export default MessageItem
