const BUTTON_HANDLERS = require("./button-handler.ts").BUTTON_HANDLERS;
const DOM = require("./dom.ts").DOM;

DOM.playButton.addEventListener('click', BUTTON_HANDLERS.playButtonListener);