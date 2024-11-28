const cardAmount = 10;
const mainDisplayDiv = document.querySelector(".main-display-div");
const playButton = document.querySelector("#play-button");

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
    const randomizedCards = cards.sort(function (a, b) { return a - b; });
    console.log(cards)
    return randomizedCards;
}

const displayCards = function (cards) {
    mainDisplayDiv.replaceChildren();
    for (let card of cards) {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add("card");
        const cardImg = document.createElement('img');
        cardImg.src = card.image;
        cardDiv.append(cardImg);
        cardDiv.id = card.value;
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
