class AudioController {
  private audioContext: AudioContext | null;

  constructor() {
    this.audioContext = typeof window !== "undefined" && "AudioContext" in window ? new AudioContext() : null;
  }

  async loadSound(url: string): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }
  playSound(buffer: AudioBuffer | null, loop?: boolean): AudioBufferSourceNode | null {
    if (!buffer) {
      console.warn("Buffer is null. Cannot play sound.");
      return null;
    }

    if (!this.audioContext) {
      console.warn("AudioContext is not initialized. Cannot play sound.");
      return null;
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    if (loop) {
      source.loop = true;
    }
    source.connect(this.audioContext.destination);
    source.start();
    return source;
  }
}

export default AudioController;
