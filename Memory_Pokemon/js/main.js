const cardAmount = 10;
const mainDisplayDiv = document.querySelector(".main-display-div");
const playButton = document.querySelector("#play-button");
const cardsDiv = [];
const currentlyReversedCards = [];
const correctPairs = []

const createCards = function () {
    const cards = [];
    for (let i = 0; i < cardAmount / 2; i++) {
        for (let j = 0; j < 2; j++) {
            const card = {
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${i + 1}.svg`,
                value: i
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

const displayCards = function (cards) {
    mainDisplayDiv.replaceChildren();
    for (let card of cards) {

        const cardDiv = document.createElement('div');
        cardDiv.classList.add("card");
        cardsDiv.push(cardDiv);

        const cardImg = document.createElement('img');
        cardImg.classList.add("card-image");
        cardImg.classList.add("hidden");
        cardImg.src = card.image;
        cardImg.id = "id"

        const cardHiddenImg = document.createElement('img');
        cardHiddenImg.classList.add("card-hidden-image");
        cardHiddenImg.src = "/images/mystery.png";

        const cardDivEventListener = () => { onCardClick(card, cardDiv) }
        cardDiv.addEventListener('click', cardDivEventListener)
        cardDiv.append(cardImg);
        cardDiv.append(cardHiddenImg);
        mainDisplayDiv.append(cardDiv)
    }
}

const initializeGame = function () {
    const cards = createCards();
    const randomizedCards = randomizeCards(cards);
    displayCards(randomizedCards);
}

playButton.addEventListener('click', function () {
    initializeGame();
})

const onCardClick = function (card, cardDiv) {
    reverseCard(card, cardDiv);
}

const reverseCard = function (card, cardDiv) {
    let cardImg = cardDiv.querySelector(".card-image");
    let cardHiddenImg = cardDiv.querySelector(".card-hidden-image");
    if (cardImg.classList.contains("hidden") && currentlyReversedCards.length < 2) {
        console.log("je retourne les cartes")
        console.log(card)
        cardImg.classList.toggle("hidden");
        cardHiddenImg.classList.toggle("hidden");
        currentlyReversedCards.push({ card, cardImg, cardHiddenImg });
        console.log(currentlyReversedCards.length)

        if (currentlyReversedCards.length === 2) {
            const isValidPair = checkValidPairs(currentlyReversedCards);
            console.log("is valid pair = " + isValidPair)
            if (isValidPair) {
                correctPairs.push(currentlyReversedCards[0], currentlyReversedCards[1])
                currentlyReversedCards.length = 0;
                if (checkIfGameEnded()) {
                    mainDisplayDiv.replaceChildren();
                    const winningMessageP = document.createElement('p');
                    winningMessageP.classList.add('winning-message-p');
                    winningMessageP.textContent("YOU WON!")
                    mainDisplayDiv.append(winningMessageP);
                }
            } else {
                console.log("j'attends 2000ms")
                setTimeout(resetReversedCards, 1000, cardImg, cardHiddenImg);
            }
        }
    }
}

const checkValidPairs = function (currentlyReversedCards) {
    return currentlyReversedCards.length === 2 && currentlyReversedCards[0].card.value === currentlyReversedCards[1].card.value;
}

const resetReversedCards = function (cardImg, cardHiddenImg) {
    console.log("je retire les cartes mauvaises");
    for (let obj of currentlyReversedCards) {
        obj.cardHiddenImg.classList.toggle("hidden");
        obj.cardImg.classList.toggle("hidden");
    }

    currentlyReversedCards.length = 0;
}


const checkIfGameEnded = function () {
    return correctPairs.length === 10;
}

