import {filter, get, map, values} from 'lodash'

/**
 * gets an array of all timelines.
 * @param {Object} state - full Redux state tree
 * @returns {[Object]} - array of timeline objects
 */
export const getTimelines = state =>
  values(get(state, `timelines.byId`, {}))

/**
 * gets a timeline property from the redux store .
 * @param {Object} state - full Redux state tree.
 * @param {string} timelineId - id of the timeline we wish to get the property of.
 * @returns {*} - the value of any property
 */
export const getTimelineProperty = (state, timelineId, property) =>
  get(state, `timelines.byId.${timelineId}.${property}`)

/**
 * gets an array of member track objects of the given timeline. 
 * @param {Object} state - full Redux state tree.
 * @param {string} timelineId - id of the timeline of interest.
 * @returns {[Object]} - array of track objects
 */
export const getTracksFromTimeline = (state, timelineId) =>
  map(
    get(state, `timelines.byId.${timelineId}.tracks`, []),
    trackId => get(state, `tracks.midi.${trackId}`),
  )

/**
 * gets the tracks which are activated for recording.
 * @param {Object} state - full Redux state tree.
 * @param {string} timelineId - id of the timeline.
 * @returns {[Object]} - array of track objects which are active
 */
export const getActiveTracksFromTimeline = (state, timelineId) =>
  filter(
    getTracksFromTimeline(state, timelineId),
    track => track.activated,
  )

/**
 * gets all unmuted master midi recordings from a timeline
 * @param {Object} state - full Redux state tree
 * @param {string} timelineId - id of timeline
 * @returns {[Object]} - array of unmuted midi master tracks
 */
export const getUnmutedMasterRecordingsFromTimeline = (state, timelineId) =>
  map(
    filter(
      map(
        get(state, `timelines.byId.${timelineId}.tracks`, []),
        trackId => get(state, `tracks.midi.${trackId}`),
      ),
      track => !track.mute,
    ),
    unmutedTrack => get(state, `recordings.midi.masters.${unmutedTrack.recordingId}.master`),
  )
