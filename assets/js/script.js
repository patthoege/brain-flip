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
        // this.pause();
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
/**
 * This class creates the memory card game methods  
 */
class MixOrMatch {
    constructor(timerValue, cards) {
        this.cardsArray = cards;
        this.timerValue = timerValue;
        this.timeRemaining = timerValue;
        this.timer = document.getElementById('time-countdown');
        this.moves = document.getElementById('flips');
        this.audioController = new AudioController();
        this.difficultyButtons = document.querySelectorAll('.difficulty-button');
    }
  
    startGame() {
        this.cardCheck = null;
        this.totalClicks = 0;
        this.timeRemaining = this.timerValue;
        this.matchedCards =[];
        this.busy = true;
        
        //Clear previous countdown interval if it exists.
        if (this.countDown) {
            clearInterval(this.countDown);
        }

        //When the game is over, this function starts a new game.
        setTimeout(() => {
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
     * Captures the start time when the timer begins. Within the setInterval loop, 
     * it calculates the elapsed time in seconds and subtracts it from the original timerValue 
     * to get the remaining time. Update every 1000 milliseconds.
     */
    startCountDown() {
        const startTime = Date.now();
        return setInterval(() => {
            const currentTime = Date.now();
            const elapsedTime = Math.floor((currentTime - startTime) / 1000);
            this.timeRemaining = this.timerValue - elapsedTime;
    
            if (this.timeRemaining <= 0) {
                this.timeRemaining = 0;
                this.gameOver();
            }
    
            this.timer.innerText = this.timeRemaining;
        }, 1000); 
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

        this.timer.innerText = 0;
        this.moves.innerText = 0;
    }
    /**
     * Sets the game overlay text and the win sound
     */
    win() {
        clearInterval(this.countDown);
        this.audioController.win();
        const winText = document.getElementById('win-text');
        winText.classList.remove('hidden-overlay-text');
        winText.classList.add('visible');
        this.hideCards();

        this.timer.innerText = 0;
        this.moves.innerText = 0;
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
 * Adds click event listeners to the "game over" and "win" overlay text elements,
 * allowing users to dismiss these overlays by clicking on them.
 */
function overlayHandling() {
    const startGameText = document.getElementById('start-game-text');
    const gameOverText = document.getElementById('game-over-text');
    const winText = document.getElementById('win-text');
    const buttonModule = document.getElementById('level-buttons');

    // Add event listeners to close overlay texts
    startGameText.addEventListener('click', () => {
        startGameText.classList.remove('visible');
        startGameText.classList.add('hidden-overlay-text');
        buttonModule.classList.remove('hidden-overlay-text');
        buttonModule.classList.add('visible');
    }); 

    gameOverText.addEventListener('click', () => {
        gameOverText.classList.remove('visible');
        gameOverText.classList.add('hidden-overlay-text');
        buttonModule.classList.remove('hidden-overlay-text');
        buttonModule.classList.add('visible');
    });

    winText.addEventListener('click', () => {
        winText.classList.remove('visible');
        winText.classList.add('hidden-overlay-text');
        buttonModule.classList.remove('hidden-overlay-text');
        buttonModule.classList.add('visible');
    });

    buttonModule.addEventListener('click', () => {
        buttonModule.classList.remove('visible');
        buttonModule.classList.add('hidden-overlay-text');
    }); 
}

/**
 * Array creates an array from an HTML Collection and targets the click event 
 * to remove the start game overlay text.
 */
function ready() {
    let cards = Array.from(document.getElementsByClassName('card'));
    let game;

    this.difficultyButtons = document.querySelectorAll('.difficulty-button'); 

    // Add event listeners to difficulty buttons
    difficultyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const difficulty = button.getAttribute('data-level');
            let timerValue;

            // Set timer value based on difficulty
            if (difficulty === 'easy') {
                timerValue = 120;
            } else if (difficulty === 'medium') {
                timerValue = 90;
            } else if (difficulty === 'hard') {
                timerValue = 60;
            }

            game = new MixOrMatch(timerValue, cards);
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
    });

    overlayHandling();
}