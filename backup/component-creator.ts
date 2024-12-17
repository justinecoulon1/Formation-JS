const BUTTON_HANDLERS = require("./button-handler.ts").BUTTON_HANDLERS;
const COMPONENT_RENDERERS = require("./component-renderer.ts").COMPONENT_RENDERERS;
const DOM = require("./dom.ts").DOM;
const GAME_VARIABLES = require("./game-variables.ts").GAME_VARIABLES;

export const COMPONENT_CREATOR = {
    createGameScreen: function () {
        const gameSection = document.createElement('section');
        gameSection.classList.add('game-section');

        DOM.manDiv.classList.add('pendu-div');
        COMPONENT_RENDERERS.updateAmountOfTriesDisplay();
        COMPONENT_CREATOR.createWordDiv();
        DOM.lettersDiv.classList.add('letters-div');

        gameSection.append(DOM.manDiv, DOM.lettersDiv, DOM.wordDiv);
        DOM.mainDisplay.append(gameSection);

        this.createLettersDiv();
    },
    createWordDiv: function () {
        const toGuessLetterContainerDiv = document.createElement('div');
        toGuessLetterContainerDiv.classList.add('to-guess-letters-container-div');
        DOM.wordDiv.classList.add('word-div');
        for (const _letter of GAME_VARIABLES.wordToGuess) {
            const letterDiv = document.createElement('div');
            letterDiv.textContent = '_'
            toGuessLetterContainerDiv.append(letterDiv);
        }
        DOM.wordDiv.append(toGuessLetterContainerDiv)
    },
    createLettersDiv: function () {
        for (const letter of GAME_VARIABLES.alphabet) {
            const letterBtn = document.createElement('button');
            letterBtn.classList.add('btn', 'letter-btn')
            letterBtn.textContent = letter;
            letterBtn.addEventListener('click', BUTTON_HANDLERS.letterButtonListener);
            DOM.lettersDiv.append(letterBtn);

            DOM.letterButtons.push(letterBtn);
        }
    },
    createManDiv: function () {
        const manDivElement = document.createElement('div');

        return manDivElement;
    }
}