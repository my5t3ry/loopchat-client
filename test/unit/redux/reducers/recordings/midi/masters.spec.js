import { expect } from 'chai'
import {each, first, last, omit} from 'lodash'
import {getSampleOverdub} from '../../../../../support/data/overdub'
import {getSampleRecording} from '../../../../../support/data/recording'
import {getSampleMidiOnOffSequence} from '../../../../../support/data/midiEvent'
import {newRecording, newRecordingContext} from '../../../../../../src/types/recording'
import {
  MIDI_RECORDING_CREATED,
  MIDI_OVERDUB_RECORDING_STARTED,
  MIDI_OVERDUB_RECORDING_STOPPED,
} from '../../../../../../src/redux/actions/recordings/midi/midi'
import {
  masters,
  consolidateNotes,
  filterBefore,
  processMaster,
  normalizeOverdubTime
} from '../../../../../../src/redux/reducers/recordings/midi/masters'


// TODO (cw|11.2.2017) still need to implement and test overlay vs overwrite logic!
describe('midi recording masters reducer', () => {

  const sampleOverdubs = [
    getSampleOverdub({start: 0, events: getSampleMidiOnOffSequence(2, 0, false)}), // event times -> 0.080181405895692 0.990181405895692 1.080181405895692 1.990181405895692
    getSampleOverdub({start: 0, events: getSampleMidiOnOffSequence(1, 0.6, false), overwrite: false}), // 0.680181405895692 1.590181405895692
    getSampleOverdub({start: 0, events: getSampleMidiOnOffSequence(1, 0.6, false), overwrite: true}), // 0.680181405895692 1.590181405895692
  ]
  const sampleRecording = getSampleRecording({
    master: consolidateNotes(sampleOverdubs[0].events), // TODO (cw|1019.2017) define type for consolidated master array. It is icky to use a method we are testing below within our test setup -____-
    overdubs: {
      recording: {
        [sampleOverdubs[1].id]: sampleOverdubs[1],
        [sampleOverdubs[2].id]: sampleOverdubs[2],
      },
    }
  })

  describe('#masters', () => {

    it('creates a new midi recording on MIDI_RECORDING_CREATED', () => {
      const action = {
        type: MIDI_RECORDING_CREATED,
        payload: {
          recording: newRecording(),
        },
      }
      const state = {}

      expect(masters(state, action)).to.eql({
        [action.payload.recording.id]: action.payload.recording,
      })
    })

    it('adds a new overdubId to a recording on MIDI_OVERDUB_RECORDING_STARTED given a recording context', () => {
      const recording = newRecording()
      const action = {
        type: MIDI_OVERDUB_RECORDING_STARTED,
        payload: {
          recordingContexts: [newRecordingContext(recording.id), newRecordingContext(recording.id)],
        }
      }
      const state = {
        [recording.id]: recording,
      }

      expect(masters(state, action)).to.eql({
        [recording.id]: {
          ...recording,
          overdubs: {
            [action.payload.recordingContexts[0].overdub.id]: true,
            [action.payload.recordingContexts[1].overdub.id]: true,
          }
        }
      })
    })

    it('removes the overdub and processes it into master on MIDI_OVERDUB_RECORDING_STOPPED given a recording context', () => {
      // TODO
    })
  })
  
  describe('processRecordings', () => {

  })

  describe('processMaster', () => {

    it('processes completed overlay overdub into master', () => {
      expect(processMaster(sampleRecording.master, sampleOverdubs[1])).to.eql([
        omit({
          ...sampleOverdubs[0].events[0],
          start: sampleOverdubs[0].events[0].time,
          end: sampleOverdubs[0].events[1].time,
        }, ['time', 'type']),
        omit({
          ...sampleOverdubs[1].events[0],
          start: sampleOverdubs[1].events[0].time,
          end: sampleOverdubs[1].events[1].time,
        }, ['time', 'type']),
        omit({
          ...sampleOverdubs[0].events[2],
          start: sampleOverdubs[0].events[2].time,
          end: sampleOverdubs[0].events[3].time,
        }, ['time', 'type']),
      ])
    })

    it('processes completed overwrite overdub into master', () => {
      expect(processMaster(sampleRecording.master, sampleOverdubs[2])).to.eql([
        omit({
          ...sampleOverdubs[2].events[0],
          start: sampleOverdubs[2].events[0].time,
          end: sampleOverdubs[2].events[1].time,
        }, ['time', 'type']),
      ])
    })
  })

  describe('normalizeOverdubTime', () => {

    it('normalizes event times by the overdub start time', () => {
      const startTime = sampleOverdubs[0].start
      
      const processedOverdub = normalizeOverdubTime(sampleOverdubs[0])
      each(
        processedOverdub.events,
        (e, idx) => expect(e.time).to.eql(sampleOverdubs[0].events[idx].time - startTime)
      )
    })
  })

  describe('consolidateNotes', () => {

    it('merges paired midi on/off events into one data structure', () => {
      const events = sampleOverdubs[0].events

      expect(consolidateNotes(events)).to.eql([
        omit({...events[0], start: events[0].time, end: events[1].time}, ['time', 'type']),
        omit({...events[2], start: events[2].time, end: events[3].time}, ['time', 'type']),
      ])
    })
  })
  
  describe('filterBefore', () => {

    it('excludes MIDI_NOTE_ON events paired with MIDI_NOTE_OFF events which occur after startTime', () => {
      const master = sampleOverdubs[0].events
      const startTime = first(sampleOverdubs[1].events).time

      expect(filterBefore(master, startTime)).to.eql([])
    })
  })

  describe('filterAfter', () => {

    it('excludes MIDI_NOTE_OFF events paired with MIDI_NOTE_ON events which occur before endTime', () => {
      const master = sampleOverdubs[0].events
      const endTime = last(sampleOverdubs[1].events).time

      expect(filterBefore(master, endTime)).to.eql([])
    })
  })
})
