import uuidV4 from 'uuid/v4'
import {createMidiTrack} from '../tracks/midi'
import {openEditorWorkspace} from '../workspaces'
import {openTimelineInEditor} from '../ui/timelines'


export const TIMELINE_CREATED = 'TIMELINE_CREATED'
export const TIMELINE_CREATED_BY_PEER = 'TIMELINE_CREATED_BY_PEER'
export const TIMELINE_DELETED = 'TIMELINE_DELETED'
export const TIMELINE_DELETED_BY_PEER = 'TIMELINE_DELETED_BY_PEER'
export const TRACK_ADDED_TO_TIMELINE = 'TRACK_ADDED_TO_TIMELINE'
export const TRACK_ADDED_TO_TIMELINE_BY_PEER = 'TRACK_ADDED_TO_TIMELINE_BY_PEER'
export const TIMELINE_RECORDING_STATUS_UPDATED = 'TIMELINE_RECORDING_STATUS_UPDATED'
export const TIMELINE_PLAYBACK_STARTED = 'TIMELINE_PLAYBACK_STARTED'
export const TIMELINE_PLAYBACK_STOPPED = 'TIMELINE_PLAYBACK_STOPPED'
export const TIMELINE_SCRUBBER_POSITION_UPDATED = 'TIMELINE_SCRUBBER_POSITION_UPDATED'

export const createTimeline = timelineId => dispatch => {
  // create new timeline
  dispatch({
    type: TIMELINE_CREATED,
    payload: {
      timelineId,
    },
  })

  // open timeline in editor
  dispatch(openTimelineInEditor(timelineId))

  // open editor workspace
  dispatch(openEditorWorkspace())
}

export const deleteTimeline = timelineId => dispatch =>
  dispatch({
    type: TIMELINE_DELETED,
    payload: {
      timelineId,
    },
  })

export const addTrackToTimeline = (trackId, timelineId) => dispatch =>
  dispatch({
    type: TRACK_ADDED_TO_TIMELINE,
    payload: {
      trackId,
      timelineId,
    },
  })

export const addNewTrackToTimeline = timelineId => dispatch => {
  const trackId = uuidV4()
  
  // create new midi track
  dispatch(createMidiTrack(trackId))

  // add this new track to timeline
  dispatch(addTrackToTimeline(trackId, timelineId))
}

export const updateRecordingStatus = (timelineId, inProgress) => dispatch =>
  dispatch({
    type: TIMELINE_RECORDING_STATUS_UPDATED,
    payload: {
      timelineId,
      inProgress,
    }
  })

export const startPlayback = timelineId => dispatch =>
  dispatch({
    type: TIMELINE_PLAYBACK_STARTED,
    payload: {
      timelineId,
    },
  })

export const stopPlayback = timelineId => dispatch =>
  dispatch({
    type: TIMELINE_PLAYBACK_STOPPED,
    payload: {
      timelineId,
    },
  })

export const updateScrubberPosition = (timelineId, time) => dispatch =>
  dispatch({
    type: TIMELINE_SCRUBBER_POSITION_UPDATED,
    payload: {
      timelineId,
      time,
    },
  })

