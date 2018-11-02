import React from 'react'
import { Track } from './Track'
import Enzyme, { shallow } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { sampleNotes } from './actions/SynthActions'

Enzyme.configure({ adapter: new Adapter() })

describe('list of instrument options', () => {
  let options

  beforeAll(() => {
    const rendered = shallow(<div>{new Track().instrumentOptions()}</div>)
    options = rendered.find('option')
  })

  it('has as many option nodes as sample instruments', () => {
    expect(options).toHaveLength(Object.keys(sampleNotes).length)
  })

  it('populates the text with the instrument description and is sorted alpha', () => {
    expect(options.at(0).text()).toEqual('Bass (electric)')
  })
})