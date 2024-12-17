const COMPONENT_RENDERERS = require("./component-renderer.ts").COMPONENT_RENDERERS;
const GAME_VARIABLES = require("./game-variables.ts").GAME_VARIABLES;

export const GAME_FUNCTIONS = {
    initGame: function () {
        GAME_VARIABLES.wordToGuess = GAME_FUNCTIONS.getRandomWord();
        GAME_VARIABLES.currentAmountOfTries = 0;

    },
    getRandomWord: function () {
        return 'typescript';
    },
    endGame: function () {
    },
    updateTries: function () {
        GAME_VARIABLES.currentAmountOfTries++
        if (GAME_VARIABLES.currentAmountOfTries < GAME_VARIABLES.maxAmountOfTries) {
            COMPONENT_RENDERERS.updateDisplay();
        }

        if (GAME_VARIABLES.currentAmountOfTries === GAME_VARIABLES.maxAmountOfTries) {
            GAME_FUNCTIONS.endGame();
            COMPONENT_RENDERERS.displayEndGamePage();
        }
    },
    tryLetter: function (letter: string) {
        GAME_FUNCTIONS.updateTries();
        if (GAME_VARIABLES.wordToGuess.includes(letter)) {
            console.log('includes letter: ' + letter)
        } else {
            console.log('does not include letter: ' + letter)
        }
    }
}