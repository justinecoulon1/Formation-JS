const COMPONENT_RENDERERS = require("./component-renderer.ts").COMPONENT_RENDERERS;
const GAME_FUNCTIONS = require("./game-functions.ts").GAME_FUNCTIONS;

export const BUTTON_HANDLERS = {
    playButtonListener: function () {
        GAME_FUNCTIONS.initGame();
        COMPONENT_RENDERERS.initDisplay();
    },
    letterButtonListener: function (e: any) {
        const currentLetterBtn = e.currentTarget;
        COMPONENT_RENDERERS.toggleLetterButton(currentLetterBtn as HTMLButtonElement);
        GAME_FUNCTIONS.tryLetter(currentLetterBtn.textContent);
    }
}