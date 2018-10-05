import React, { Component } from 'react'
import { Form, Col, Button, Grid, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import NumericInput from 'react-numeric-input'
import { Label } from 'react-bootstrap'
import Beforeunload from 'react-beforeunload'

import './App.css'

import Track from './Track'
import HelpPanel from './components/HelpPanel'
import * as ToneUtils from './ToneUtils'
import { changeBpm, loadSong, loadSynths, newTrack, saveSong } from './actions'
import { synthsLoaded } from './reducers/SynthReducer'

export class App extends Component {
  componentDidMount() {
    this.props.loadSynths()
  }

  render() {
    let onBeforeUnload
    if (this.props.song.isDirty)
      onBeforeUnload = <Beforeunload onBeforeunload={() => 'You have unsaved changeds. Are you sure you want to navigate away from this page?'} />
    return (
      <div className="App">
       {onBeforeUnload}
        <h2><Label>{this.props.song.name}</Label></h2>
        {this.props.message} <br />
        <div className='text-danger'>{this.props.errorMessage}</div>
        <Form>
          <Grid>
            <Row className='show-grid'>
              <Col>
                <label htmlFor='bpm'>BPM</label>
                <NumericInput 
                  id='bpm' 
                  style={{input: { width: 70 }}} 
                  min={25} max={200} 
                  value={this.props.song.bpm} 
                  onChange={this.props.changeBpm.bind(this)} />
              </Col>

              <Col>
                <Button onClick={() => ToneUtils.play(this.props.song, this.props.synthState.synths)}  
                  {...(synthsLoaded(this.props.synthState) ? {} : { disabled : true })}>Play</Button>
                <Button onClick={() => ToneUtils.stop() }>Stop</Button>
                <Button onClick={() => this.props.saveSong(this.props.song) }>Save</Button>
                <Button onClick={this.props.loadSong}>Load</Button>
                <Button onClick={() => this.props.newTrack() }>Add Track</Button>
              </Col>
            </Row>
          </Grid>

          <HelpPanel />
        </Form>
        { this.props.song.tracks.map((_track, i) => 
          <Track key={i} id={i} />) }
      </div>
    )
  }
}

const mapStateToProps = (state, _ownProps) => {
  return { 
    song: state.composition.song,
    message: state.composition.message,
    errorMessage: state.composition.errorMessage,
    synthState: state.samples
  }
}

const mapDispatchToProps = { 
  changeBpm, loadSong, loadSynths, newTrack, saveSong
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
