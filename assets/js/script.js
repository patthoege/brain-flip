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

    startMusic() {
        this.pause();
        this.bgMusic.play();
    }
    pauseMusic() {
        this.bgMusic.pause();
        this.bgMusic.currentTime = 0;
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
    }
    match() {
        this.pause();
        this.matchSound.play();
    }
    unmatched() {
        this.pause();
        this.unmatchedSound.play();
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
/**
 * This class creates the memory card game methods  
 */
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
        console.log('starting game...');
        
        //Clear previous countdown interval if it exists.
        if (this.countDown) {
            clearInterval(this.countDown);
        }

        //When the game is over, this function starts a new game.
        setTimeout(() => {
            this.audioController.startMusic();
            this.shuffleCards();
            this.countDown = this.startCountDown();
            this.busy = false;
        }, 400);

        //Sets the timer and moves
        this.hideCards();
        this.timer.innerText = this.timeRemaining;
        this.moves.innerText = this.totalClicks;
    }
    /**
     * Iterates through the cards array and removes the flip card from each.
     */
    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('flip');
        });
    }
    
    /**
     * Flips the cards, keeps track of the total clicks, 
     * updates the moves display. It plays the flip sound.
     * Checks if there is a prev. flipped card, 
     * it checks if current card matches it.
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
        // to delay the execution of a callback function(win)
        if(this.matchedCards.length === this.cardsArray.length) {
            setTimeout(() => {
                 this.win();
            }, 1500);
        }
    }

    /**
     * Flips the cards back, creates only one sec 
     */
    misMatch(card1, card2) {
        this.busy = true;
        setTimeout(() => {
            card1.classList.remove('flip');
            card2.classList.remove('flip');
            this.audioController.unmatched();
            this.busy = false;
        }, 1500);
        
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
               this.gameOver();
        },900);

    }

    /**
     * Sets the game overlay text and the game over sound
     */
    gameOver() {
        clearInterval(this.countDown);
        this.audioController.pauseMusic();
        this.audioController.gameOver();
        const gameOverText = document.getElementById('game-over-text');
        gameOverText.classList.remove('hidden-overlay-text');
        gameOverText.classList.add('visible');
        this.hideCards();
    }
    /**
     * Sets the game overlay text and the win sound
     */
    win() {
        clearInterval(this.countDown);
        this.audioController.pauseMusic();
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
     * https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj
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
    let game = new MixOrMatch(90, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.add('hidden-overlay-text');
            game.startGame();
            console.log('starting ready function...');
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
    });
}