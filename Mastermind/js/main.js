const result = [];
const exampleBubble = document.querySelectorAll(".colored-bubble");
console.log(exampleBubble)

const initializeGame = function () {
    initializeResult();
}

// récup les bulles vides par id
// quand on clique sur une bulle exemple, on ajoute la bulle en question dans la div de réponse
// quand on arrive à 5 bulles, on clean le div de réponse et on met une nouvelle div avec la tentative de réponse et les drapeaux d'indications à côté 
// 