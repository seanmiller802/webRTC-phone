import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';
import NavBar from './components/nav_bar.jsx';
import DrawerToggle from './components/drawer_toggle.jsx';
import Footer from './components/footer.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { purple600 } from 'material-ui/styles/colors';
require('./css/style.css');

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#2bb031',
  }
});

class App extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return(
      <Fragment>
        <MuiThemeProvider muiTheme={muiTheme}>
          <NavBar />
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={muiTheme}>
          <DrawerToggle />
        </MuiThemeProvider>
        <MuiThemeProvider muiTheme={muiTheme}>
          <Footer />
        </MuiThemeProvider>
      </Fragment>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
