import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import URL from '../../urls';

/**
 * Get all messages in a thread and display them.
 */
class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      id: props.thread_id
    }
  }
  /**
   * make APi call to get all data from the server.
   * @return {[type]} [description]
   */
  componentWillMount() {
    axios.get(URL.threads(this.state.id),{})
      .then(res => {
        const jsonData = res.data
        this.setState({
          items: jsonData.items,
        })
      })
      .catch(err => {
        this.setState({
          items: []
        })
      })
  }
  render() {
    return (
      <div>
        {this.state.items.map(elem => {
          return (
            <div key={elem.pk}>
              {elem.message}
            </div>
          )
        })}
      </div>
    )
  }
}

Thread.propTypes = {
  thread_id: PropTypes.number.isRequired,
}

export default Thread;
