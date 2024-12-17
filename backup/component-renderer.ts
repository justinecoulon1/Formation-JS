const COMPONENT_CREATOR = require("./component-creator.ts").COMPONENT_CREATOR;
const DOM = require("./dom.ts").DOM;
const GAME_VARIABLES = require("./game-variables.ts").GAME_VARIABLES;

export const COMPONENT_RENDERERS = {
    initDisplay: function () {
        COMPONENT_RENDERERS.resetDisplay();
        COMPONENT_RENDERERS.togglePlayButton();
        COMPONENT_RENDERERS.updateAmountOfTriesDisplay();
        COMPONENT_CREATOR.createGameScreen();
    },
    resetDisplay: function () {
        DOM.lettersDiv.replaceChildren();

    },
    updateDisplay: function () {
        COMPONENT_RENDERERS.updateAmountOfTriesDisplay();
    },
    displayEndGamePage: function () {
        DOM.mainDisplay.replaceChildren();
        DOM.manDiv.replaceChildren();
        DOM.wordDiv.replaceChildren();
        COMPONENT_RENDERERS.togglePlayButton();
    },
    togglePlayButton: function () {
        DOM.playButton.toggleAttribute('disabled');
    },
    toggleLetterButton: function (currentLetterBtn: HTMLButtonElement) {
        currentLetterBtn.toggleAttribute('disabled');
    },
    updateAmountOfTriesDisplay: function () {
        DOM.manDiv.textContent = `You have ${GAME_VARIABLES.maxAmountOfTries - GAME_VARIABLES.currentAmountOfTries} tries left`
    }
}