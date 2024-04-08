// This creates an audio objects declaration in OBJECT ORIENTED DESIGN PATTERNS. 
class AudioController {
    //This method declares every audio instance
    constructor() {
        this.bgMusic = new Audio('assets/audio/background-music.mp3');
        this.flipSound = new Audio('assets/audio/click.wav');
        this.matchSound = new Audio('assets/audio/match-sound.wav');
        this.unmatchedSound = new Audio('assets/audio/unmatched.wav');
        this.gameOverSound = new Audio('assets/audio/fail.wav');
        this.winSound = new Audio('assets/audio/well-done.wav');
    }
   
    // Rewinds all files before it attempts to play any of them
    pause() {
        this.flipSound.pause();
        this.flipSound.currentTime = 0;
        this.matchSound.pause();
        this.matchSound.currentTime = 0;
        this.unmatchedSound.pause();
        this.unmatchedSound.currentTime = 0;
        this.gameOverSound.pause();
        this.gameOverSound.currentTime = 0;
        this.winSound.pause();
        this.winSound.currentTime = 0;
    }

    flip() {
        this.pause();
        this.flipSound.play();
        this.flipSound.volume = 0.3;
    }
    match() {
        this.matchSound.play();
        this.matchSound.volume = 0.3;
    }
    unmatched() {
        this.pause();
        this.unmatchedSound.play();
        this.unmatchedSound.volume = 0.3;
    }
    win() {
        this.pause();
        this.winSound.play();
    }
    gameOver() {
        this.pause();
        this.gameOverSound.play();
    }
}

export default AudioController;