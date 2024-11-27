const inputRounds = document.querySelector('#rounds');
const inputPlayers = document.querySelector('#players');
const displayDiv = document.querySelector('.display_div');
const validatePlayersRounds = document.querySelector('.validate_rounds')

let playerScoreButton = createButton('images/validate.png', 'player_score_button');
let roundHeader = document.createElement('h2');

let amountOfRounds = 0;
let currentRound = 1;
let amountOfPlayers = 0;

let playerScoreInputs = [];
let allScoresPerPlayerArray = [];


validatePlayersRounds.addEventListener('click', function () {
    amountOfRounds = inputRounds.valueAsNumber;
    amountOfPlayers = inputPlayers.valueAsNumber;
    displayDiv.replaceChildren();

    roundHeader.textContent = `Round ${currentRound}`;
    displayDiv.append(roundHeader);

    for (let i = 0; i < amountOfPlayers; i++) {
        const playerScoreInput = createInput(i);
        playerScoreInputs.push(playerScoreInput);

        const playerScoreLabel = createLabel(i);

        displayDiv.append(playerScoreLabel);
        displayDiv.append(playerScoreInput);
    }

    for (let i = 0; i < amountOfPlayers; i++) {
        allScoresPerPlayerArray.push([]);
    }

    displayDiv.append(playerScoreButton)
})

playerScoreButton.addEventListener('click', function () {

    if (currentRound <= amountOfRounds) {
        const scoreArray = [];
        for (let input of playerScoreInputs) {
            scoreArray.push(input.valueAsNumber);
            input.value = "";
        }

        for (let i = 0; i < scoreArray.length; i++) {
            allScoresPerPlayerArray[i].push(scoreArray[i]);
        }
        currentRound++;

        if (currentRound > amountOfRounds) {
            const scoreDisplayTexts = getScoresDisplayTexts(allScoresPerPlayerArray);
            displayDiv.replaceChildren();

            for (let i = 0; i < scoreDisplayTexts.length; i++) {
                const resultP = document.createElement('p');
                resultP.textContent = scoreDisplayTexts[i];
                displayDiv.append(resultP);
            }

            const bestScore = getBestScore(allScoresPerPlayerArray);
            const bestScoresString = getBestScoresText(bestScore);

            const bestScoreResult = document.createElement('p');
            bestScoreResult.id = "best_score_result"
            bestScoreResult.textContent = bestScoresString;
            displayDiv.append(bestScoreResult);
        }
    }

    roundHeader.textContent = `Round ${currentRound}`;
})

function createButton(img, id) {
    const button = document.createElement('button');
    const buttonImg = document.createElement('img');
    buttonImg.src = img;
    button.append(buttonImg);
    button.id = id;

    return button;
}

function createInput(id) {
    const input = document.createElement('input');
    input.type = 'number';
    input.id = `player_score_input_${id}`;

    return input;
}

function createLabel(id) {
    const label = document.createElement('label');
    label.textContent = `Player ${id + 1}`
    label.id = `player_score_label_${id}`;

    return label;
}

function getScoresDisplayTexts(scoresPerPlayerArray) {
    const scoresDisplayTexts = [];
    for (let i = 0; i < scoresPerPlayerArray.length; i++) {
        scoresDisplayTexts.push(`Player ${i + 1} scores: ${scoresPerPlayerArray[i]}`);
    }

    return scoresDisplayTexts;
}

function getBestScoresText(bestScore) {
    const score = bestScore.score;
    const playerIds = bestScore.bestPlayerIds;
    const playerIdsString = playerIds.map((id) => id + 1).join(", ");
    return `Player${playerIds.length === 1 ? '' : 's'} ${playerIdsString} scored the best score (${score})`
}

function getBestScore(allScoresArray) {
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