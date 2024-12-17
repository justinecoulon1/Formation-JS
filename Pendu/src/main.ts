const GAME_FUNCTIONS = {
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
            RENDERERS.updateDisplay();
        }

        if (GAME_VARIABLES.currentAmountOfTries === GAME_VARIABLES.maxAmountOfTries) {
            GAME_FUNCTIONS.endGame();
            RENDERERS.displayEndGamePage();
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

const DOM = {
    playButton: getHTMLElementOrThrow('#play-button'),
    mainDisplay: getHTMLElementOrThrow('#main-display'),
    manDiv: document.createElement('div'),
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

const GAME_VARIABLES = {
    currentAmountOfTries: 0,
    maxAmountOfTries: 6,
    wordToGuess: '',
    alphabet: 'abcdefghijklmnopqrstuvwxyz'.split(''),
}

const HANDLERS = {
    playButtonListener: function () {
        GAME_FUNCTIONS.initGame();
        RENDERERS.initDisplay();
    },
    letterButtonListener: function (e: any) {
        const currentLetterBtn = e.currentTarget;
        RENDERERS.toggleLetterButton(currentLetterBtn as HTMLButtonElement);
        GAME_FUNCTIONS.tryLetter(currentLetterBtn.textContent);
    }
}

const RENDERERS = {
    initDisplay: function () {
        RENDERERS.resetDisplay();
        RENDERERS.togglePlayButton();
        RENDERERS.updateAmountOfTriesDisplay();
        COMPONENT_CREATOR.createGameScreen();
    },
    resetDisplay: function () {
        DOM.lettersDiv.replaceChildren();

    },
    updateDisplay: function () {
        RENDERERS.updateAmountOfTriesDisplay();
    },
    displayEndGamePage: function () {
        DOM.mainDisplay.replaceChildren();
        DOM.manDiv.replaceChildren();
        DOM.wordDiv.replaceChildren();
        RENDERERS.togglePlayButton();
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

const COMPONENT_CREATOR = {
    createGameScreen: function () {
        const gameSection = document.createElement('section');
        gameSection.classList.add('game-section');

        DOM.manDiv.classList.add('pendu-div');
        RENDERERS.updateAmountOfTriesDisplay();
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
            letterBtn.addEventListener('click', HANDLERS.letterButtonListener);
            DOM.lettersDiv.append(letterBtn);

            DOM.letterButtons.push(letterBtn);
        }
    }
}

DOM.playButton.addEventListener('click', HANDLERS.playButtonListener);