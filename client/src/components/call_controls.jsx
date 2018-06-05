import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';

class CallControls extends React.Component {

  render() {

    // update microphone icon based on muted state
    const microphone = (this.props.muted !== false ) ? (
      <i className="material-icons" >mic_off</i>
    ) : (
      <i className="material-icons">mic</i>
    )

    // update call button based on the phone status
    const callButton = (this.props.phoneStatus === 'Phone: Idle...' || this.props.phoneStatus === '') ? (
      <div className="placeCall">
        <FloatingActionButton
          onClick={this.props.makeCall}
          className="callControlButton"
          backgroundColor='#00dd00'
          >
          <i className="material-icons">phone</i>
        </FloatingActionButton>
      </div>
    ) : (
      <span></span>
    )

    // hangup button
    const hangupButton = (this.props.phoneStatus === 'Call Status: Answered') ? (
      <div className="hangupCurrentCall">
        <FloatingActionButton
          onClick={this.props.handleHangUp}
          className="callControlButton"
          backgroundColor='#bb0000'
        >
          <i className="material-icons">call_end</i>
        </FloatingActionButton>
      </div>
    ) : (
      <span></span>
    )

    // hangup button dislayed when a call is being placed but hasn't been connected.
    // this does the same thing as the other hangup button, but it gets centered in its container
    const hangupButton2 = (this.props.phoneStatus === 'Call Status: Ringing...' || this.props.phoneStatus === 'Call Status: Connecting...') ? (
      <div className="hangupCurrentCall2">
        <FloatingActionButton
          onClick={this.props.handleHangUp}
          className="callControlButton"
          backgroundColor='#bb0000'
        >
          <i className="material-icons">call_end</i>
        </FloatingActionButton>
      </div>
    ) : (
      <span></span>
    )

    const muteButton = (this.props.phoneStatus === 'Call Status: Answered') ? (
      <div className="muteCurrentCall">
        <FloatingActionButton
          onClick={this.props.onMute}
          className="callControlButton"
          backgroundColor='#aaaaaa'
          >
          {microphone}
        </FloatingActionButton>
      </div>
    ) : (
      <span></span>
    )

    const answerButton = (this.props.phoneStatus === 'Incoming call...') ? (
      <div className="answerIncomingCall">
        <FloatingActionButton
          onClick={this.props.handleAnswerIncomingCall}
          className="callControlButton"
          backgroundColor='#00dd00'
          >
          <i className="material-icons">phone</i>
        </FloatingActionButton>
      </div>
    ) : (
      <span></span>
    )

    const rejectButton = (this.props.phoneStatus === 'Incoming call...') ? (
      <div className="rejectIncomingCall">
        <FloatingActionButton
          onClick={this.props.handleRejectIncomingCall}
          className="callControlButton"
          backgroundColor='#bb0000'
          >
          <i className="material-icons">call_end</i>
        </FloatingActionButton>
      </div>
    ) : (
      <span></span>
    )

    return (
      <div className="callControls">
        {callButton}
        {hangupButton}
        {hangupButton2}
        {muteButton}
        {rejectButton}
        {answerButton}
      </div>
    )
  }
}

export default CallControls;
