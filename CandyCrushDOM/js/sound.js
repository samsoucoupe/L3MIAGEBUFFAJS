export default class Sound {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    loadSound(url) {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(buffer => this.audioContext.decodeAudioData(buffer))
            .catch(error => console.error('Erreur lors du chargement du son:', error));
    }

    playSound(buffer) {
        const source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    }
}