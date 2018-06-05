import React from 'react';
import AppBar from 'material-ui/AppBar';
import muiThemeable from 'material-ui/styles/muiThemeable';
import logo from '../static/primary-logo.png';

const styles = {
  navbar: {
    backgroundColor: '#ffffff',
  }
}

const logoPath = 'https://www.plivo.com/assets/dist/images/primary-logo.svg';

const NavBar = (props) => (
  <AppBar
    title={<img src={logoPath} className="logo"/>}
    showMenuIconButton={false}
    style={styles.navbar}
  />
);

export default muiThemeable() (NavBar);
