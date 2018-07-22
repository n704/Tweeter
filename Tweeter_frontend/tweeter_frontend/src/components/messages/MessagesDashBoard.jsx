import React, { Component } from 'react';
import axios from 'axios';
import URL from '../../urls';
import CreateMessage from './CreateMessage';
import MessageItem from './MessageItem';


/**
 * Main DashBoard for the tweet splitter.
 * It consists of Form for inputting new messages and list of messages.
 * @type {Object}
 */
export default class MessagesDashBoard extends Component {
  constructor(props) {
     super();
     this.state = {
       items: [],
     }
     this.getData = this.getData.bind(this);
  }
  componentWillMount() {
    this.getData()
  }
  /**
   * GetData from the server on update and mounting.
   * @return {[type]} [description]
   */
  getData() {
    axios.get(URL.messages, {})
      .then( res => {
        const jsonData = res.data
        this.setState({
          items: jsonData.items,
        })
      })
      .catch( err => {
        this.setState({
          items: []
        })
      })
  }

  render() {
    return (
      <div>
        <CreateMessage onSave={this.getData}/>
        {this.state.items.map(elem => {
          return (
            <MessageItem key={elem.pk} message={elem.short_message} id={elem.pk} />
          )
        })}
      </div>
    )
  }
}
