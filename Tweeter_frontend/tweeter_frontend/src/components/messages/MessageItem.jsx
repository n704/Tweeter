import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import { withStyles } from '@material-ui/core/styles';
import Thread from '../thread';


const styles = theme => ({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
});

/**
 * List of the message snippet in order to see
 */
class MessageItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      message: props.message,
      id: props.id,
    };
  }

  /**
   * render messageItem,
   * On click all the tweets message in the chain are displayed.
   *
   */
  render() {
    const { classes } = this.props;
    const { message, show, id } = this.state;
    return (
      <Card>
        <CardHeader
          title={message}
          action={(
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: show,
              })}
              onClick={() => this.setState({ show: !show })}
            >
              <ExpandMoreIcon />
            </IconButton>)
          }
        />
        <Collapse in={show} timeout="auto" unmountOnExit>
          <CardContent>
            {show ? <Thread thread_id={id} /> : null}
          </CardContent>
        </Collapse>
      </Card>
    );
  }
}

MessageItem.propTypes = {
  message: PropTypes.string.isRequired,
  id: PropTypes.number.isRequired,
  classes: PropTypes.objects,
};

export default withStyles(styles)(MessageItem);
