const inputRounds = document.querySelector('#rounds');
const inputPlayers = document.querySelector('#players');
const displayDiv = document.querySelector('.display_div');
const validatePlayersRounds = document.querySelector('.validate_rounds')

let amountOfRounds = 0;
let currentRound = 1;
let amountOfPlayers = 0;

let playerScoreInputs = [];
let allScoresArray = [];

// Fonction de création d'éléments visuel

const createButton = function createButton(img, id) {
    const button = document.createElement('button');
    const buttonImg = document.createElement('img');
    buttonImg.src = img;
    button.append(buttonImg);
    button.id = id;

    return button;
}

const createPlayerInput = function createPlayerInput(id) {
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `player_score_input_${id}`;

    return input;
}

const createPlayerLabel = function createPlayerLabel(id) {
    const label = document.createElement('label');
    label.textContent = `Player ${id + 1}`
    label.id = `player_score_label_${id}`;

    return label;
}

// Fonctions de calcul

const getScoresDisplayTexts = function getScoresDisplayTexts(scoresPerPlayerArray) {
    const scoresDisplayTexts = [];
    for (let i = 0; i < scoresPerPlayerArray.length; i++) {
        scoresDisplayTexts.push(`Player ${i + 1} scores: ${scoresPerPlayerArray[i]}`);
    }

    return scoresDisplayTexts;
}

const getBestScoresDisplayText = function getBestScoresText(bestScore) {
    const score = bestScore.score;
    const playerIds = bestScore.bestPlayerIds;
    const playerIdsString = playerIds.map((id) => id + 1).join(", ");
    return `Player${playerIds.length === 1 ? '' : 's'} ${playerIdsString} scored the best score (${score})`;
}

const getWinnerDisplayText = function getWinnerText(winners) {
    const winnersIds = winners.winnersIds;
    const winnersScore = winners.winnersScore;
    const winnersIdsString = winnersIds.map((id) => id + 1).join(", ");
    return `Player${winnersIds.length === 1 ? '' : 's'} ${winnersIdsString} won the game with a total score of ${winnersScore}`;
}


const getBestScore = function getBestScore(allScoresArray) {
    const bestPlayerIds = []
    let bestScore = 0;

    for (let i = 0; i < allScoresArray.length; i++) {
        const playerScoresArray = allScoresArray[i]
        for (let j = 0; j <= playerScoresArray.length - 1; j++) {
            if (playerScoresArray[j] >= bestScore) {
                if (playerScoresArray[j] !== bestScore) {
                    bestPlayerIds.length = 0;
                }
                bestScore = playerScoresArray[j]
                bestPlayerIds.push(i)
            }
        }
    }

    return {
        score: bestScore,
        bestPlayerIds
    };
}

const getWinner = function getWinner(allScoresArray) {
    let bestTotal = 0;
    const winnersIds = [];

    for (let i = 0; i < allScoresArray.length; i++) {
        const playerScoresArray = allScoresArray[i];
        let currentTotal = 0;
        for (let j = 0; j < playerScoresArray.length; j++) {
            currentTotal += playerScoresArray[j];
        }
        if (currentTotal >= bestTotal) {
            if (!currentTotal === bestTotal) {
                winners.length = 0;
            }
            bestTotal = currentTotal;
            winnersIds.push(i);
        }
    }
    return {
        winnersScore: bestTotal,
        winnersIds
    }
}

// Manipulation de page 

const displayAllScores = function displayAllScores(allScoresArray) {
    const scoreDisplayTexts = getScoresDisplayTexts(allScoresArray);
    displayDiv.replaceChildren();

    for (let i = 0; i < scoreDisplayTexts.length; i++) {
        const resultP = document.createElement('p');
        resultP.textContent = scoreDisplayTexts[i];
        displayDiv.append(resultP);
    }

    const bestScore = getBestScore(allScoresArray);
    const bestScoresString = getBestScoresDisplayText(bestScore);

    const bestScoreResult = document.createElement('p');
    bestScoreResult.id = "best_score_result"
    bestScoreResult.textContent = bestScoresString;
    displayDiv.append(bestScoreResult);

    const winners = getWinner(allScoresArray);
    const winnersString = getWinnerDisplayText(winners);

    const winnersResult = document.createElement('p');
    winnersResult.id = "winners_result"
    winnersResult.textContent = winnersString;
    displayDiv.append(winnersResult);

    displayDiv.append(resetButton)
}

const resetPage = function resetPage() {
    displayDiv.replaceChildren();

    const roundAmountLabel = document.createElement('label');
    const roundAmountInput = document.createElement('input');
    const playerAmountLabel = document.createElement('label');
    const playerAmountInput = document.createElement('input');
    const validateButton = createButton("images/validate.png", "validate_rounds");
    validateButton.classList.add("validate_rounds");
    validateButton.addEventListener('click', validatePlayerRoundsEventListener)

    roundAmountLabel.htmlFor = 'rounds';
    playerAmountLabel.htmlFor = 'players';
    roundAmountLabel.textContent = 'Nombre de manches :';
    playerAmountLabel.textContent = 'Nombre de joueurs :';


    roundAmountInput.id = 'rounds';
    playerAmountInput.id = 'player';
    playerAmountInput.type = 'number';
    roundAmountInput.type = 'number';

    displayDiv.append(roundAmountLabel,
        roundAmountInput,
        playerAmountLabel,
        playerAmountInput,
        validateButton)
}

const playerScoreButton = createButton('images/validate.png', 'player_score_button');
const roundHeader = document.createElement('h2');
const resetButton = createButton("images/reset.png", "reset");

// Event Listeners

const validatePlayerRoundsEventListener = function () {
    amountOfRounds = inputRounds.valueAsNumber;
    amountOfPlayers = inputPlayers.valueAsNumber;
    displayDiv.replaceChildren();

    roundHeader.textContent = `Round ${currentRound}`;
    displayDiv.append(roundHeader);

    for (let i = 0; i < amountOfPlayers; i++) {
        const playerScoreInput = createPlayerInput(i);
        playerScoreInputs.push(playerScoreInput);

        const playerScoreLabel = createPlayerLabel(i);

        displayDiv.append(playerScoreLabel);
        displayDiv.append(playerScoreInput);
    }

    for (let i = 0; i < amountOfPlayers; i++) {
        allScoresArray.push([]);
    }

    displayDiv.append(playerScoreButton)
}

validatePlayersRounds.addEventListener('click', validatePlayerRoundsEventListener);

playerScoreButton.addEventListener('click', function () {

    if (currentRound <= amountOfRounds) {
        const scoreArray = [];
        for (let input of playerScoreInputs) {
            scoreArray.push(input.valueAsNumber);
            input.value = "";
        }

        for (let i = 0; i < scoreArray.length; i++) {
            allScoresArray[i].push(scoreArray[i]);
        }
        currentRound++;

        if (currentRound > amountOfRounds) {
            displayAllScores(allScoresArray);
        }

    }
    roundHeader.textContent = `Round ${currentRound}`;
})

resetButton.addEventListener('click', function () {
    resetPage();
})