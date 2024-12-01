const difficultySelector = document.querySelector(".difficulty-selector");
let cardAmount = 10;
const mainDisplayDiv = document.querySelector(".main-display-div");
const playButton = document.querySelector("#play-button");
const allCards = [];
let cardDivByCardId = {};
const currentlyRevealedCards = [];
const correctPairs = []
let currentId = 1;

const createCards = function () {
    correctPairs.length = 0;
    const cards = [];
    for (let i = 0; i < cardAmount / 2; i++) {
        for (let j = 0; j < 2; j++) {
            const card = {
                id: currentId++,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${i + 1}.svg`,
                value: i,
            }
            cards.push(card);
        }
    }
    return cards;
}

const randomizeCards = function (cards) {
    for (let i = 0; i < cards.length; i++) {
        cards[i].randomId = (Math.random() * 10)
    }
    const randomizedCards = cards.sort(function (a, b) { return a.randomId - b.randomId });
    return randomizedCards;
}

const initializeCardsDisplay = function (cards) {
    mainDisplayDiv.replaceChildren();
    cardDivByCardId = {}
    for (const card of cards) {

        const cardDiv = document.createElement('div');
        cardDiv.classList.add("card");
        cardDivByCardId[card.id] = cardDiv;

        const cardImg = document.createElement('img');
        cardImg.classList.add("card-image");
        cardImg.setAttribute("draggable", "false");
        cardImg.classList.add("hidden");
        cardImg.src = card.image;
        cardImg.id = "id"

        const cardHiddenImg = document.createElement('img');
        cardHiddenImg.classList.add("card-hidden-image");
        cardHiddenImg.setAttribute("draggable", "false");
        cardHiddenImg.src = "/Memory_Pokemon/images/mystery.png";

        const cardDivEventListener = () => { onCardClick(card) }
        cardDiv.addEventListener('click', cardDivEventListener)
        cardDiv.append(cardImg);
        cardDiv.append(cardHiddenImg);
        mainDisplayDiv.append(cardDiv)
    }
}

const setGameDifficulty = function () {
    cardAmount = parseInt(difficultySelector.value);
}

const initializeGame = function () {
    allCards.length = 0
    setGameDifficulty();
    allCards.push(...createCards());
    const randomizedCards = randomizeCards(allCards);
    initializeCardsDisplay(randomizedCards);
}

playButton.addEventListener('click', function () {
    initializeGame();
})

const onCardClick = function (card) {
    reverseCard(card);
}

const reverseCard = function (card) {
    if (!isCardRevealed(card) && currentlyRevealedCards.length < 2) {
        toggleCardHiddenClass(card);
        currentlyRevealedCards.push(card);
        if (currentlyRevealedCards.length === 2) {
            if (isRevealedPairValid()) {
                correctPairs.push(currentlyRevealedCards[0], currentlyRevealedCards[1])
                currentlyRevealedCards.length = 0;
                if (isGameEnded()) {
                    displayGameEnd();
                }
            } else {
                setTimeout(resetWrongRevealedCards, 700);
            }
        }
    }
}

const isCardRevealed = function (card) {
    const cardDiv = cardDivByCardId[card.id]
    const cardImg = cardDiv.querySelector(".card-image");
    return !cardImg.classList.contains('hidden')
}

const toggleCardHiddenClass = function (card) {
    const cardDiv = cardDivByCardId[card.id]
    const cardImg = cardDiv.querySelector(".card-image");
    const cardHiddenImg = cardDiv.querySelector(".card-hidden-image");
    cardImg.classList.toggle("hidden");
    cardHiddenImg.classList.toggle("hidden");
}

const isRevealedPairValid = function () {
    return currentlyRevealedCards.length === 2 && currentlyRevealedCards[0].value === currentlyRevealedCards[1].value;
}

const resetWrongRevealedCards = function () {
    for (const card of currentlyRevealedCards) {
        toggleCardHiddenClass(card);
    }
    currentlyRevealedCards.length = 0;
}

const isGameEnded = function () {
    return correctPairs.length === cardAmount;
}

const displayGameEnd = function () {
    mainDisplayDiv.replaceChildren();
    const winningMessageP = document.createElement('p');
    winningMessageP.classList.add('winning-message-p');
    winningMessageP.textContent = "YOU WON!";
    mainDisplayDiv.append(winningMessageP);
}