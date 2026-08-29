/**
 * Audio synthesis helper using Web Audio API for Eureka moment celebration chimes.
 */
export function playEurekaTone(): void {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;

    const audioCtx = new AudioContextClass();
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    // Ascending celebratory major chord arpeggio: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, index) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.value = freq;
      
      const startTime = audioCtx.currentTime + index * 0.09;
      const attackTime = startTime + 0.04;
      const stopTime = startTime + 0.42;

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.exponentialRampToValueAtTime(0.18, attackTime);
      gain.gain.exponentialRampToValueAtTime(0.001, stopTime);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(startTime);
      osc.stop(stopTime + 0.05);
    });
  } catch (e) {
    console.warn('Audio chime playback was blocked or unsupported', e);
  }
}
