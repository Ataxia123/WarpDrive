class AudioController {
  private audioContext: AudioContext | null;
  private gainNode: GainNode | null;

  constructor() {
    this.audioContext = typeof window !== "undefined" && "AudioContext" in window ? new AudioContext() : null;
    this.gainNode = this.audioContext ? this.audioContext.createGain() : null;
  }

  async loadSound(url: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  playSound(buffer: AudioBuffer | null, loop?: boolean, volume?: number): AudioBufferSourceNode | null {
    if (!buffer) {
      console.warn("Buffer is null. Cannot play sound.");
      return null;
    }

    if (!this.audioContext) {
      console.warn("AudioContext is not initialized. Cannot play sound.");
      return null;
    }

    const source = this.audioContext.createBufferSource();
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume ? volume : 0.1, this.audioContext.currentTime);

    source.buffer = buffer;
    if (loop) {
      source.loop = true;
    }
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    source.start();
    return source;
  }
}

export default AudioController;
