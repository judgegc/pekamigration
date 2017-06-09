export class SoundEffect {
    private loader: XMLHttpRequest;
    private audioContext: AudioContext;
    private audioBuffer: AudioBuffer;
    public constructor(resource: string) {
        this.audioContext = new AudioContext();

        this.load(resource);
    }
    public load(resource: string) {
        this.loader = new XMLHttpRequest();
        this.loader.addEventListener('load', () => this.onLoadSound());
        this.loader.open("GET", resource);
        this.loader.responseType = "arraybuffer";
        this.loader.send();
    }
    public play(position: { x: number, y: number, z: number }, listener: { x: number, y: number, z: number }) {
        var panner = this.audioContext.createPanner()
        var source = this.audioContext.createBufferSource()

        Object.defineProperty(panner, 'panningModel', {
            value: 'HRTF',
            writable: true,
            enumerable: true,
            configurable: true
        });

        // Set the 3D position (x, y, z).
        if (panner['positionX']) {
            panner['positionX'].value = position.x;
            panner['positionY'].value = position.y;
            panner['positionZ'].value = position.z;
        }
        else {
            panner.setPosition(position.x, position.y, position.z);
        }


        panner.distanceModel = 'linear';
        panner.refDistance = 1;
        panner.maxDistance = 10000;
        panner.rolloffFactor = 1;
        panner.coneInnerAngle = 360;
        panner.coneOuterAngle = 0;
        panner.coneOuterGain = 0;

        if (panner['positionX']) {
            panner['positionX'].value = 0;
            panner['positionY'].value = 0;
            panner['positionZ'].value = 1;
        }
        else {
            panner.setOrientation(0, 0, 1);
        }

        // Connect the "source" object to the "panner" object.
        source.connect(panner)

        // Connect the "panner" object to the "destination" object.
        panner.connect(this.audioContext.destination)

        // Attach an AudioBuffer object.
        source.buffer = this.audioBuffer

        // Connect the "source" object to the "destination" object.
        source.connect(this.audioContext.destination)

        // Optionally, tell "source" to loop the audio continuously.
        source.loop = false

        if (listener['positionX']) {
            listener['positionX'].value = listener.x;
            listener['positionY'].value = listener.y;
            listener['positionZ'].value = listener.z;
        }
        else {
            this.audioContext.listener.setPosition(listener.x, listener.y, listener.z);
        }


        if (this.audioContext.listener['positionX']) {
            this.audioContext.listener['forwardX'].value = 0;
            this.audioContext.listener['forwardY'].value = 0;
            this.audioContext.listener['forwardZ'].value = -1;
            this.audioContext.listener['upX'].value = 0;
            this.audioContext.listener['upY'].value = 1;
            this.audioContext.listener['upZ'].value = 0;
        } else {
            this.audioContext.listener.setOrientation(0, 0, -1, 0, 1, 0);
        }

        // Start the audio.
        source.start()
    }

    private onLoadSound() {
        if (this.loader.response === null)
            return
        this.audioContext.decodeAudioData(this.loader.response, (audioBuffer: AudioBuffer) => this.onAfterDecoded(audioBuffer));
    }

    private onAfterDecoded(audioBuffer: AudioBuffer) {
        this.audioBuffer = audioBuffer;
    }
}