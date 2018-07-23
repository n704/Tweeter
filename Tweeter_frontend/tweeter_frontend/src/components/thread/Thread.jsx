import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import URL from '../../urls';

/**
 * Get all messages in a thread and display them.
 */
class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      id: props.thread_id,
    };
  }

  /**
   * make APi call to get all data from the server.
   * @return {[type]} [description]
   */
  componentWillMount() {
    const { id } = this.state;
    axios.get(URL.threads(id), {})
      .then((res) => {
        const jsonData = res.data;
        this.setState({
          items: jsonData.items,
        });
      })
      .catch(() => {
        this.setState({
          items: [],
        });
      });
  }

  render() {
    const { items } = this.state;
    return (
      <List>
        {items.map((elem) => {
          return (
            <ListItem key={elem.pk}>
              <ListItemText inset primary={elem.message} />
            </ListItem>
          );
        })}
      </List>
    );
  }
}

Thread.propTypes = {
  thread_id: PropTypes.number.isRequired,
};

export default Thread;
