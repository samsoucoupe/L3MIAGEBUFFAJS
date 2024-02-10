export default class Sound {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.source = null;
    }

    loadSound(url) {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => this.audioContext.decodeAudioData(buffer))
            .catch(error => console.error('Erreur lors du chargement du son:', error));
    }

    playSound(buffer) {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = buffer;
        this.source.connect(this.audioContext.destination);
        this.source.start(0);
    }

    stopSound() {
        if (this.source) {
            this.source.stop();
        }
    }
}