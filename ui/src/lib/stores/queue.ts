import { writable } from "svelte/store";
import type { TrackWithUrl } from "../types";
import history from "./history";

function createQueue() {
  const { subscribe, set, update } = writable<TrackWithUrl[]>([]);
  let historyValue: TrackWithUrl[];
  const unsubscribefromHistory = history.subscribe((value) => {
    historyValue = value;
  });

  let restartCallback: (() => void) | undefined;

  return {
    subscribe,
    play: (track: TrackWithUrl) => {
      update((v) => {
        if (v.at(0)?._id === track._id) {
          if (restartCallback) restartCallback();
        }
        return [track];
      });
      history.reset();
    },
    add: (track: TrackWithUrl) => {
      update((v) => {
        v.push(track);
        return v;
      });
    },
    next: () =>
      update((v) => {
        const track = v.shift();
        if (track) history.push(track);
        return v;
      }),
    prev: () => {
      const previousTrack = historyValue.at(-1);
      if (previousTrack)
        update((v) => {
          v.unshift(previousTrack);
          history.pop();
          return v;
        });
    },
    reset: () => set([]),
    setRestartCallback: (callback: () => void) => {
      restartCallback = callback;
    },
    unsubscribefromHistory,
  };
}

const queue = createQueue();
export default queue;
