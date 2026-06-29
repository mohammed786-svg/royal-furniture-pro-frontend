const RINGTONE_SRC = "/new_order_ringtone.mp3";
const DEFAULT_DURATION_MS = 10_000;

let sharedAudio: HTMLAudioElement | null = null;
let unlocked = false;
let activeStop: (() => void) | null = null;
let pendingAfterUnlock = false;

function getAudio(): HTMLAudioElement {
  if (!sharedAudio) {
    sharedAudio = new Audio(RINGTONE_SRC);
    sharedAudio.preload = "auto";
  }
  return sharedAudio;
}

/** Call after user interaction so autoplay is allowed. */
export function unlockOrderRingtone(): void {
  if (typeof window === "undefined" || unlocked) return;

  const audio = getAudio();
  audio.volume = 0.01;
  const playPromise = audio.play();
  if (!playPromise) return;

  void playPromise
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
      audio.volume = 1;
      audio.loop = false;
      unlocked = true;
      if (pendingAfterUnlock) {
        pendingAfterUnlock = false;
        playOrderRingtoneForDuration();
      }
    })
    .catch(() => {
      /* wait for next user gesture */
    });
}

export function isOrderRingtoneUnlocked(): boolean {
  return unlocked;
}

export function stopOrderRingtone(): void {
  activeStop?.();
  activeStop = null;
  pendingAfterUnlock = false;
  const audio = sharedAudio;
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
  }
}

/**
 * Play ringtone for up to `durationMs` (default 10s) on the shared audio element.
 * Returns a stop function. Reuses the unlocked element so browsers allow playback.
 */
export function playOrderRingtoneForDuration(
  durationMs = DEFAULT_DURATION_MS,
): () => void {
  if (typeof window === "undefined") return () => {};

  stopOrderRingtone();

  const audio = getAudio();
  audio.loop = true;
  audio.volume = 1;
  audio.currentTime = 0;

  const stop = () => {
    audio.pause();
    audio.currentTime = 0;
    audio.loop = false;
    if (activeStop === stopFn) activeStop = null;
  };

  const stopFn = () => {
    window.clearTimeout(timer);
    stop();
  };

  const tryPlay = () => {
    const playPromise = audio.play();
    if (!playPromise) return;
    void playPromise.catch(() => {
      if (!unlocked) pendingAfterUnlock = true;
    });
  };

  tryPlay();

  const timer = window.setTimeout(stopFn, durationMs);
  activeStop = stopFn;

  return stopFn;
}

/** @deprecated Use playOrderRingtoneForDuration */
export function playOrderRingtone(): void {
  playOrderRingtoneForDuration();
}
