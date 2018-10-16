import React, { Component } from 'react'
import { Col, Button, Grid, Glyphicon, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import NumericInput from 'react-numeric-input'
import Beforeunload from 'react-beforeunload'
import './App.css'
import Track from './Track'
import HelpPanel from './components/HelpPanel'
import { changeBpm, loadSong, loadSongList, loadSynths, newTrack, playSong, putSongName, saveSong, stopSong } from './actions'
import { showPlayButton } from './reducers/SynthReducer'
import Select from 'react-select'
import InlineEdit from 'react-edit-inline2'

export class App extends Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    this.props.loadSynths()
    this.props.loadSongList()
  }

  render() {
    let onBeforeUnload
    if (this.props.song.isDirty)
      onBeforeUnload = <Beforeunload onBeforeunload={() => 'You have unsaved changeds. Are you sure you want to navigate away from this page?'} />
    return (
      <div>
       {onBeforeUnload}
        <Grid className='tracks-grid'>
          <Row className='show-grid'>
            <Col xs={6}>
              <h2>
                <InlineEdit
                  validate={() => true}
                  text={this.props.song.name}
                  paramName='newTitle'
                  change={({ newTitle }) => 
                    this.props.putSongName(this.props.song.id, newTitle) }/>
              </h2>
              {this.props.message}<br />
              <div className='text-danger'>{this.props.errorMessage}</div>

              <Row className='tracks-row'>
                <label htmlFor='bpm' className='lbl'>BPM</label>
                <NumericInput 
                  id='bpm' 
                  style={{input: { width: 70 }}} 
                  min={25} max={200} 
                  value={this.props.song.bpm} 
                  onChange={this.props.changeBpm.bind(this)} />
              </Row>

              <Row className='tracks-row'>
                <Button className='btn-song' 
                  onClick={() => this.props.playSong(this.props.song, () => this.props.stopSong())} 
                  { ...showPlayButton(this.props.synth) ? {} : { disabled: true }}>
                  <Glyphicon glyph='play' title='Play' />
                </Button>
                <Button className='btn-song' 
                  onClick={this.props.stopSong}
                  { ...this.props.synth.isPlaying ? {} : { disabled: true}}>
                  <Glyphicon glyph='stop' title='Stop playback' />
                 </Button>
                <Button className='btn-song' 
                  onClick={() => this.props.saveSong(this.props.song)}>
                  Save
                </Button>
              </Row>
              <Row className='tracks-row'>
                <Select
                  onChange={selectedOption => this.setState({selectedSongId: selectedOption.value })}
                  options={this.props.songList} />
                <Button className='btn-song' 
                  onClick={() => this.props.loadSong(this.state.selectedSongId)}
                  { ...this.state.selectedSongId ? {} : { disabled: true}}>
                  Load
                </Button>
              </Row>

            </Col>
            <Col xs={6}>
              <HelpPanel/>
            </Col>
          </Row>

        </Grid>
        <Grid className='tracks-grid'>
          <Row>
            <Button className='btn-song' onClick={this.props.newTrack}>Add Track</Button>
          </Row>
          { this.props.song.tracks.map((_track, i) => 
          <Row className='tracks-row' key={i}>
            <Col>
              <Track id={i} />
            </Col>
          </Row>) }
        </Grid>
      </div>
    )
  }
}

const mapStateToProps = (state, _ownProps) => {
  return { 
    songList: state.composition.songList,
    song: state.composition.song,
    message: state.composition.message,
    errorMessage: state.composition.errorMessage,
    synth: state.synth,
  }
}

const mapDispatchToProps = { 
  changeBpm, putSongName, loadSong, loadSongList, loadSynths, newTrack, saveSong, playSong, stopSong
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
