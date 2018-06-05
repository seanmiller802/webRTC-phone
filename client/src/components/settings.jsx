import React from 'react';
import Toggle from 'material-ui/Toggle';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import ActionGrade from 'material-ui/svg-icons/action/grade';
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn, TableFooter } from 'material-ui/Table';
import { Tabs, Tab } from 'material-ui/Tabs';
import persist from 'react-localstorage-hoc'; // this will save our component state to local storage
import StarRatingComponent from 'react-star-rating-component';
import Moment from 'moment';

const styles = {
  underlineStyle: {
    borderColor: '#2bb031',
  },
  floatingLabelStyle: {
    color: '#2bb031',
  },
  floatingLabelFocusStyle: {
    color: '#2bb031',
  },
  customContentStyle: {
   width: '1200px',
   maxWidth: 'none',
  },
  iconHoverColor: '#2bb031',
  height: '75px',
  width: '50px',
};

class SettingsDropdownMenu extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      open: false,
      phoneMeNumber: this.props.phoneMeNumber,
      rating: 0,
      height: '200px',
    };

    this.handleClick               = this.handleClick.bind(this);
    this.handleClose               = this.handleClose.bind(this);
    this.handleCredentialSubmit    = this.handleCredentialSubmit.bind(this);
    this.handleToggleChange        = this.handleToggleChange.bind(this);
    this.handlePhoneMeNumberChange = this.handlePhoneMeNumberChange.bind(this);
    this.handleEndpointChange      = this.handleEndpointChange.bind(this);
    this.handlePasswordChange      = this.handlePasswordChange.bind(this);
    this.clearCallLogs             = this.clearCallLogs.bind(this);
    this.clearQualityMetrics       = this.clearQualityMetrics.bind(this);
    this.updateCallLog             = this.updateCallLog.bind(this);
    this.updateQualityMetrics      = this.updateQualityMetrics.bind(this);
    this.onStarClick               = this.onStarClick.bind(this);
    this.onCheck                   = this.onCheck.bind(this);
    this.handleFeedback            = this.handleFeedback.bind(this);
  }

  // if we don't have any call setting configured in our local storage, set it to browser calls by default
  componentDidMount() {
    if(!this.state.browserCall) {
      this.setState({
        browserCall: true,
        phoneMe: false,
      });
    }
    this.props.handleToggleChange(this.state.browserCall); // update the state in the parent component for when we place a call
    this.props.handlePhoneMeNumberChange(this.state.phoneMeNumber); // update the agents phone number in the parent component
  }

  // opens the modal when we click the settings icon
  handleClick(event) {
    event.preventDefault();
    this.setState({ open: true });
  };

  // close the modal
  handleClose() {
    this.setState({
      open: false,
    });
  };

  // send our plivo credentials to the parent component to authenticate the user
  handleCredentialSubmit() {
    this.handleClose();
    this.props.getCredentials(this.state.endpoint, this.state.pwd);
  }

  // toggle between call from browser and click-to-call
  handleToggleChange(event, newValue) {
    this.setState({
      browserCall: !this.state.browserCall,
      phoneMe: !this.state.phoneMe,
    });
    this.props.handleToggleChange(!this.state.browserCall); // update the state in the parent component for when we place a call
  }

  // update the agents phone number here and in the parent component
  handlePhoneMeNumberChange(newValue) {
    this.setState({ phoneMeNumber: newValue });
    this.props.handlePhoneMeNumberChange(newValue);
  }

  // update the application endpoint
  handleEndpointChange(endpoint) {
    this.setState({ endpoint });
  }

  // update the endpoint password
  handlePasswordChange(pwd) {
    this.setState({ pwd });
  }

  // clear the call logs
  clearCallLogs() {
    this.setState({ recentCalls: [] });
  }

  // clear call quality metrics
  clearQualityMetrics() {
    this.setState({ qualityMetrics: [] });
  }

  // used in parent component to add a new call record to our call logs
  updateCallLog(newCall) {
    if(this.state.recentCalls) {
      this.setState({ recentCalls: [...this.state.recentCalls, newCall] });
    } else {
      this.setState({ recentCalls: [newCall] });
    }
  }

  // used in parent component to add call quality metrics (media metrics) while on a call
  updateQualityMetrics(currentCall) {
    if(this.state.qualityMetrics) {
      this.setState({ qualityMetrics: [...this.state.qualityMetrics, currentCall] });
    } else {
      this.setState({ qualityMetrics: [currentCall] });
    }
  }

  // update the feedback rating
  onStarClick(nextValue, prevValue, name) {
   this.setState({ rating: nextValue });
  }

  // update the value of the feedback comment
  onCheck(event, value) {
   if(value) {
     this.setState({ radioValue: value });
   }
  }

  // send BrowserSDK feedback to Plivo
  handleFeedback() {
   if(this.state.rating < 1) {
     console.log('please provide a rating');
   } else {
     this.props.sendFeedback(this.state.rating, this.state.radioValue);
   }
  }

  render() {

    let recentCalls  = this.state.recentCalls || [];

    // create a copy of our recent calls and return an array of JSX (table rows) with our call data
    // return empty rows if we have no data
    let TableRows = (recentCalls.length ?

      recentCalls.map( (call, index) => {

          let from      = call[1]; //source number
          let to        = call[0]; // destination number
          let duration  = call[2]; // call duration
          let uuid      = call[3]; // uuid of the call
          let date      = Moment(call[4]).format("ddd MMMM Do YYYY"); // date the call was made
          let time      = Moment(call[4]).format("h:mm:ssa"); // time the call was made

          return (
            <TableRow key={index}>
              <TableRowColumn style={ {width: '15%', textAlign: 'center'} }>{date}</TableRowColumn>
              <TableRowColumn style={ {width: '15%', textAlign: 'center'} }>{time}</TableRowColumn>
              <TableRowColumn style={ {width: '15%', textAlign: 'center'} }>{to}</TableRowColumn>
              <TableRowColumn style={ {width: '15%', textAlign: 'center'} }>{from}</TableRowColumn>
              <TableRowColumn style={ {width: '15%', textAlign: 'center'} }>{duration}</TableRowColumn>
              <TableRowColumn style={ {width: '25%', textAlign: 'center'} }>{uuid}</TableRowColumn>
            </TableRow>
          )
      }) : (
        <TableRow>
          <TableRowColumn>-</TableRowColumn>
          <TableRowColumn>-</TableRowColumn>
          <TableRowColumn>-</TableRowColumn>
          <TableRowColumn>-</TableRowColumn>
          <TableRowColumn>-</TableRowColumn>
          <TableRowColumn>-</TableRowColumn>
        </TableRow>
      )
  )// end table rows function

  let qualityMetrics = this.state.qualityMetrics || [];

  // create a copy of our media metrics and return an array of JSX (table rows) with our metrics data
  // return empty rows if we have no data
  let Metrics = (qualityMetrics.length ?

    qualityMetrics.map( (metric, index) => {

        let group = metric[0];
        let level = metric[1];
        let desc  = metric[2];
        let type  = metric[3];
        let uuid  = metric[4];

        return (
          <TableRow key={index}>
            <TableRowColumn style={ {width: '15%', textAlign: 'center'} }>{group}</TableRowColumn>
            <TableRowColumn style={ {width: '15%', textAlign: 'center'} }>{level}</TableRowColumn>
            <TableRowColumn style={ {width: '15%', textAlign: 'center'} }>{desc}</TableRowColumn>
            <TableRowColumn style={ {width: '20%', textAlign: 'center'} }>{type}</TableRowColumn>
            <TableRowColumn style={ {width: '35%', textAlign: 'center'} }>{uuid}</TableRowColumn>
          </TableRow>
        )

    }) : (
      <TableRow>
        <TableRowColumn>-</TableRowColumn>
        <TableRowColumn>-</TableRowColumn>
        <TableRowColumn>-</TableRowColumn>
        <TableRowColumn>-</TableRowColumn>
        <TableRowColumn>-</TableRowColumn>
      </TableRow>
      )
)// end table rows function

    return (
      <div>
        <i className="material-icons settings-icon" onClick={this.handleClick}>settings</i>
        <Dialog
          open={this.state.open}
          modal={true}
          contentStyle={styles.customContentStyle}
        >
        <Tabs>
          //============================= TAB 1 - USED FOR CONFIGURING THE PHONE AND ENTERING LOGIN CREDENTIALS ============================ //
          <Tab label="Configure" >
          <h3 className="configHeader">How would you like to make calls?</h3>
          <Table>
            <TableBody displayRowCheckbox={false}>
              <TableRow displayBorder={false} selectable={false} className="table-row">
                <TableRowColumn>
                  <Toggle
                    label="Browser Call"
                    toggled={this.state.browserCall}
                    onToggle={this.handleToggleChange}
                    labelPosition="right"
                    className="browserCall"
                  />
                </TableRowColumn>
                <TableRowColumn>
                </TableRowColumn>
                <TableRowColumn>
                </TableRowColumn>
                <TableRowColumn>
                </TableRowColumn>
              </TableRow>
              <TableRow displayBorder={false} selectable={false} className="table-row">
                <TableRowColumn>
                  <Toggle
                    label="Phone Me"
                    toggled={this.state.phoneMe}
                    onToggle={this.handleToggleChange}
                    labelPosition="right"
                    className="phoneMeToggle"
                  />
                </TableRowColumn>
                <TableRowColumn>
                  <TextField
                    disabled={this.state.browserCall}
                    value={this.state.phoneMeNumber}
                    onChange={event => this.handlePhoneMeNumberChange(event.target.value)}
                    floatingLabelFixed={true}
                    floatingLabelText="Agent phone number"
                    className="agentNumberField"
                  />
                </TableRowColumn>
                <TableRowColumn>
                </TableRowColumn>
                <TableRowColumn>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          <hr/>
          <h3 className="credentialHeader">Plivo Credentials</h3>
          <Table>
            <TableBody displayRowCheckbox={false}>
              <TableRow displayBorder={false} selectable={false} className="table-row">
                <TableRowColumn>
                  <TextField
                    onChange={event => this.handleEndpointChange(event.target.value)}
                    value={this.state.endpoint}
                    hintText="Endpoint"
                    floatingLabelText="Endpoint"
                    className="endpoint"
                    type="text"
                  />
                </TableRowColumn>
                <TableRowColumn>
                  <TextField
                    onChange={event => this.handlePasswordChange(event.target.value)}
                    value={this.state.pwd}
                    hintText="Password"
                    floatingLabelText="Password"
                    className="password"
                    type="password"
                  />
                </TableRowColumn>
                <TableRowColumn>
                </TableRowColumn>
                <TableRowColumn>
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          <div className="tab1-actions">
            <FlatButton
              label="Cancel"
              primary={true}
              onClick={this.handleClose}
            />
            <FlatButton
              label="Submit"
              primary={true}
              disabled={false}
              onClick={this.handleCredentialSubmit}
            />
          </div>
          </Tab>
          //============================= TAB 2 - USED FOR DISPLAYING CALL LOGS ============================ //
          <Tab label="Logs">
            <Table fixedHeader={true} height={this.state.height} style={ {width: '100%', tableLayout: 'auto'} }>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn style={ {width: '15%', textAlign: 'center'} }>Date</TableHeaderColumn>
                  <TableHeaderColumn style={ {width: '15%', textAlign: 'center'} }>Time</TableHeaderColumn>
                  <TableHeaderColumn style={ {width: '15%', textAlign: 'center'} }>To</TableHeaderColumn>
                  <TableHeaderColumn style={ {width: '15%', textAlign: 'center'} }>From</TableHeaderColumn>
                  <TableHeaderColumn style={ {width: '15%', textAlign: 'center'} }>Duration</TableHeaderColumn>
                  <TableHeaderColumn style={ {width: '25%', textAlign: 'center'} }>CallUUID</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {TableRows}
              </TableBody>
            </Table>
            <div className="tab2-actions">
              <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
              />
              <FlatButton
                label="Clear Logs"
                primary={true}
                disabled={false}
                onClick={this.clearCallLogs}
              />
            </div>
          </Tab>
          //============================= TAB 3 - USED FOR DISPLAYING LIVE CALL QUALITY METRICS ============================ //
          <Tab label="Call Quality">
            <Table fixedHeader={true} height={this.state.height} style={ {width: '100%', tableLayout: 'auto'} }>
              <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                  <TableHeaderColumn style={ {width: '15%', textAlign: 'center'} }>Group</TableHeaderColumn>
                  <TableHeaderColumn style={ {width: '15%', textAlign: 'center'} }>Level</TableHeaderColumn>
                  <TableHeaderColumn style={ {width: '15%', textAlign: 'center'} }>Desc</TableHeaderColumn>
                  <TableHeaderColumn style={ {width: '20%', textAlign: 'center'} }>Type</TableHeaderColumn>
                  <TableHeaderColumn style={ {width: '35%', textAlign: 'center'} }>CallUUID</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false}>
                {Metrics}
              </TableBody>
            </Table>
            <div className="tab3-actions">
              <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
              />
              <FlatButton
                label="Clear"
                primary={true}
                disabled={false}
                onClick={this.clearQualityMetrics}
              />
            </div>
          </Tab>
          //============================= TAB 4 - USED FOR SENDING FEEDBACK  ============================ //
          <Tab label="Feedback" >
            <h3>Please rate the quality of your last call</h3>
            <Table>
              <TableBody displayRowCheckbox={false}>
                <TableRow displayBorder={false} selectable={false} style={styles}>
                  <TableRowColumn style={ {fontSize: '36px'} }>
                    <StarRatingComponent
                      name="rate1"
                      starCount={5}
                      value={this.state.rating}
                      onStarClick={this.onStarClick}
                      starColor={'#2bb031'}
                    />
                  </TableRowColumn>
                  <TableRowColumn>
                    <RadioButtonGroup name="feedback-options">
                      <RadioButton
                        label="Bad audio"
                        value="Bad Audio"
                        onChange={event => this.onCheck(event.target.value)}
                      />
                      <RadioButton
                        label="Call dropped"
                        value="Call dropped"
                        onChange={event => this.onCheck(event.target.value)}
                      />
                      <RadioButton
                        label="Wrong caller id"
                        value="Wrong caller id"
                        onChange={event => this.onCheck(event.target.value)}
                      />
                      <RadioButton
                        label="Post-dial delay"
                        value="Post-dial delay"
                        onChange={event => this.onCheck(event.target.value)}
                      />
                      <RadioButton
                        label="DTMF not working"
                        value="DTMF not working"
                        onChange={event => this.onCheck(event.target.value)}
                      />
                      <RadioButton
                        label="Audio latency"
                        value="Audio latency"
                        onChange={event => this.onCheck(event.target.value)}
                      />
                      <RadioButton
                        label="One way audio"
                        value="One way audio"
                        onChange={event => this.onCheck(event.target.value)}
                      />
                      <RadioButton
                        label="No audio"
                        value="No audio"
                        onChange={event => this.onCheck(event.target.value)}
                      />
                      <RadioButton
                        label="Never connected"
                        value="Never connected"
                        onChange={event => this.onCheck(event.target.value)}
                      />
                    </RadioButtonGroup>
                  </TableRowColumn>
                </TableRow>
              </TableBody>
            </Table>
            <div className="tab4-actions">
              <FlatButton
                label="Cancel"
                primary={true}
                onClick={this.handleClose}
              />
              <FlatButton
                label="Submit"
                primary={true}
                disabled={false}
                onClick={this.handleFeedback}
              />
            </div>
          </Tab>
        </Tabs>
        </Dialog>
      </div>
    );
  }
}

export default persist(SettingsDropdownMenu);
