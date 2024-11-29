let currentId = 1;
const cardAmount = 10;
const mainDisplayDiv = document.querySelector(".main-display-div");
const playButton = document.querySelector("#play-button");
const cardsDiv = [];

const createCards = function () {
    const cards = [];
    for (let i = 0; i < cardAmount / 2; i++) {
        for (let j = 0; j < 2; j++) {
            const card = {
                id: currentId++,
                image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${i + 1}.svg`,
                value: i
            }
            cards.push(card);
        }
    }
    return cards;
}

const randomizeCards = function (cards) {
    const randomValueByCardId = {}
    for (let i = 0; i < cards.length; i++) {
        const card = cards[i]
        randomValueByCardId[card.id] = Math.random()
    }
    const randomizedCards = cards.sort(function (a, b) { return randomValueByCardId[a.id] - randomValueByCardId[b.id] });
    return randomizedCards;
}

const displayCards = function (cards) {
    mainDisplayDiv.replaceChildren();
    for (let card of cards) {

        const cardDiv = document.createElement('div');
        cardDiv.classList.add("card");
        cardDiv.id = card.value;
        cardsDiv.push(cardDiv);

        const cardImg = document.createElement('img');
        cardImg.src = card.image;
        cardImg.classList.add = "hidden";

        const cardBasicImg = document.createElement('img');
        cardBasicImg.src = "/images/mystery.png";

        const cardDivEventListener = () => { onCardClick(card) }
        cardDiv.addEventListener('click', cardDivEventListener)
        cardDiv.append(cardImg);
        // cardDiv.append(cardBasicImg);
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

const onCardClick = function (card) {
    reverseCard(card);
}

const reverseCard = function (card) {
    console.log(`click on card : ${JSON.stringify(card)}`)
}
