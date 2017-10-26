import {get} from 'lodash'


export const getMidiMasterRecordingFromTrack = (state, trackId) => {
  const recordingId = get(state, `tracks.midi.${trackId}.recordingId`, '')

  return get(state, `recordings.midi.${recordingId}.master`)
}
