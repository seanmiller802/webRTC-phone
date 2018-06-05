import React from 'react';
import Snackbar from 'material-ui/Snackbar';

class CustomSnackBar extends React.Component{
  constructor(props) {
    super(props);

    this.state = {
      open: this.props.snackbarOpen,
    }

    this.onRequestClose = this.onRequestClose.bind(this);
  }

  //
  componentWillReceiveProps(nextProps) {
    if(this.props.snackbarOpen !== nextProps.snackbarOpen) {
      this.setState({ open: nextProps.snackbarOpen });
    }
  }

  onRequestClose() {
    this.setState({ open: false});
  }

  render() {
    return (
      <Snackbar
        open={this.state.open}
        message={this.props.snackbarMessage}
        autoHideDuration={2000}
        onRequestClose={this.onRequestClose}
      />
    )
  }
}
export default CustomSnackBar;
