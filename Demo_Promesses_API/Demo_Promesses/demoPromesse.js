function division(nb1, nb2) {
    return new Promise((resolve, reject) =>{
        // Si le nombre 2 vaut 0, on va rejeter la promesse : on ne peut la tenir
        if(nb2 === 0) {
            // reject prend en paramètre la raison du rejet de la promesse
            // Il peut être de n'importe quel type, souvent ce sera un obj Error
            reject(new Error("Division par 0 impossible"))
        }
        else {
            //Sinon, on peut tenir la promesse, donc on la résout
            //Resolve, prend en paramètre la valeur a renvoyer (n'importe quel type)
            resolve(nb1/nb2);
        }
    })
}

division(12,0)
    //then => sera déclenché si la promesse est tenue
    .then((res) => {
        //res contient la résolution de la promesse, donc dans notre cas, le résultat de la division
        console.log(`La division vaut ${res}`);
    })
    //catch => sera déclenché si la promesse n'a pu être tenue
    .catch((error) => {
        //error contient la raisin de pourquoi la promesse n'a pu être tenue
        console.error(error.message);
    })
    //finally => sera déclenché quoiqu'il arrive, qu'elle soit tenue ou non
    .finally(() => {
        console.log("Division faite, merci au revoir"); 
    });


// ___________________________
// Les promesses appliquées à notre omelette :
function preparer() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let rand = Math.floor(Math.random() * 3);
            if(rand === 1) {
                reject(new Error("Oh non, les oeufs sont pourris 🤮"))               
            }
            else {
                resolve("Les oeufs sont battus 🥚 !")                
            }
        }, 3000)
    })
}

function cuire() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let rand = Math.floor(Math.random() * 3);
            if(rand === 1) {
                reject(new Error("Oh non, l'omelette a brûlé 🔥"));
                
            }
            else {
                resolve("L'omelette est cuite, ça sent bon 🍳!");
            }
        }, 2000)
    })
    
}

function servir() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            let rand = Math.floor(Math.random() * 3);
            if(rand === 1) {
                reject(new Error("Oh non, le serveur a glissé 🧼"));
                
            }
            else {
                resolve("Voici votre omelette, bon appétit ! 🍽");
            }
        }, 1000)
    })
}

// Version avec les then, catch, finally
// preparer()
//     .then((res) => {
//         console.log(res);
//         cuire()
//             .then((res2) => {
//                 console.log(res2);
//                 servir()
//                     .then((res3) => {
//                         console.log(res3);
                        
//                     })
//                     .catch((error) => {
//                         console.log(error.message);
                        
//                     })            
//             })
//             .catch((error) => {
//                 console.log(error.message);
//             })
//     })
//     .catch((error) => {
//         console.log(error.message);     
//     })

// Une façon plus simple de gérer les promesses : async await
async function omelette() {
    try {
        //On lance la promesse :
        //si tenue, j'ai le resultat dans res1
        //si non tenue, on va directement au bloc catch
        let res1 = await preparer();
        console.log(res1);
        let res2 = await cuire();
        console.log(res2);
        let res3 = await servir();
        console.log(res3);
    }
    catch(error){
        console.log(error.message);
        
    }
    //finally
}

omelette();