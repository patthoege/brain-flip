//'This' creates audio objects declaration from the OOP (OBJECT ORIENTED DESIGN PATTERNS)
class AudioController {
    constructor() {
        this.bgMusic = new Audio('assets/audio/background-music.mp3');
        this.flipSound = new Audio('assets/audio/click.wav');
        this.matchSound = new Audio('assets/audio/matched-sound.wav');
        this.unmatchedSound = new Audio('assets/audio/unmatched.wav');
        this.gameOverSound = new Audio('assets/audio/fail.wav');
        this.winSound = new Audio('assets/audio/well-done.wav');
    }

    startMusic() {
        this.bgMusic.play();
    }
    pauseMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    unmatched() {
        this.unmatchedSound.play();
    }
    win() {
        this.pauseMusic();
        this.winSound.play();
    }
    gameOver() {
        this.pauseMusic();
        this.gameOverSound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards;
        this.totalTime = totalTime;
        this.timeRemaining = totalTime;
        this.timer = document.getElementById('time-countdown');
        this.moves = document.getElementById('flips');
        this.audioController = new AudioController();
    }

    startGame() {
        this.cardCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.totalTime;
        this.matchedCards =[];
        this.busy = true;
    }

    flipCard(card) {
        if(this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.moves.innerText = this.totalClicks;
            card.classList.add('flip');
            
            
        }

    }

    canFlipCard(card) {
        return true;
        //return !this.busy && !this.matchedCards.includes(card) !== this.cardCheck;
    }
}

/**
 * Finish loading the DOM before game can start adopted from "Love Maths" 
 * https://github.com/Code-Institute-Solutions/love-maths-2.0-sourcecode
 */
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready());
} else {
    ready();
}

/**
 * Array creates an array from an HTML Collection and targets the click event 
 * to remove the start game overlay text.
 */
function ready() {
    let overlays = Array.from(document.getElementsByClassName('overlay-text'));
    let cards = Array.from(document.getElementsByClassName('card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.parentNode.removeChild(overlay);
            game.startGame();
        });
    });

    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
}