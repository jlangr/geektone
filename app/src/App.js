import React, { Component } from 'react'
import { Form, Col, Button, Grid, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import NumericInput from 'react-numeric-input'
import { Label } from 'react-bootstrap'
import Beforeunload from 'react-beforeunload'

import './App.css'

import Track from './Track'
import HelpPanel from './components/HelpPanel'
import { changeBpm, loadSong, loadSynths, newTrack, playSong, saveSong, stopSong } from './actions'
import { showPlayButton } from './reducers/SynthReducer'

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
        <Grid>
          <Row className='show-grid'>
            <Col xs={12} md={8}>
              <Form>
                <label htmlFor='bpm'>BPM</label>
                <NumericInput 
                  id='bpm' 
                  style={{input: { width: 70 }}} 
                  min={25} max={200} 
                  value={this.props.song.bpm} 
                  onChange={this.props.changeBpm.bind(this)} />
                <Button onClick={() => this.props.playSong(this.props.song, () => {
                  this.props.stopSong()
                })} 
                  { ...showPlayButton(this.props.synth) ? {} : { disabled: true }}>Play</Button>
                <Button onClick={this.props.stopSong}
                  { ...this.props.synth.isPlaying ? {} : { disabled: true}}>Stop</Button>
                <Button onClick={() => this.props.saveSong(this.props.song) }>Save</Button>
                <Button onClick={this.props.loadSong}>Load</Button>
                <Button onClick={this.props.newTrack}>Add Track</Button>
              </Form>
            </Col>
          </Row>
        </Grid>

          <HelpPanel />
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
    synth: state.synth,
  }
}

const mapDispatchToProps = { 
  changeBpm, loadSong, loadSynths, newTrack, saveSong, playSong, stopSong
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
