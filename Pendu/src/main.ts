const GAME_FUNCTIONS = {
    initGame: function () {
        GAME_VARIABLES.wordToGuess = GAME_FUNCTIONS.getRandomWord();
        GAME_VARIABLES.currentAmountOfTries = 0;
        GAME_FUNCTIONS.updateCurrentlyGuessedWord([]);
    },
    getRandomWord: function () {
        return 'pomme';
    },
    isGameWon: function () {
        if (GAME_VARIABLES.currentlyGuessedWord.join('') === GAME_VARIABLES.wordToGuess) {
            const wonMessage = `YOU WON !!! The word was "${GAME_VARIABLES.wordToGuess}" `;
            RENDERERS.displayEndGamePage(wonMessage)
        }
    },
    isGameLost: function () {
        if (GAME_VARIABLES.currentAmountOfTries === GAME_VARIABLES.maxAmountOfTries) {
            const lostMessage = `YOU LOST !!! The word was "${GAME_VARIABLES.wordToGuess}" `;
            RENDERERS.displayEndGamePage(lostMessage);
        }
    },
    updateTries: function () {
        GAME_VARIABLES.currentAmountOfTries++
        if (GAME_VARIABLES.currentAmountOfTries < GAME_VARIABLES.maxAmountOfTries) {
            RENDERERS.updateAmountOfTriesDisplay();
        }
    },
    tryLetter: function (letter: string) {
        if (GAME_VARIABLES.wordToGuess.includes(letter)) {
            const indexesOfMatches: any[] = GAME_VARIABLES.wordToGuess.split('')
                .map((e, i) => e === letter ? i : -1)
                .filter((element) => element != -1);
            GAME_FUNCTIONS.updateCurrentlyGuessedWord(indexesOfMatches);
            RENDERERS.updateWordDisplayOnTry();
            GAME_FUNCTIONS.isGameWon();
        } else {
            GAME_FUNCTIONS.updateTries();
            GAME_FUNCTIONS.isGameLost();
        }
    },
    updateCurrentlyGuessedWord: function (indexesOfMatches: Array<number>) {
        for (let i = 0; i < GAME_VARIABLES.wordToGuess.length; i++) {
            if (indexesOfMatches.includes(i)) {
                GAME_VARIABLES.currentlyGuessedWord[i] = GAME_VARIABLES.wordToGuess.charAt(i);
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
    replayButton: getHTMLElementOrThrow('#replay-button'),
    mainDisplay: getHTMLElementOrThrow('#main-display'),
    manDiv: document.createElement('div'),
    wordDiv: document.createElement('div'),
    lettersDiv: document.createElement('div'),
    letterButtons: [] as HTMLElement[],
    letterDivs: [] as HTMLElement[],
    toGuessLetterContainerDiv: document.createElement('div'),
}

function getHTMLElementOrThrow(selector: string): HTMLElement {
    const element = document.querySelector(selector);
    if (!element) {
        throw new Error(`Missing ${selector}`);
    }
    return element as HTMLElement;
}

const GAME_VARIABLES = {
    currentAmountOfTries: 0,
    maxAmountOfTries: 6,
    wordToGuess: '',
    currentlyGuessedWord: [] as string[],
    alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
}

const HANDLERS = {
    playButtonListener: function () {
        RENDERERS.toggleButtonDisabledClass(DOM.playButton as HTMLButtonElement);
        RENDERERS.toggleButtonDisabledClass(DOM.replayButton as HTMLButtonElement);
        GAME_FUNCTIONS.initGame();
        RENDERERS.initDisplay();
    },
    replayButtonListener: function () {
        GAME_FUNCTIONS.initGame();
        RENDERERS.initDisplay();
    },
    letterButtonListener: function (e: any) {
        const currentLetterBtn = e.currentTarget;
        RENDERERS.toggleButtonDisabledClass(currentLetterBtn as HTMLButtonElement);

        GAME_FUNCTIONS.tryLetter(currentLetterBtn.textContent.toLowerCase());
    },
}

const RENDERERS = {
    initDisplay: function () {
        RENDERERS.resetDisplay();
        COMPONENT_CREATOR.createGameScreen();
        RENDERERS.updateAmountOfTriesDisplay();
    },
    resetDisplay: function () {
        DOM.mainDisplay.replaceChildren();
        DOM.lettersDiv.replaceChildren();
        DOM.toGuessLetterContainerDiv.replaceChildren();
        DOM.manDiv.replaceChildren();
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
    updateAmountOfTriesDisplay: function () {
        DOM.manDiv.textContent = `You have ${GAME_VARIABLES.maxAmountOfTries - GAME_VARIABLES.currentAmountOfTries} tries left`
    },
    updateWordDisplayOnTry: function () {
        DOM.toGuessLetterContainerDiv.replaceChildren();
        COMPONENT_CREATOR.createToGuessLettersDiv(GAME_VARIABLES.wordToGuess.length);
    }
}

const COMPONENT_CREATOR = {
    createGameScreen: function () {
        const gameSection = document.createElement('section');
        gameSection.classList.add('game-section');

        DOM.manDiv.classList.add('pendu-div');

        const lettersAndWordContainer = document.createElement('div')
        lettersAndWordContainer.classList.add('letters-word-container');

        COMPONENT_CREATOR.createWordDiv();
        DOM.lettersDiv.classList.add('letters-div');

        lettersAndWordContainer.append(DOM.lettersDiv, DOM.wordDiv)
        gameSection.append(DOM.manDiv, lettersAndWordContainer);
        DOM.mainDisplay.append(gameSection);

        COMPONENT_CREATOR.createLettersDiv();
    },
    createWordDiv: function () {
        DOM.toGuessLetterContainerDiv.classList.add('to-guess-letters-container-div');
        DOM.wordDiv.classList.add('word-div');
        COMPONENT_CREATOR.createToGuessLettersDiv(GAME_VARIABLES.wordToGuess.length);
        DOM.wordDiv.append(DOM.toGuessLetterContainerDiv)
    },
    createToGuessLettersDiv: function (lengthOfWord: number) {
        for (let i = 0; i < lengthOfWord; i++) {
            const letterDiv = document.createElement('div');
            letterDiv.textContent = GAME_VARIABLES.currentlyGuessedWord[i];
            DOM.toGuessLetterContainerDiv.append(letterDiv);
            DOM.letterDivs.push(letterDiv);
        }
    },
    createLettersDiv: function () {
        for (const letter of GAME_VARIABLES.alphabet) {
            const letterBtn = document.createElement('button');
            letterBtn.classList.add('letter-btn')
            letterBtn.textContent = letter.toUpperCase();
            letterBtn.addEventListener('click', HANDLERS.letterButtonListener);
            DOM.lettersDiv.append(letterBtn);

            DOM.letterButtons.push(letterBtn);
        }
    }
}

DOM.playButton.addEventListener('click', HANDLERS.playButtonListener);
DOM.replayButton.addEventListener('click', HANDLERS.replayButtonListener);