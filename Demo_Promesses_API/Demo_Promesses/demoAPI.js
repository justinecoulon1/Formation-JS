// DOM
const INPUT_FN = document.getElementById("firstname");
const BTN_ANALYSE = document.getElementById("analyse");
const P_RESULT = document.getElementById("resultat");

// Variables
const URL = "https://api.agify.io/?country_id=BE";


//
BTN_ANALYSE.addEventListener("click", async () => {
    let prenom = INPUT_FN.value;
    // Si un prénom a bien été rentré, on lancera la requête
    if(prenom.trim() != ""){
        try {
            let response = await fetch(`${URL}&name=${prenom}`);
            //response contient plein d'infos sur la requête
            // console.log(response);
            //je dois donc récupérer la valeur que renvoie ma requête
            let data = await response.json();
            console.log(data);
            // Je peux faire ce que je veux de mes datas
            P_RESULT.innerText = `En Belgique, l'âge le plus probable des ${prenom} est de ${data.age}`;
        }
        catch(error){
            console.log(error);
            
        }
    }
})

async function pokeFetch() {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon/ditto");
    let data = await response.json();
    console.log(data);
}

// pokeFetch();
// https://axios-http.com/docs/intro
async function pokeAxios() {
    let response = await axios.get("https://pokeapi.co/api/v2/pokemon/ditto");
    let data = response.data;
    console.log(data);  
}

pokeAxios();