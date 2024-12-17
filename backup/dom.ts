const COMPONENT_CREATOR = require("./component-creator.ts").COMPONENT_CREATOR;

export const DOM = {
    playButton: getHTMLElementOrThrow('#play-button'),
    mainDisplay: getHTMLElementOrThrow('#main-display'),
    manDiv: COMPONENT_CREATOR.createManDiv(),
    wordDiv: document.createElement('div'),
    lettersDiv: document.createElement('div'),
    letterButtons: [] as HTMLElement[],
}

function getHTMLElementOrThrow(selector: string): HTMLElement {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Missing ${selector}`);
    }
    return element as HTMLElement;
}