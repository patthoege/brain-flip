import AudioController from './audioController.js';
import MixOrMatch from './mixOrMatch.js';

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
 * Adds click event listeners to the "Start Game", "How To Play" "Game over", "Win" and "Button Modules" elements,
 * allowing users to dismiss these overlays by clicking on them. 
 */
function overlayHandling() {
    const howToPlayButton = document.getElementById('how-to-play-button');
    const howToPlayOverlay = document.getElementById('how-to-play-overlay');
    const goBackButton = document.getElementById('go-back-button');
    const introGameText = document.getElementById('intro-game-text');
    const gameOverText = document.getElementById('game-over-text');
    const winText = document.getElementById('win-text');
    const buttonModule = document.getElementById('level-buttons');

    // Add event listeners to close overlay texts
    introGameText.addEventListener('click', () => {
        introGameText.classList.add('visible');
        introGameText.classList.add('hidden-overlay-text');
        buttonModule.classList.remove('hidden-overlay-text');
        buttonModule.classList.add('visible');
    });


    howToPlayButton.addEventListener('click', () => {
        event.stopPropagation();
        howToPlayOverlay.classList.add('visible');
        howToPlayOverlay.classList.remove('hidden-overlay-text');
        introGameText.classList.add('hidden-overlay-text');
        introGameText.classList.remove('visible');
    });


    goBackButton.addEventListener('click', () => {
        howToPlayOverlay.classList.remove('visible');
        howToPlayOverlay.classList.add('hidden-overlay-text');
        introGameText.classList.add('visible');
        introGameText.classList.remove('hidden-overlay-text');
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
    buttonModule.classList.add('visible');
    });
}

/**
 * Array creates an array from an HTML Collection and targets the click event 
 * to remove the start game overlay text. For each difficulty button in difficultyButtons, 
 * an event listener is attached that listens for a click event. Also card clicks events.
 * Makes the restart button visible only after the user has chosen a difficulty level.
 */

// Declare game variable 
let game;

function ready() {
    let cards = Array.from(document.getElementsByClassName('card'));
    let difficultyButtons = document.querySelectorAll('.difficulty-button'); 
    document.getElementById('restart-board').style.display = 'none';

    // Create an instance of AudioController
    const audioController = new AudioController();

    function showGameArea() {
        document.getElementById('level-buttons').style.display = 'none';
        document.querySelector('.game-container').style.display = 'grid';
        document.getElementById('position').style.position = 'relative';
    }

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

            game = new MixOrMatch(timerValue, cards, audioController);
            game.startGame();
            
            document.getElementById('restart-board').style.display = 'block';
            showGameArea();
        }); 
    });

    //For each card in the cards array, an event listener listens for a click event.
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card);
        });
    });
    // event listener to restart the game.
    const restartButton = document.getElementById('restart-board');
    restartButton.addEventListener('click', () => {
        game.startGame();
    });
    // calling overlay text elements to handle their dismissal.
    overlayHandling();
}