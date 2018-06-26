import React from 'react';
import SettingsDropdownMenu from './settings.jsx';
import CountrySelector from './country_selector.jsx';
import CallControls from './call_controls.jsx';
import DropDownMenu from 'material-ui/DropDownMenu';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FormControl from 'react-bootstrap';
import TextField from 'material-ui/TextField';
import Subheader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import CustomSnackBar from './custom_snackbar.jsx';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import muiThemeable from 'material-ui/styles/muiThemeable';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: '#2bb031',
  }
});

const styles = {
  errorStyle: {
    color: '#2bb031',
    textAlign: 'center',
  },
  underlineStyle: {
    borderColor: '#2bb031',
  },
  floatingLabelStyle: {
    color: '#2bb031',
  },
  floatingLabelFocusStyle: {
    color: '#2bb031',
  },
  key: {
    height: '88px',
    lineHeight: '88px',
    color: '#2bb031',
  },
  customDropDown: {
    height: '40px',
  },
};

class PhonePad extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '+1',
      agentValue: '',
      phoneStatus: '',
      plivoEndpoint: '',
      plivoPWD: '',
      snackbarOpen: false,
      snackbarMessage: '',
      duration: '',
      timerID: '',
      calling: false,
      muted: false,
      incomingCall: false,
    }

    this.getCredentials            = this.getCredentials.bind(this);
    this.onLogin                   = this.onLogin.bind(this);
    this.onLoginFailed             = this.onLoginFailed.bind(this);
    this.onLogout                  = this.onLogout.bind(this);
    this.handleToggleChange        = this.handleToggleChange.bind(this);
    this.handlePhoneMeNumberChange = this.handlePhoneMeNumberChange.bind(this);
    this.handleKeyPress            = this.handleKeyPress.bind(this);
    this.handleTextFieldChange     = this.handleTextFieldChange.bind(this);
    this.handleAgentValueChange    = this.handleAgentValueChange.bind(this);
    this.addPrefix                 = this.addPrefix.bind(this);
    this.makeCall                  = this.makeCall.bind(this);
    this.onCalling                 = this.onCalling.bind(this);
    this.onCallRemoteRinging       = this.onCallRemoteRinging.bind(this);
    this.onCallAnswered            = this.onCallAnswered.bind(this);
    this.tick                      = this.tick.bind(this);
    this.onCallFailed              = this.onCallFailed.bind(this);
    this.onCallTerminated          = this.onCallTerminated.bind(this);
    this.onIncomingCall            = this.onIncomingCall.bind(this);
    this.onIncomingCallCanceled    = this.onIncomingCallCanceled.bind(this);
    this.handleAnswerIncomingCall  = this.handleAnswerIncomingCall.bind(this);
    this.handleHangUp              = this.handleHangUp.bind(this);
    this.handleRejectIncomingCall  = this.handleRejectIncomingCall.bind(this);
    this.onMute                    = this.onMute.bind(this);
    this.sanitizeNumber            = this.sanitizeNumber.bind(this);
    this.mediaMetrics              = this.mediaMetrics.bind(this);
    this.sendFeedback              = this.sendFeedback.bind(this);
  }

  // initialize the browser SDK object with some configuration options
  componentWillMount() {
    const options = {
      "debug":"ERROR",
      "permOnClick":true,
      "codecs":["OPUS","PCMU"],
      "enableIPV6":false,
      "audioConstraints":{"optional":[{"googAutoGainControl":false}]},
      "dscp":true,
      "enableTracking":true
    };

    this.plivoBrowserSdk = new window.Plivo(options);
  }

  // pass function references for the SDK events. we'll use these to manipulate the ui when events are fired
  componentDidMount() {
    this.plivoBrowserSdk.client.on('onLogin', this.onLogin);
    this.plivoBrowserSdk.client.on('onLoginFailed', this.onLoginFailed);
    this.plivoBrowserSdk.client.on('onCalling', this.onCalling);
    this.plivoBrowserSdk.client.on('onCallRemoteRinging', this.onCallRemoteRinging);
    this.plivoBrowserSdk.client.on('onCallAnswered', this.onCallAnswered);
    this.plivoBrowserSdk.client.on('onCallFailed', this.onCallFailed);
    this.plivoBrowserSdk.client.on('onCallTerminated', this.onCallTerminated);
    this.plivoBrowserSdk.client.on('onIncomingCall', this.onIncomingCall);
    this.plivoBrowserSdk.client.on('onIncomingCallCanceled', this.onIncomingCallCanceled)
    this.plivoBrowserSdk.client.on('mediaMetrics', this.mediaMetrics);
    this.refs.settings.handleCredentialSubmit(); // log in with user's credentials
  }

  // the endpoint and password values are empty by default
  // if the state updates with a new endpoint and password, try to login with the new values
  // *these value are updated via the getCredentials method when it receives the values from its child component (settings component)
  componentDidUpdate(prevProps, prevState, snapshot) {
    if(this.state.plivoEndpoint !== prevState.plivoEndpoint || this.state.plivoPWD !== prevState.plivoPWD) {
      this.plivoBrowserSdk.client.login(this.state.plivoEndpoint, this.state.plivoPWD);
    }
  }

  // update our login credentials when we receive them from settings
	getCredentials(plivoEndpoint, plivoPWD) {
		console.log('received an endpoint of ',plivoEndpoint,' and a password of ',plivoPWD);
		this.setState({ plivoEndpoint, plivoPWD });
	}

  // on successful login
  onLogin() {
    this.setState({
      isLoggedIn: true,
      phoneStatus: 'Phone: Idle...',
      agentValue: 1,
      snackbarOpen: true,
      snackbarMessage: 'Successful login',
    });
  }

  // on unsuccessful login
  onLoginFailed() {
    this.setState({
      agentValue: 3,
      snackbarOpen: true,
      snackbarMessage: "Unsuccessful login. Please try again.",
    });
  }

  // on logout
  onLogout() {
    this.plivoBrowserSdk.client.logout();
    this.setState({
      value: '+1',
      agentValue: 3,
      phoneStatus: '',
      plivoEndpoint: '',
      plivoPWD: '',
      snackbarOpen: true,
      snackbarMessage: 'Logged out',
      duration: '',
    });
  }

  // toggle between making calls from the browser or using click-to-call (calls agents phone # and then forward to the destination #)
  handleToggleChange(newCallValue) {
    this.setState({
      browserCall: newCallValue,
      phoneMe: !newCallValue,
    });
  }

  // update agent phone number when a new value is passed up from our settings component
  handlePhoneMeNumberChange(newValue) {
    this.setState({ phoneMeNumber: newValue });
  }

  // update the source number when a keypad key is pressed
  // if a call is already going, a keypress should be used as a DTMF
  handleKeyPress(input) {
    console.log(input);
    if(this.state.phoneStatus === 'Call Status: Answered') {
      this.plivoBrowserSdk.client.sendDtmf(input);
    } else {
      this.setState({
        value: this.state.value + input
      });
    }
  }

  // update the source number when a user manually updates the field
  handleTextFieldChange(input) {
    this.setState({
      value: input
    });
  }

  // update the agent status.
  // if the value is 3 we just logout
  // if the value is 2, login before updating the value in state - we want to make sure we are still logged in afterwards
  // if the value is 1 we just login
  handleAgentValueChange(event, index, value) {
    if(value === 3) {
      this.onLogout();
    } else if(value === 2) {
      this.onLogin(); // login before changing the agent value because it will set the value to 1 when we login
      this.setState({ agentValue: value });
    } else {
      this.onLogin(); // sets the value to 1 and makes sure we are logged in
    }
  }

  // add the country prefix to our destination number field when a country is selected.
  // we get this value from the country selector component
  // +1 by default because the selected country is set to United States by default
  addPrefix(countryCode) {
    this.setState({ value: '+' + countryCode });
  }

  // make a call. if the user is calling from the browser we will just use the SDK's call api
  // if they are using click-to-call we will send a request to the server and then send an http request to our PHLO
  makeCall() {
    // alert the user if they try to make a call while offline
    if(this.state.agentValue === 3) {
      this.setState({
        error: "Unable to make calls while offline",
        snackbarOpen: true,
        snackbarMessage: 'Please login',
      });
    }
    // clean up our number before trying to place the call
    const dest = this.sanitizeNumber(this.state.value);
    this.setState({ value: dest });

    if(this.state.browserCall) {
      const customCallerId = 14154830302;
      const extraHeaders = {'X-PH-Test1': 'test1', 'X-PH-callerId': customCallerId};
      this.plivoBrowserSdk.client.call(dest, extraHeaders);
    } else {
        var XMLReq = new XMLHttpRequest();
        XMLReq.open("POST", "/makeCall");
        XMLReq.setRequestHeader("Content-Type", "application/json");
        XMLReq.onreadystatechange = function() {
          console.log('response text', XMLReq.responseText);
        }
        XMLReq.send(JSON.stringify({"src": this.state.phoneMeNumber, "dst": dest}));
        console.log(XMLReq);
      }
  }

  // while a call is connecting
  onCalling() {
    this.setState({
      phoneStatus: 'Call Status: Connecting...',
      calling: true,
    });
  }

  // while a call is ringing
  onCallRemoteRinging() {
    this.setState({
      phoneStatus: 'Call Status: Ringing...'
    });
  }

  // once a call is answered
  // get the current date - this will be used when calculating the duration of a call
  onCallAnswered() {
    let startDate = new Date();
    this.setState({
      phoneStatus: 'Call Status: Answered',
      startDate: startDate,
      callTime: 'Call time: ',
      timerID: setInterval(this.tick, 1000),
      callIsAnswered: true,
    });
  }

  // update the call duration while the agent is on a call
  // creat a new date every second and subtract our starting date from this
  tick() {
    let endDate = new Date();
    let elapsed  = endDate - this.state.startDate;
    let hours    = Math.floor( (elapsed / 3600000) );
    let minutes  = Math.floor( (elapsed - (hours * 3600000)) / 60000);
    let seconds  = Math.floor((elapsed - (hours * 3600000) - (minutes * 60000)) / 1000);
    if( hours    < 10) { hours   = "0"+hours;}
    if( minutes  < 10) { minutes = "0"+minutes;}
    if( seconds  < 10) { seconds = "0"+seconds;}
    let display  = hours+":"+minutes+":"+seconds;
    this.setState({duration: display});
  }

  // if call fails
  onCallFailed() {
    this.setState({ phoneStatus: 'Phone: Idle...'})
    console.log("call failed");
  }

  // once call is terminated
  // store the calls uuid, destination #, source #, duration and date in an array
  // pass this call data into the settings component to add a new record to our table
  onCallTerminated() {
    let lastCallID = this.plivoBrowserSdk.client.getCallUUID()
    let lastCall = [this.state.value, '14154830302', this.state.duration, lastCallID, this.state.startDate];
    this.refs.settings.updateCallLog(lastCall);

    // reset the UI once a call ends
    clearInterval(this.state.timerID);
    this.setState({
      phoneStatus: 'Phone: Idle...',
      startDate: 0,
      callTime: '',
      duration: '',
      timerID: '',
    });
  }

  // on incoming call
  // if the agent is set to unavailable we will reject the call
  onIncomingCall() {
    if(this.state.agentValue === 2) {
      this.plivoBrowserSdk.client.reject();
    } else {
      this.setState({
        phoneStatus: 'Incoming call...',
        snackbarMessage: 'Incoming Call',
        snackbarOpen: true,
      });
    }
  }

  // reset the phone status if we cancel an incoming call
  onIncomingCallCanceled() {
    this.setState({
      phoneStatus: 'Phone: Idle...'
    });
  }

  // answer an incoming call
  handleAnswerIncomingCall() {
    this.plivoBrowserSdk.client.answer();
  }

  // hang up a call
  handleHangUp() {
    this.plivoBrowserSdk.client.hangup()
  }

  // reject an incoming call
  handleRejectIncomingCall() {
    this.plivoBrowserSdk.client.reject();
    this.setState({ phoneStatus: 'Phone: Idle...' });
  }

  // mute / unmute an active call
  onMute() {
    this.setState({ muted: !this.state.muted });
    if(this.state.muted === true) {
      this.plivoBrowserSdk.client.unmute();
    } else {
      this.plivoBrowserSdk.client.mute();
    }
  }

  // sanitize the destination number before making a call
  sanitizeNumber(input) {
    let sanitized = input.replace('-','');
    sanitized     = sanitized.replace(' -','');
    sanitized     = sanitized.replace('- ','');
    sanitized     = sanitized.replace('+','');
    sanitized     = sanitized.replace(/\s+/g, '');
    return sanitized;
  }

  // handle any network events the SDK receives
  // receives an object as a parameter, we will pass this data to the settings
  // and create a new record in our call quality metrics table
  mediaMetrics(obj) {
    let desc        = obj.desc;
    let group       = obj.group;
    let level       = obj.level;
    let type        = obj.type;
    let UUID        = this.plivoBrowserSdk.client.getCallUUID();
    let callMetrics = [group, level, desc, type, UUID];
    this.refs.settings.updateQualityMetrics(callMetrics);
  }

  // Send feedback about the last call that was made
  // Uses the send feedback api provided by the SDK
  // this takes a 1-5 rating, a reason for the rating (bad audio, no audio, never connected, etc) and the call's uuid
  sendFeedback(rating, feedback) {
    let lastCallId = this.plivoBrowserSdk.client.getLastCallUUID();
    if(lastCallId) {
      this.plivoBrowserSdk.client.sendQualityFeedback(lastCallId, rating, feedback); // send feedfack to plivo. this takes a 1-5 rating, a comment, and a call uuid
    }
  }

  render() {

    // agent status icons (available, unavailable, offline)

    const availableIcon = (
      <i className="material-icons availableIcon">fiber_manual_record</i>
    );
    const unavailableIcon = (
      <i className="material-icons unavailableIcon">fiber_manual_record</i>
    );
    const offlineIcon = (
      <i className="material-icons offlineIcon">fiber_manual_record</i>
    );

    return (
      <div>
        <div className='settings'>
            <DropDownMenu
              value={this.state.agentValue}
              onChange={this.handleAgentValueChange}
              style={styles.customDropDown}
              className="agentStatus"
              autoWidth={true}
              >
                <Subheader>Agent Status</Subheader>
                <MenuItem value={1} label={availableIcon} primaryText="Available" leftIcon={availableIcon} />
                <MenuItem value={2} label={unavailableIcon} primaryText="Unavailable" leftIcon={unavailableIcon} />
                <MenuItem value={3} label={offlineIcon} primaryText="Offline" leftIcon={offlineIcon} />
            </DropDownMenu>
            <SettingsDropdownMenu
              phoneMe={this.state.phoneMe}
              getCredentials={this.getCredentials}
              handleToggleChange={this.handleToggleChange}
              handlePhoneMeNumberChange={this.handlePhoneMeNumberChange}
              logout={this.onLogout}
              sendFeedback={this.sendFeedback}
              ref='settings'
            />
        </div>
        <div className="phone">
          <div className="phoneStatus">{this.state.phoneStatus}<br />
          {this.state.callTime}{this.state.duration}
          </div>
          <CountrySelector addPrefix={this.addPrefix} />
          <TextField
            value={this.state.value}
            onChange={event => this.handleTextFieldChange(event.target.value)}
            name="numberInput"
            floatingLabelText="Enter Number"
            floatingLabelStyle={styles.floatingLabelStyle}
            floatingLabelFixed={true}
            underlineStyle={styles.underlineStyle}
            hintText="please select a country"
            fullWidth={true}
            className="numberInput"
            type='text'
          />
          <div className="keypad">
            <div className="keypad-row">
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(1)}>1</RaisedButton>
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(2)}>2 <small>abc</small></RaisedButton>
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(3)}>3 <small>def</small></RaisedButton>
            </div>
            <div className="keypad-row">
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(4)}>4 <small>ghi</small></RaisedButton>
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(5)}>5 <small>jkl</small></RaisedButton>
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(6)}>6 <small>mno</small></RaisedButton>
            </div>
            <div className="keypad-row">
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(7)}>7 <small>pqrs</small></RaisedButton>
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(8)}>8 <small>tuv</small></RaisedButton>
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(9)}>9 <small>wxyz</small></RaisedButton>
            </div>
            <div className="keypad-row">
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress("*")}>*</RaisedButton>
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress(0)}>0</RaisedButton>
              <RaisedButton className="keypadKey" style={styles.key} onClick={event => this.handleKeyPress("#")}>#</RaisedButton>
            </div>
          </div>
          <MuiThemeProvider muiTheme={muiTheme}>
            <CallControls
              phoneStatus={this.state.phoneStatus}
              muted={this.state.muted}
              value={this.state.value}
              makeCall={this.makeCall}
              handleHangUp={this.handleHangUp}
              onMute={this.onMute}
              handleAnswerIncomingCall={this.handleAnswerIncomingCall}
              handleRejectIncomingCall={this.handleRejectIncomingCall}
             />
          </MuiThemeProvider>
          <div style={styles.errorStyle}>{this.state.error}</div>
          <CustomSnackBar snackbarOpen={this.state.snackbarOpen} snackbarMessage={this.state.snackbarMessage} />
        </div>
      </div>
    )
  }
}

export default PhonePad;
