// Audio Synthesizer for Medical Telemetry Alarm using Web Audio API

class SoundService {
  private audioCtx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isAlarmPlaying: boolean = false;
  private alarmInterval: number | null = null;

  constructor() {
    // Lazily init AudioContext on first user interaction
  }

  private initAudio() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAlarm();
    }
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public playBeep(freq: number = 880, durationMs: number = 200, type: OscillatorType = 'sine') {
    if (this.isMuted) return;
    try {
      this.initAudio();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

      // Smooth attack and decay to prevent clicking
      gain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, this.audioCtx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + (durationMs / 1000));

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + (durationMs / 1000) + 0.05);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Medical urgent alert chime (High-priority double-tone: 880Hz -> 660Hz)
  public playCriticalChime() {
    if (this.isMuted) return;
    this.playBeep(880, 160, 'sine');
    setTimeout(() => {
      if (!this.isMuted) this.playBeep(660, 240, 'triangle');
    }, 180);
  }

  // Start continuous rhythmic alarm for unacknowledged critical alert
  public startAlarm() {
    if (this.isMuted || this.isAlarmPlaying) return;
    this.isAlarmPlaying = true;
    this.playCriticalChime();

    // Repeat alarm burst every 2.5 seconds until acknowledged or muted
    this.alarmInterval = window.setInterval(() => {
      if (!this.isMuted && this.isAlarmPlaying) {
        this.playCriticalChime();
      } else {
        this.stopAlarm();
      }
    }, 2500);
  }

  public stopAlarm() {
    this.isAlarmPlaying = false;
    if (this.alarmInterval !== null) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  public playNotificationPing() {
    if (this.isMuted) return;
    this.playBeep(520, 120, 'sine');
  }
}

export const soundService = new SoundService();
