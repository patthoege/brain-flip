//'This' creates audio objects declaration from the OOP (OBJECT ORIENTED DESIGN PATTERNS)
class AudioController {
    constructor() {
        this.bgMusic = new Audio('assets/audio/background-music.mp3');
        this.flipSound = new Audio('assets/audio/click.wav');
        this.matchSound = new Audio('assets/audio/match-sound.wav');
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

        //Clear previous countdown interval if it exists.
        if (this.countDown) {
            clearInterval(this.countDown);
        }

        /**
         * When the game is over, this function starts a new game.
         */
        setTimeout(() => {
            this.audioController.startMusic();
            this.hideCards();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 400);

        /**
         * Sets the timer and moves
         */
        this.timer.innerText = this.timeRemaining;
        this.moves.innerText = this.totalClicks;
    }
    
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('flip');
        });
    }
    
    /**
     * This function flips the cards and counts the moves, 
     * when the cards are being clicked. It plays the flip sound.
     */
    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.moves.innerText = this.totalClicks;
            card.classList.add('flip');

            if (this.cardCheck)
            this.checkForMatch(card);
            else
            this.cardCheck = card;
        }
    }

    /**
     * Gets the card type value and compares with card to check and evaluates
     * if this card matched to card to check.
     * Else evaluates the mismatched function to card to check.
     */
    checkForMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardCheck))
            this.cardMatch(card, this.cardCheck);
        else 
            this.misMatch(card, this.cardCheck);

        this.cardCheck = null; 
    }

    /** 
     * Push card 1 & 2, and evaluates the match cards if it is equal to the
     * cardsArray and displays the win text overlay.
     */
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        this.audioController.match();

        if(this.matchedCards.length === this.cardsArray.length)
      
        this.win();
    }
    /**
     * Flips the cards back, creates only one sec 
     */
    misMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            this.busy = false;
        }, 1000);
    }

    /**
     * Gets the value card class
     */
    getCardType(card){
        return card.getElementsByClassName('card-value')[0].src;
    }

    /**
     * Sets the count down remaining 
     */
    startCountDown() {
        return setInterval(() => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0)
               this.gameOver()
        },900);

    }

    /**
     * Sets the game overlay text and the game over sound
     */
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.gameOver();
        const gameOverText = document.getElementById('game-over-text');
        gameOverText.classList.remove('hidden-overlay-text');
        gameOverText.classList.add('visible');
        this.hideCards();
    }

    win() {
        clearInterval(this.countDown);
        this.audioController.win();
        const winText = document.getElementById('win-text');
        winText.classList.remove('hidden-overlay-text');
        winText.classList.add('visible');
        this.hideCards();
    
    }

   /**
    * The current not flipped card, and not matched card, and
    * not cards to check. All of the statements must return false in order to be true.
    */
    canFlipCard(card) {
        return !this.busy && !this.matchedCards.includes(card) && card !== this.cardCheck;
    }

    /**
     * This function shuffles the order from the array. 
     * Shuffle adapted from Fisher-Yates algorithm.
     */
    shuffleCards() {
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let randIndex = Math.floor(Math.random() * (i+1));
            this.cardsArray[randIndex].style.order = i;
            this.cardsArray[i].style.order = randIndex;
        }
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
    let game = new MixOrMatch(5, cards);

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

    const restartButton = document.getElementById('restart-board');
    restartButton.addEventListener('click', () => {
        game.startGame();
        resetFlipsCount();
        resetTimer();
    });
}