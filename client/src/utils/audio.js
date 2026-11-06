// Non-blocking Web Audio API Synthesizer
// Automatically suspends immediately after playing so it NEVER interrupts or freezes
// phone videos (YouTube, PiP, Netflix, TikTok) or background music (Spotify, Apple Music).

class SoundManager {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.suspendTimer = null;
  }

  init() {
    try {
      if (!this.ctx && typeof window !== 'undefined') {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          this.ctx = new AudioContext({ latencyHint: 'interactive' });
        }
      }
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
    } catch (e) {
      // Audio context initialization failure shouldn't crash app
    }
  }

  // Release audio session back to OS immediately so background videos and music don't freeze
  scheduleRelease(afterMs = 400) {
    if (this.suspendTimer) {
      clearTimeout(this.suspendTimer);
    }
    this.suspendTimer = setTimeout(() => {
      try {
        if (this.ctx && this.ctx.state === 'running') {
          this.ctx.suspend().catch(() => {});
        }
      } catch (e) {}
    }, afterMs);
  }

  vibrate(pattern = [60, 40, 60]) {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  // Play ding / tap
  playDing() {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);

      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);

      this.scheduleRelease(200);
    } catch (e) {}
  }

  // Alert chime when partner submits an item
  playPartnerSubmitted() {
    if (this.muted) return;
    this.vibrate([100, 50, 150]);
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = this.ctx.currentTime + idx * 0.07;
        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.2);
      });

      this.scheduleRelease(600);
    } catch (e) {}
  }

  // Fanfare when verified / approved
  playApproved() {
    if (this.muted) return;
    this.vibrate([150, 80, 200]);
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;

        const startTime = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.18, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.25);
      });

      this.scheduleRelease(650);
    } catch (e) {}
  }

  // Playful buzzer when rejected
  playRejected() {
    if (this.muted) return;
    this.vibrate([200, 100, 200]);
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(260, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.3);

      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.3);

      this.scheduleRelease(400);
    } catch (e) {}
  }

  // Victory Fanfare
  playVictory() {
    if (this.muted) return;
    this.vibrate([100, 50, 100, 50, 300]);
    try {
      this.init();
      if (!this.ctx) return;

      const notes = [523.25, 523.25, 523.25, 659.25, 783.99, 1046.5];
      const delays = [0, 0.1, 0.2, 0.3, 0.4, 0.55];

      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;

        const startTime = this.ctx.currentTime + delays[idx];
        const duration = idx === notes.length - 1 ? 0.6 : 0.18;

        gain.gain.setValueAtTime(0.22, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + duration);
      });

      this.scheduleRelease(1200);
    } catch (e) {}
  }
}

export const sounds = new SoundManager();
