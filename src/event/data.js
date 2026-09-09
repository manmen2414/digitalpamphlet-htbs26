import { eventDataStore, getEventData } from "./eventData";

/**
 * @param {string} eventId
 */
export function getEvent(eventId) {
  return eventDataStore.events.find((b) => b.eventId === eventId);
}

/**
 * @param {string[]} eventIds
 * @returns {EventInfo[]}
 */
export function getEventsByIds(eventIds) {
  return eventIds.flatMap((id) => {
    const event = getEvent(id);
    return event ? [event] : [];
  });
}

/**
 * @param {boolean} reload
 */
export function getAllBooths(reload = false) {
  if (reload) getEventData();
  return eventDataStore.events;
}
