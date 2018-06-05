import React, {Component} from 'react';
import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';

const styles = {
  footer: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    textAlign: 'center',
  }
}
// const heartIcon  = <i class="fas fa-heart fa-2x"></i>;
const githubIcon = (
  <a href="https://github.com/seanmiller802/webRTC-phone" target="_blank">
    <i className="fab fa-github fa-2x"></i>
  </a>
);

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };

    this.select = this.select.bind(this);
  }

  select(index) {
    this.setState({selectedIndex: index});
  }

  render() {
    return (
      <Paper zDepth={1} style={styles.footer}>
        <BottomNavigation selectedIndex={this.state.selectedIndex}>
          <BottomNavigationItem
            label=""
            icon={githubIcon}
            onClick={() => this.select(0)}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

export default Footer;
