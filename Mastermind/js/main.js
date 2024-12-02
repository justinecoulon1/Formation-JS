const solution = [];
const colors = ['red', 'blue', 'green', 'yellow', 'white']
const currentTry = [];
const hints = [];
const exampleBubble = document.querySelectorAll("#colored-bubble");
const mainContainerDiv = document.querySelector(".main-container-div");
const initialTryContainerDiv = document.querySelector(".initial-try-container-div");
let initialTryDiv = "";
let tryBubbles = "";
const playButton = document.querySelector("#play-button");


// INIT **************************************
const initializeGame = function () {
    initializeDisplay();
    initializeSolution();
    console.log(solution);
}

const initializeDisplay = function () {
    initialTryContainerDiv.replaceChildren();
    mainContainerDiv.replaceChildren();
    initialTryDiv = document.createElement('div');
    initialTryDiv.classList.add("try-bubbles-div");
    initialTryDiv.id = "initial-try-div"
    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add("bubbles-div");

    for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add("try-bubble");
        bubble.id = i + 1;
        bubbleDiv.append(bubble);
    }
    initialTryDiv.append(bubbleDiv);
    initialTryContainerDiv.append(initialTryDiv);
    tryBubbles = document.querySelectorAll(".try-bubble");
}

const initializeSolution = function () {
    solution.length = 0;
    for (let i = 0; i < 5; i++) {
        solution.push(colors[Math.floor(Math.random() * colors.length)]);
    }
}

// ***********************************************

const resetCurrentTry = function () {
    currentTry.length = 0;
    for (let tryBubble of tryBubbles) {
        tryBubbleClasses = tryBubble.classList;
        tryBubble.classList.remove(tryBubbleClasses[1]);
    }
}

const addCurrentTryDisplayToHistory = function () {
    const currentTryDiv = document.createElement('div');
    currentTryDiv.classList.add("try-bubbles-div");
    const bubbleDiv = document.createElement('div');
    bubbleDiv.classList.add("bubbles-div");

    for (let i = 0; i < 5; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add("try-bubble");
        bubble.id = i + 1;
        bubble.classList.add(currentTry[i])
        bubbleDiv.append(bubble);
    }
    const currentHints = getHintsDisplay();
    currentTryDiv.append(bubbleDiv);
    currentTryDiv.append(currentHints);
    mainContainerDiv.prepend(currentTryDiv);
}

const checkMatches = function () {
    hints.length = 0;
    const copyOfSolution = [...solution];
    const copyOfCurrentTry = [...currentTry];
    const indexesToDelete = [];
    for (let i = 0; i < 5; i++) {
        if (currentTry[i] === solution[i]) {
            hints.push("check.png")
            indexesToDelete.push(i)
        }
    }

    for (let k = indexesToDelete.length - 1; k >= 0; k--) {
        copyOfCurrentTry.splice(indexesToDelete[k], 1);
        copyOfSolution.splice(indexesToDelete[k], 1);
    }

    for (let j = 0; j < copyOfCurrentTry.length; j++) {
        if (copyOfSolution.includes(copyOfCurrentTry[j])) {
            hints.push("warning.png")
        } else {
            hints.push("incorrect.png")
        }
    }

    if (isGameEnded(indexesToDelete)) {
        displayGameEnd();
    }
}

const isGameEnded = function (indexesToDelete) {
    return indexesToDelete.length === 5;
}

const getHintsDisplay = function () {
    const hintsDiv = document.createElement('div');
    hintsDiv.classList.add("hints-div");
    for (let i = 0; i < hints.length; i++) {
        const hintDiv = document.createElement('div');
        hintDiv.classList.add("hint-div");
        const hintImg = document.createElement('img');
        hintImg.src = `./images/${hints[i]}`
        hintDiv.append(hintImg);
        hintsDiv.append(hintDiv);
    }
    return hintsDiv;
}

const displayGameEnd = function () {
    mainContainerDiv.replaceChildren();
    const winningMessageP = document.createElement('p');
    winningMessageP.classList.add('winning-message-p');
    winningMessageP.textContent = "YOU WON!";
    mainContainerDiv.append(winningMessageP);
}

//EVENT LISTENER *********************************************************

playButton.addEventListener('click', initializeGame);


const coloredBubblesEventListener = function () {
    if (currentTry.length < 5) {
        currentTry.push(this.classList[0]);
        tryBubbles[currentTry.length - 1].classList.add(this.classList[0]);
    }

    if (currentTry.length === 5) {
        checkMatches();
        addCurrentTryDisplayToHistory();
        resetCurrentTry();
    }
}
exampleBubble.forEach((bubble) => bubble.addEventListener('click', coloredBubblesEventListener));