const GAME_FUNCTIONS = {
    initGame: function () {
        GAME_VARIABLES.wordToGuess = GAME_FUNCTIONS.getRandomWord();
        GAME_VARIABLES.currentAmountOfTries = 0;
    },
    getRandomWord: function () {
        return 'pomme';
    },
    isGameWon: function () {
        if (GAME_VARIABLES.currentlyGuessedWord.join('') === GAME_VARIABLES.wordToGuess) {
            RENDERERS.resetDisplay();
            const wonScreenDiv = document.createElement('div');
            wonScreenDiv.classList.add('end-screen-div');
            wonScreenDiv.textContent = `YOU WON !!! The word was "${GAME_VARIABLES.wordToGuess}" `
            DOM.mainDisplay.append(wonScreenDiv);
        }
    },
    updateTriesAndCheckIfGameEnded: function () {
        GAME_VARIABLES.currentAmountOfTries++
        if (GAME_VARIABLES.currentAmountOfTries < GAME_VARIABLES.maxAmountOfTries) {
            RENDERERS.updateDisplay();
        }

        if (GAME_VARIABLES.currentAmountOfTries === GAME_VARIABLES.maxAmountOfTries) {
            RENDERERS.displayEndGamePage();
        }
    },
    tryLetter: function (letter: string) {
        if (GAME_VARIABLES.wordToGuess.includes(letter)) {
            const wordToGuessArray = GAME_VARIABLES.wordToGuess.split('');
            const indexesOfMatches: any[] = wordToGuessArray.map((e, i) => e === letter ? i : -1).filter((element) => element != -1);
            GAME_FUNCTIONS.updateCurrentlyGuessedWord(indexesOfMatches);
            RENDERERS.updateWordDisplayOnTry();
            GAME_FUNCTIONS.isGameWon();
        } else {
            GAME_FUNCTIONS.updateTriesAndCheckIfGameEnded();
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
        RENDERERS.togglePlayButton();
        GAME_FUNCTIONS.initGame();
        RENDERERS.initDisplay();
    },
    letterButtonListener: function (e: any) {
        const currentLetterBtn = e.currentTarget;
        RENDERERS.toggleLetterButton(currentLetterBtn as HTMLButtonElement);

        GAME_FUNCTIONS.tryLetter(currentLetterBtn.textContent.toLowerCase());
    },
    replayButtonListener: function () {
        GAME_FUNCTIONS.initGame();
        RENDERERS.initDisplay();
    }
}

const RENDERERS = {
    initDisplay: function () {
        RENDERERS.resetDisplay();
        RENDERERS.updateAmountOfTriesDisplay();
        COMPONENT_CREATOR.createGameScreen();
    },
    resetDisplay: function () {
        DOM.mainDisplay.replaceChildren();
        DOM.lettersDiv.replaceChildren();
        DOM.toGuessLetterContainerDiv.replaceChildren();
        DOM.manDiv.replaceChildren();
    },
    updateDisplay: function () {
        RENDERERS.updateAmountOfTriesDisplay();
    },
    displayEndGamePage: function () {
        RENDERERS.resetDisplay();
        const wonScreenDiv = document.createElement('div');
        wonScreenDiv.classList.add('end-screen-div');
        wonScreenDiv.textContent = `YOU LOST !!! The word was "${GAME_VARIABLES.wordToGuess}" `
        DOM.mainDisplay.append(wonScreenDiv);
    },
    togglePlayButton: function () {
        DOM.playButton.toggleAttribute('disabled');
    },
    toggleLetterButton: function (currentLetterBtn: HTMLButtonElement) {
        currentLetterBtn.toggleAttribute('disabled');
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
        RENDERERS.updateAmountOfTriesDisplay();
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
        GAME_FUNCTIONS.updateCurrentlyGuessedWord([]);
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