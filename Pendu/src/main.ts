const GAME_FUNCTIONS = {
    initGame: function () {
        GAME_VARIABLES.secretWord = GAME_FUNCTIONS.getRandomWord();
        GAME_VARIABLES.currentTriesAmount = 0;
        GAME_VARIABLES.maxTriesAmount = 6;
        GAME_FUNCTIONS.updateCurrentlyGuessedWord([]);
    },
    getRandomWord: function () {
        return 'pomme';
    },
    triggerGameWon: function () {
        if (GAME_VARIABLES.currentlyGuessedWord.join('') === GAME_VARIABLES.secretWord) {
            const wonMessage = `YOU WON !!! The word was "${GAME_VARIABLES.secretWord}" `;
            RENDERERS.displayEndGamePage(wonMessage)
        }
    },
    triggerGameLost: function () {
        if (GAME_VARIABLES.currentTriesAmount === GAME_VARIABLES.maxTriesAmount) {
            const lostMessage = `YOU LOST !!! The word was "${GAME_VARIABLES.secretWord}" `;
            RENDERERS.displayEndGamePage(lostMessage);
        }
    },
    updateTriesAmount: function () {
        GAME_VARIABLES.currentTriesAmount++
        if (GAME_VARIABLES.currentTriesAmount < GAME_VARIABLES.maxTriesAmount) {
            RENDERERS.updateTriesDisplay();
        }
    },
    tryLetter: function (letter: string, letterBtn: HTMLButtonElement) {
        if (GAME_VARIABLES.secretWord.includes(letter)) {
            letterBtn.classList.add('letter-green-bg')
            const indexesOfMatches: any[] = GAME_VARIABLES.secretWord.split('')
                .map((e, i) => e === letter ? i : -1)
                .filter((element) => element != -1);
            GAME_FUNCTIONS.updateCurrentlyGuessedWord(indexesOfMatches);
            RENDERERS.updateSecretWordDisplay();
            GAME_FUNCTIONS.triggerGameWon();
        } else {
            letterBtn.classList.add('letter-red-bg');
            GAME_FUNCTIONS.updateTriesAmount();
            GAME_FUNCTIONS.triggerGameLost();
        }
    },
    updateCurrentlyGuessedWord: function (indexesOfMatches: Array<number>) {
        for (let i = 0; i < GAME_VARIABLES.secretWord.length; i++) {

            if (indexesOfMatches.includes(i)) {
                GAME_VARIABLES.currentlyGuessedWord[i] = GAME_VARIABLES.secretWord.charAt(i);
            } else {
                if (GAME_VARIABLES.currentlyGuessedWord[i] === '_' || indexesOfMatches.length === 0) {
                    GAME_VARIABLES.currentlyGuessedWord[i] = '_';
                }
            }

        }
    }
}

const DOM = {
    playButton: getHTMLElementOrThrow('#play-button'),
    retryButton: getHTMLElementOrThrow('#retry-button'),
    mainDisplay: getHTMLElementOrThrow('#main-display'),
    hangingManDiv: document.createElement('div'),
    secretWordDiv: document.createElement('div'),
    keyboardDiv: document.createElement('div'),
    keyboardLetters: [] as HTMLElement[],
    secretWordLetterDivs: [] as HTMLElement[],
    secretWordLetterContainer: document.createElement('div'),
}

function getHTMLElementOrThrow(selector: string): HTMLElement {
    const element = document.querySelector(selector);

    if (!element) {
        throw new Error(`Missing ${selector}`);
    }
    return element as HTMLElement;
}

const GAME_VARIABLES = {
    currentTriesAmount: 0,
    maxTriesAmount: 6,
    secretWord: '',
    currentlyGuessedWord: [] as string[],
    //tab discovered letters plutôt 
    alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
}

