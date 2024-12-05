function preparer() {
    setTimeout(() => {
        let rand = Math.floor(Math.random() * 3);
        if(rand === 1) {
            console.log("Oh non, les oeufs sont pourris 🤮");
            
        }
        else {
            console.log("Les oeufs sont battus 🥚 !");
            
        }
    }, 3000)
}

function cuire() {
    setTimeout(() => {
        let rand = Math.floor(Math.random() * 3);
        if(rand === 1) {
            console.log("Oh non, l'omelette a brûlé 🔥");
            
        }
        else {
            console.log("L'omelette est cuite, ça sent bon 🍳!");
            
        }
    }, 2000)
}

function servir() {
    setTimeout(() => {
        let rand = Math.floor(Math.random() * 3);
        if(rand === 1) {
            console.log("Oh non, le serveur a glissé 🧼");
            
        }
        else {
            console.log("Voici votre omelette, bon appétit ! 🍽");
            
        }
    }, 1000)
}

preparer();
cuire();
servir();