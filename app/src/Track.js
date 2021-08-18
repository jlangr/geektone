import 'rc-slider/assets/index.css'
import 'rc-tooltip/assets/bootstrap.css'
import React, { Component } from 'react'
import { Col, Button, Grid, Row } from 'react-bootstrap'
import ToggleButton from '@material-ui/lab/ToggleButton'
import { connect } from 'react-redux'
import Staff from './Staff'
import { 
  changeTrackInstrument,
  deleteTrack,
  setVolume,
  toggleClickInsertMode,
  toggleMute,
  toggleFlatsMode,
  toggleSharpsMode } from './actions'
import { trackData } from './reducers/SongReducer'
import { sampleNotes } from './actions/SynthActions'
import Slider from 'rc-slider'

export class Track extends Component {
  instrumentChange(e) {
    this.props.changeTrackInstrument(e.target.value, this.props.id)
  }

  instrumentOptions() {
    return Object.keys(sampleNotes).sort().map(instrument => 
      <option value={instrument} key={instrument}>{sampleNotes[instrument].description}</option>)
  }

  render() {
    return (
        <Grid>
          <Row>
            <Col xs={6}>
              <select value={this.props.trackData.instrument} onChange={this.instrumentChange.bind(this)}>
                {this.instrumentOptions()}
              </select>
              <Button className='btn-song' onClick={() => this.props.toggleSharpsMode(this.props.id)}>#</Button>
              <Button className='btn-song' onClick={() => this.props.toggleFlatsMode(this.props.id)}>{ '\u266D' }</Button>
              <ToggleButton className='btn-song' onClick={() => this.props.toggleClickInsertMode(this.props.id)}>!</ToggleButton>
              <Button className='btn-song' onClick={() => this.props.deleteTrack(this.props.id)}>x</Button>
              <label htmlFor='isMuted'>Mute</label>
              <input id='isMuted' type='checkbox'
                  checked={this.props.trackData.isMuted}
                  onChange={() => this.props.toggleMute(this.props.id)} />
              <Slider min={1} max={10} 
                marks={{1: '1', 5: '5', 10: '10'}}
                defaultValue={this.props.trackData.volume} 
                onAfterChange={value => this.props.setVolume(this.props.id, value)} />
            </Col>
          </Row>
          <Row>
            <Staff key={this.props.id} id={this.props.id} />
          </Row>
        </Grid>
    )
  }
}

const mapStateToProps = ({composition, ui}, ownProps) => (
  { trackData: trackData(composition, ownProps.id),
    song: composition.song, 
    ui 
  }
)

const mapDispatchToProps = { changeTrackInstrument, deleteTrack, setVolume, toggleClickInsertMode, toggleMute, toggleFlatsMode, toggleSharpsMode }
export default connect(mapStateToProps, mapDispatchToProps)(Track)