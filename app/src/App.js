import React, { Component } from 'react'
import { Col, Button, Grid, Glyphicon, Row } from 'react-bootstrap'
import { connect } from 'react-redux'
import NumericInput from 'react-numeric-input'
import Beforeunload from 'react-beforeunload'
import './App.css'
import Track from './Track'
import HelpPanel from './components/HelpPanel'
import { 
  changeBpm, 
  deleteSong,
  downloadSong,
  errorMessage, 
  loadSong, loadSongList, loadSynths, 
  newSong, newTrack, 
  playSong, putSongName, 
  saveSong, stopSong } from './actions'
import { showPlayButton } from './reducers/SynthReducer'
import { isValidSongName } from './reducers/SongReducer'
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
    this.addKeyListeners()
  }

  addKeyListeners() {
    document.addEventListener('keyup', e => {
      if (e.srcElement.type !== 'text')
        this.props.ui.lastComponentWithKeyFocus.handleKeyPress(e)
    })
  }

  render() {
    let onBeforeUnload
    if (this.props.song.isDirty)
      onBeforeUnload = <Beforeunload onBeforeunload={() => 'You have unsaved changes. Are you sure you want to navigate away from this page?'} />
    return (
      <div>
       {onBeforeUnload}
        <form encType="multipart/form-data" action="http:/localhost:3001/upload" method="post">
          <input id="fileToUpload" type="file"/>
          <input type="submit" value="Upload"/>
        </form>
        <Grid className='tracks-grid'>
          <Row className='show-grid'>
            <Col xs={6}>
              <h2>
                <InlineEdit
                  validate={name => { 
                    const result = isValidSongName(this.props.songList, name, this.props.song.name)
                    this.props.errorMessage(result ? '' : 'invalid song name')
                    return result
                  }}
                  text={this.props.song.name}
                  paramName='newTitle'
                  change={({ newTitle }) =>  {
                    this.props.putSongName(this.props.song.id, newTitle) 
                  }}/>
              </h2>
              {this.props.message}<br />
              <div className='text-danger'>{this.props.errorMessageText}</div>

              <Row className='tracks-row'>
                <label htmlFor='bpm' className='lbl bump-left'>BPM</label>
                <NumericInput 
                  id='bpm' 
                  style={{input: { width: 70 }}} 
                  min={25} max={200} 
                  value={this.props.song.bpm} 
                  onChange={this.props.changeBpm.bind(this)} />
              </Row>

              <Row className='tracks-row'>
                <Col xs={1} className="track-select-padding">
                  <Button className='btn-song' 
                    onClick={() => this.props.playSong(
                        this.props.song, 
                        () => this.props.stopSong(),
                        this.props.ui.staff.selectionStartLine
                      )} 
                    { ...showPlayButton(this.props.synth) ? {} : { disabled: true }}>
                    <Glyphicon glyph='play' title='Play' />
                  </Button>
                </Col>
                <Col xs={1} className="track-select-padding">
                  <Button className='btn-song' onClick={this.props.stopSong}
                    { ...this.props.synth.isPlaying ? {} : { disabled: true}}>
                    <Glyphicon glyph='stop' title='Stop playback' />
                  </Button>
                </Col>
                <Col xs={2} className="track-select-padding">
                  <Button className='btn-song' onClick={() => this.props.saveSong(this.props.song)}>
                    Save
                  </Button>
                </Col>
                <Col xs={2} className="track-select-padding">
                  <Button className='btn-song' onClick={() => {
                    if (this.props.song.isDirty && !window.confirm('You have unsaved changes. Create a new song anyway?'))
                      return
                    this.props.newSong(this.props.song)
                  }}>
                    New
                  </Button>
                </Col>
                <Col xs={1} className="track-select-padding">
                  <Button className='btn-song' onClick={() => {
                    if (this.props.song.isDirty && !window.confirm('You have unsaved changes. Delete the song anyway?'))
                      return
                    this.props.deleteSong(this.props.song)
                  }}>
                    Delete
                  </Button>
                </Col>
              </Row>
              <Row className='tracks-row'>
                <Col xs={2} className="track-select-padding">
                  <Button className='btn-song' onClick={() => this.props.loadSong(this.state.selectedSongId)}
                    { ...this.state.selectedSongId ? {} : { disabled: true}}>
                    Load
                  </Button>
                </Col>
                <Col xs={4} className="track-select-padding">
                  <Select
                    onChange={selectedOption => this.setState({selectedSongId: selectedOption.value })}
                    options={this.props.songList} />
                </Col>
                <Col xs={4} className="track-select-padding">
                  <Button className='btn-song' onClick={() => this.props.downloadSong()}
                          { ...this.state.selectedSongId ? {} : { disabled: true}}>
                    Download As...
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col xs={6}>
              <HelpPanel/>
            </Col>
          </Row>

        </Grid>
        <Grid className='tracks-grid tracks'>
          <Row>
            <Col xs={12}>
              <Button className='btn-song' onClick={this.props.newTrack}>Add Track</Button>
            </Col>
          </Row>
          { this.props.song.tracks.map((_track, i) => 
          <Row className='tracks-row' key={i}>
            <Col xs={12}>
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
    errorMessageText: state.composition.errorMessage,
    synth: state.synth,
    ui: state.ui
  }
}

const mapDispatchToProps = { 
  changeBpm, deleteSong, downloadSong, errorMessage, putSongName, loadSong, loadSongList, loadSynths, newSong, newTrack, saveSong, playSong, stopSong
}

export default connect(mapStateToProps, mapDispatchToProps)(App)
