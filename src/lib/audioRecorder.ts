/**
 * Sahaay AI Audio Recorder
 * Captures browser microphone audio and encodes directly into standard 16-bit PCM WAV (16kHz Mono).
 * Guarantees 100% compliant WAV binary data for Gnani Prisma STT v3.
 */

export class WavRecorder {
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private processor: ScriptProcessorNode | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private audioChunks: Float32Array[] = [];
  private recordingLength: number = 0;
  private targetSampleRate: number = 16000;
  private isRecording: boolean = false;

  async start(): Promise<void> {
    if (this.isRecording) return;

    this.audioChunks = [];
    this.recordingLength = 0;

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    this.mediaStream = stream;
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.audioContext = new AudioContextClass();

    this.source = this.audioContext.createMediaStreamSource(stream);
    // Buffer size 4096, 1 input channel, 1 output channel
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processor.onaudioprocess = (e: AudioProcessingEvent) => {
      if (!this.isRecording) return;
      const inputData = e.inputBuffer.getChannelData(0);
      // Clone buffer chunk
      const chunk = new Float32Array(inputData.length);
      chunk.set(inputData);
      this.audioChunks.push(chunk);
      this.recordingLength += chunk.length;
    };

    this.source.connect(this.processor);
    this.processor.connect(this.audioContext.destination);
    this.isRecording = true;
  }

  async stop(): Promise<{ blob: Blob; durationSeconds: number }> {
    if (!this.isRecording) {
      throw new Error("Recorder was not active.");
    }

    this.isRecording = false;

    if (this.processor) {
      this.processor.disconnect();
      this.processor = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    const currentContextSampleRate = this.audioContext?.sampleRate || 44100;
    if (this.audioContext && this.audioContext.state !== "closed") {
      await this.audioContext.close();
      this.audioContext = null;
    }

    // Flatten all collected chunks
    const mergedSamples = new Float32Array(this.recordingLength);
    let offset = 0;
    for (const chunk of this.audioChunks) {
      mergedSamples.set(chunk, offset);
      offset += chunk.length;
    }

    // Resample to target 16,000 Hz if needed
    const resampled = this.downsampleBuffer(mergedSamples, currentContextSampleRate, this.targetSampleRate);
    const durationSeconds = resampled.length / this.targetSampleRate;

    // Encode to 16-bit PCM WAV
    const wavBlob = this.encodeWAV(resampled, this.targetSampleRate);
    return { blob: wavBlob, durationSeconds };
  }

  getIsRecording(): boolean {
    return this.isRecording;
  }

  private downsampleBuffer(buffer: Float32Array, inputRate: number, outputRate: number): Float32Array {
    if (inputRate === outputRate) {
      return buffer;
    }
    const ratio = inputRate / outputRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    let offsetResult = 0;
    let offsetBuffer = 0;

    while (offsetResult < result.length) {
      const nextOffsetBuffer = Math.round((offsetResult + 1) * ratio);
      let accum = 0;
      let count = 0;
      for (let i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
        accum += buffer[i];
        count++;
      }
      result[offsetResult] = count > 0 ? accum / count : 0;
      offsetResult++;
      offsetBuffer = nextOffsetBuffer;
    }
    return result;
  }

  private encodeWAV(samples: Float32Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    /* RIFF identifier */
    this.writeString(view, 0, "RIFF");
    /* RIFF chunk length */
    view.setUint32(4, 36 + samples.length * 2, true);
    /* RIFF type */
    this.writeString(view, 8, "WAVE");
    /* format chunk identifier */
    this.writeString(view, 12, "fmt ");
    /* format chunk length */
    view.setUint32(16, 16, true);
    /* sample format (1 is PCM) */
    view.setUint16(20, 1, true);
    /* channel count (1 for mono) */
    view.setUint16(22, 1, true);
    /* sample rate */
    view.setUint32(24, sampleRate, true);
    /* byte rate (sample rate * block align) */
    view.setUint32(28, sampleRate * 2, true);
    /* block align (channel count * bytes per sample) */
    view.setUint16(32, 2, true);
    /* bits per sample */
    view.setUint16(34, 16, true);
    /* data chunk identifier */
    this.writeString(view, 36, "data");
    /* data chunk length */
    view.setUint32(40, samples.length * 2, true);

    // Float32 to 16-bit signed PCM
    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([view], { type: "audio/wav" });
  }

  private writeString(view: DataView, offset: number, string: string): void {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