const HANDLERS = {
    playButtonListener: function () {
        RENDERERS.toggleButtonDisabledClass(DOM.playButton as HTMLButtonElement);
        RENDERERS.toggleButtonDisabledClass(DOM.retryButton as HTMLButtonElement);
        GAME_FUNCTIONS.initGame();
        RENDERERS.initDisplay();
    },
    retryButtonListener: function () {
        GAME_FUNCTIONS.initGame();
        RENDERERS.initDisplay();
    },
    keyboardLettersListener: function (e: Event) {
        const currentLetterBtn = e.currentTarget as HTMLButtonElement;
        RENDERERS.toggleButtonDisabledClass(currentLetterBtn as HTMLButtonElement);

        const currentLetter = currentLetterBtn.textContent as string;
        GAME_FUNCTIONS.tryLetter(currentLetter.toLowerCase(), currentLetterBtn);
    },
}

const RENDERERS = {
    initDisplay: function () {
        RENDERERS.resetDisplay();
        COMPONENT_CREATOR.createGameScreen();
        RENDERERS.updateTriesDisplay();
    },
    resetDisplay: function () {
        DOM.mainDisplay.replaceChildren();
        DOM.keyboardDiv.replaceChildren();
        DOM.secretWordLetterContainer.replaceChildren();
        DOM.hangingManDiv.replaceChildren();
    },
    displayEndGamePage: function (endMessage: string) {
        RENDERERS.resetDisplay();

        const endScreenDiv = document.createElement('div');
        endScreenDiv.classList.add('end-screen-div');
        endScreenDiv.textContent = endMessage;
        DOM.mainDisplay.append(endScreenDiv);
    },
    toggleButtonDisabledClass: function (button: HTMLButtonElement) {
        button.toggleAttribute('disabled');
    },
    updateTriesDisplay: function () {
        DOM.hangingManDiv.textContent = `You have ${GAME_VARIABLES.maxTriesAmount - GAME_VARIABLES.currentTriesAmount} tries left`
    },
    updateSecretWordDisplay: function () {
        DOM.secretWordLetterContainer.replaceChildren();
        COMPONENT_CREATOR.createSecretWordLettersDiv(GAME_VARIABLES.secretWord.length);
    }
}

const COMPONENT_CREATOR = {
    createGameScreen: function () {
        const gameSection = document.createElement('section');
        gameSection.classList.add('game-section');

        DOM.hangingManDiv.classList.add('hanging-man-div');

        const keyboardAndAnswerContainer = document.createElement('div')
        keyboardAndAnswerContainer.classList.add('keyboard-answer-container');

        COMPONENT_CREATOR.createSecretWordDiv();
        DOM.keyboardDiv.classList.add('keyboard-div');

        keyboardAndAnswerContainer.append(DOM.keyboardDiv, DOM.secretWordDiv)
        gameSection.append(DOM.hangingManDiv, keyboardAndAnswerContainer);
        DOM.mainDisplay.append(gameSection);

        COMPONENT_CREATOR.createKeyboardLettersDiv();
    },
    createSecretWordDiv: function () {
        DOM.secretWordLetterContainer.classList.add('secret-word-letters-container');
        DOM.secretWordDiv.classList.add('secret-word-div');
        COMPONENT_CREATOR.createSecretWordLettersDiv(GAME_VARIABLES.secretWord.length);
        DOM.secretWordDiv.append(DOM.secretWordLetterContainer)
    },
    createSecretWordLettersDiv: function (lengthOfWord: number) {
        for (let i = 0; i < lengthOfWord; i++) {
            const letterDiv = document.createElement('div');
            letterDiv.textContent = GAME_VARIABLES.currentlyGuessedWord[i];
            DOM.secretWordLetterContainer.append(letterDiv);
            DOM.secretWordLetterDivs.push(letterDiv);
        }
    },
    createKeyboardLettersDiv: function () {
        for (const letter of GAME_VARIABLES.alphabet) {
            const letterBtn = document.createElement('button');
            letterBtn.classList.add('letter-btn')
            letterBtn.textContent = letter.toUpperCase();
            letterBtn.addEventListener('click', HANDLERS.keyboardLettersListener);
            DOM.keyboardDiv.append(letterBtn);

            DOM.keyboardLetters.push(letterBtn);
        }
    }
}

DOM.playButton.addEventListener('click', HANDLERS.playButtonListener);
DOM.retryButton.addEventListener('click', HANDLERS.retryButtonListener);