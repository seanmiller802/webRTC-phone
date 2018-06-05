import React from 'react';
import { Tooltip, OverlayTrigger } from 'react-bootstrap';
import Drawer from 'material-ui/Drawer';
import PhonePad from './phone_pad.jsx';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

const phone_tooltip = (
	<Tooltip id="tooltip">
		Toggle Phone
	</Tooltip>
);

class DrawerToggle extends React.Component {

  constructor(props) {
    super(props);

		this.state = {
      open: true,
    };

		this.handleToggle   = this.handleToggle.bind(this);
  }

	// toggle the drawer
  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    return (
      <div>
        <OverlayTrigger
					placement="left"
					overlay={phone_tooltip}
					>
	          <FloatingActionButton
	            onClick={this.handleToggle}
	            className="callButton"
	            >
	            <i className="material-icons">phone</i>
	          </FloatingActionButton>
        </OverlayTrigger>
        <Drawer
          open={this.state.open}
          id="drawer"
					width='25%'
          >
          <PhonePad />
        </Drawer>
      </div>
    )
  }
}

export default DrawerToggle;
