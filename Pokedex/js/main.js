const DARK_MODE_HANDLING = {
    darkModeBtn: document.querySelector('#dark-mode-btn'),
    logoImg: document.querySelector('.logo-img'),
    darkModeImg: document.querySelector('.dark-mode-img'),

    toggleDarkModeImg: function () {
        this.logoImg.src = "images/pokeball_dark.png"
        this.darkModeImg.src = "images/light_mode.png"
    },
    toggleLightModeImg: function () {
        this.logoImg.src = "images/pokeball_light.png"
        this.darkModeImg.src = "images/dark_mode.png"
    },
    darkModeButtonHandler: function () {
        return function () {
            document.documentElement.classList.toggle('dark');
            if (document.documentElement.classList.contains('dark')) {
                DARK_MODE_HANDLING.toggleDarkModeImg();
            } else {
                DARK_MODE_HANDLING.toggleLightModeImg();
            }
        }
    }
}
DARK_MODE_HANDLING.darkModeBtn.addEventListener('click', DARK_MODE_HANDLING.darkModeButtonHandler());

const DOM = {
    pokemonList: document.querySelector(".pokemon-list"),
    pokemonDisplay: document.querySelector(".pokemon-display"),
    pokemonFrontSpriteDiv: document.querySelector(".pokemon-front-sprite-div"),
    pokemonBackSpriteDiv: document.querySelector(".pokemon-back-sprite-div"),
    pokemonDisplayNameDiv: document.querySelector(".pokemon-display-name-div"),
    pokemonDisplayTypesDiv: document.querySelector(".pokemon-display-types-div"),
    pokemonFirstTypeImg: document.querySelector("#pokemon-type1-icon"),
    pokemonSecondTypeImg: document.querySelector("#pokemon-type2-icon"),
    pokemonDisplayInfoDiv: document.querySelector(".pokemon-display-information"),
    pokemonStatsDiv: document.querySelector(".pokemon-stats-div"),
    pokemonInfoDiv: document.querySelector(".pokemon-info-div"),
    pokemonShinyButton: "",
    pokemonFrontSpriteImg: document.querySelector("#pokemon-front-sprite"),
    pokemonBackSpriteImg: document.querySelector("#pokemon-back-sprite")
}

const POKEAPI_VARIABLES = {
    pokemonListUrl: "https://pokeapi.co/api/v2/pokemon?offset=375&limit=20",
    femalePokemonListUrl: "https://pokeapi.co/api/v2/gender/1",
    malePokemonListUrl: "https://pokeapi.co/api/v2/gender/2",
    genderlessPokemonListUrl: "https://pokeapi.co/api/v2/gender/3",
}

const API_CALLS = {
    getPokemonList: async function () {
        try {
            let response = await fetch(POKEAPI_VARIABLES.pokemonListUrl);
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
    getPokemonInfo: async function (pokemonUrl) {
        try {
            let response = await fetch(pokemonUrl);
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
            return [];
        }
    },
    getPokemonGenderDetails: async function(pokemonGenderUrl) {
        try {
            let response = await fetch(pokemonGenderUrl);
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
            return [];
        }
    },
}

const EXTRACT_DATA = {
    pokemons: [],
    getPokemons: async function () {
        const pokemonData = await API_CALLS.getPokemonList();
        EXTRACT_DATA.pokemons = pokemonData.results;
        return EXTRACT_DATA.pokemons;
    },
    getPokemonUrl: function (currentPokemonName) {
        return EXTRACT_DATA.pokemons.find(pokemon => pokemon.name === currentPokemonName).url;
    },
    getPokemonInfos: function (currentPokemonUrl) {
        return API_CALLS.getPokemonInfo(currentPokemonUrl);
    },
    getPokemonSprites: async function (pokemonInfo) {
        return pokemonInfo.sprites;
    },
    getPokemonTypes: async function (pokemonInfo) {
        const pokemonTypes = pokemonInfo.types;
        const pokemonTypeNames = [];
        pokemonTypes.forEach(type => { pokemonTypeNames.push(type.type.name.toUpperCase()) });
        return pokemonTypeNames;
        // const pokemonTypeNames = pokemonTypes.map(type => type.type.name.toUpperCase());
        // return pokemonTypeNames;
    },
    getPokemonStats: async function (pokemonInfo) {
        const pokemonStats = pokemonInfo.stats;
        const baseStats = [];
        pokemonStats.forEach(stat => { baseStats.push({ name: stat.stat.name, base: stat.base_stat }) });
        return baseStats;
    },
    getPokemonGenderDetails: async function(){
        const pokemonFemaleGenderDetails = await API_CALLS.getPokemonGenderDetails(POKEAPI_VARIABLES.femalePokemonListUrl);
        const pokemonMaleGenderDetails = await API_CALLS.getPokemonGenderDetails(POKEAPI_VARIABLES.malePokemonListUrl);
        const pokemonGenderlessGenderDetails = await API_CALLS.getPokemonGenderDetails(POKEAPI_VARIABLES.genderlessPokemonListUrl);

        GLOBAL_CACHED_VARIABLES.femaleGenderDetailsByPokemonName = await EXTRACT_DATA.getPokemonGenderDetailsByName(pokemonFemaleGenderDetails.pokemon_species_details);
        GLOBAL_CACHED_VARIABLES.maleGenderDetailsByPokemonName = await EXTRACT_DATA.getPokemonGenderDetailsByName(pokemonMaleGenderDetails.pokemon_species_details);
        GLOBAL_CACHED_VARIABLES.genderlessGenderDetailsByPokemonName = await EXTRACT_DATA.getPokemonGenderDetailsByName(pokemonGenderlessGenderDetails.pokemon_species_details);
    },
    getPokemonGenderDetailsByName: async function(pokemonGenderDetails) {
        const pokemonGenderDetailsByName = {};
        for (let pokemonGenderDetail of pokemonGenderDetails) {
            pokemonGenderDetailsByName[pokemonGenderDetail.pokemon_species.name] = pokemonGenderDetail
        }
        return pokemonGenderDetailsByName;
    },
    getPokemonGenderInfos: async function(currentPokemonName) {
        const pokemonGenderInfos = {};
        

    }
}

const RENDERERS = {
    initDisplay: async function () {
        const pokemons = await EXTRACT_DATA.getPokemons();
        COMPONENT_GENERATOR.createPokemonNamesDivs(pokemons);
    },
    resetDisplay: function () {
        DOM.pokemonDisplayNameDiv.replaceChildren();
        DOM.pokemonFrontSpriteDiv.replaceChildren();
        DOM.pokemonBackSpriteDiv.replaceChildren();
        DOM.pokemonDisplayTypesDiv.replaceChildren();
        DOM.pokemonStatsDiv.replaceChildren();
        DOM.pokemonInfoDiv.replaceChildren();
    },
    toggleCurrentlySelectedPokemonClass: function (e) {
        if (CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDiv) {
            CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDiv.classList.toggle('currently-selected-name-div');
        }
        e.currentTarget.classList.toggle('currently-selected-name-div');
        CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDiv = e.currentTarget;
    },
    displayCurrentlySelectedPokemonName: function (currentPokemonName) {
        const pokemonShinyBtn = document.createElement('btn');
        const pokemonShinyImg = document.createElement('img');
        DOM.pokemonShinyButton = pokemonShinyBtn;
        pokemonShinyBtn.classList.add('btn');
        pokemonShinyBtn.classList.add('shiny-btn');
        pokemonShinyImg.src = "images/shiny_icon.png";
        pokemonShinyBtn.append(pokemonShinyImg);
        pokemonShinyBtn.addEventListener('click', HANDLERS.pokemonShinyBtnClickListener);
        DOM.pokemonDisplayNameDiv.append(pokemonShinyBtn);
        DOM.pokemonDisplayNameDiv.append(currentPokemonName.toUpperCase());
    },
    displayCurrentlySelectedPokemonSprites: function (pokemonSprites) {
        DOM.pokemonFrontSpriteImg = document.createElement('img');
        DOM.pokemonBackSpriteImg = document.createElement('img');
        DOM.pokemonFrontSpriteImg.classList.add('pokemon-sprite');
        DOM.pokemonBackSpriteImg.classList.add('pokemon-sprite');
        DOM.pokemonFrontSpriteImg.id = "pokemon-front-sprite";
        DOM.pokemonBackSpriteImg.id = "pokemon-back-sprite";
        DOM.pokemonFrontSpriteDiv.append(DOM.pokemonFrontSpriteImg);
        DOM.pokemonBackSpriteDiv.append(DOM.pokemonBackSpriteImg);
        DOM.pokemonFrontSpriteImg.src = pokemonSprites.front_default;
        DOM.pokemonBackSpriteImg.src = pokemonSprites.back_default;
    },
    displayCurrentlySelectedPokemonShinySprites: function (pokemonSprites) {
        if (DOM.pokemonFrontSpriteImg.classList.contains("shiny")) {
            DOM.pokemonFrontSpriteImg.src = pokemonSprites.front_default;
            DOM.pokemonBackSpriteImg.src = pokemonSprites.back_default;
        } else {
            DOM.pokemonFrontSpriteImg.src = pokemonSprites.front_shiny;
            DOM.pokemonBackSpriteImg.src = pokemonSprites.back_shiny;
        }
        DOM.pokemonFrontSpriteImg.classList.toggle("shiny");
        DOM.pokemonBackSpriteImg.classList.toggle("shiny");
        DOM.pokemonShinyButton.classList.toggle("shiny-mode-selected");
    },
    displayCurrentlySelectedPokemonTypes: function (pokemonTypes) {
        COMPONENT_GENERATOR.createPokemonTypesDiv(pokemonTypes);
    },
    displayCurrentlySelectedPokemonStats: function (pokemonStats) {
        COMPONENT_GENERATOR.createStatsDiv(pokemonStats);
    },
    displayCurrentlySelectedPokemonInfos: function() {
        //gender
        //weight
        //height
        //rate
    }
}

const COMPONENT_GENERATOR = {
    createPokemonNamesDivs: function (pokemons) {
        for (const pokemon of pokemons) {
            COMPONENT_GENERATOR.createPokemonNameDiv(pokemon.name);
        }
    },
    createPokemonNameDiv: function (pokemonName) {
        const div = document.createElement('div');
        div.classList.add('pokemon-name-div');
        const p = document.createElement('p');
        p.classList.add('pokemon-name-p');
        p.textContent = pokemonName.toUpperCase();
        div.append(p);
        DOM.pokemonList.append(div);
        div.addEventListener('click', HANDLERS.pokemonNameDivClickListener);
    },
    createPokemonTypesDiv: function(pokemonTypes) {
        for(let i = 0; i < pokemonTypes.length; i++) {
            COMPONENT_GENERATOR.createPokemonTypeDiv(pokemonTypes[i], i);
        }
    },
    createPokemonTypeDiv:function(type, pokemonTypeIndex) {
        const pokemonTypeDiv = document.createElement('div');
        pokemonTypeDiv.classList.add("pokemon-display-type");

        const pokemonTypeImg = document.createElement('img');
        pokemonTypeImg.classList.add("pokemon-type-icon");
        pokemonTypeImg.id = `pokemon-type${pokemonTypeIndex}-icon`;
        pokemonTypeImg.src = `images/pokemon-types/type-${type}.png`;
        pokemonTypeDiv.append(pokemonTypeImg);

        const pokemonTypeP = document.createElement('p');
        pokemonTypeP.classList.add("pokemon-type-name");
        pokemonTypeP.id = `pokemon-type${pokemonTypeIndex}-name`;
        pokemonTypeP.textContent = type;
        pokemonTypeDiv.append(pokemonTypeP);

        DOM.pokemonDisplayTypesDiv.append(pokemonTypeDiv);
    },    
    createStatsDiv: function (pokemonStats) {
        const statsitle = document.createElement('h2');
        statsitle.classList.add("stats-title");
        statsitle.textContent = "Statistics : ";
        DOM.pokemonStatsDiv.append(statsitle);
        pokemonStats.forEach(stat => { COMPONENT_GENERATOR.createStatDiv(stat) });
    },
    createStatDiv: function(stat) {
        const statDiv = document.createElement('div');
        statDiv.classList.add("stat-div");
        const statNameP = document.createElement('p');
        statNameP.classList.add("stat-name");
        statNameP.textContent = stat.name.toUpperCase();
        const statAmountP = document.createElement('p');
        statAmountP.classList.add("stat-amount");
        statAmountP.textContent = " = " + stat.base;
        statDiv.append(statNameP);
        statDiv.append(statAmountP);
        DOM.pokemonStatsDiv.append(statDiv);
    },
    createInfoDiv: function() {
//************************************ */
    },
    createGenderDiv: function(pokemonGenders) {
        const gendersDiv = document.createElement('div');
        for(let gender of pokemonGenders) {
            const genderImg = document.createElement('img');
            genderImg.classList.add('gender-img');
            gendersDiv.genderImg.src = GENDER_VARIABLES;
        }
    }
}

const CURRENTLY_DISPLAYED_POKEMON_VARIABLES = {
    nameDiv: "",
    pokemonInfos: "",
}

const GLOBAL_CACHED_VARIABLES = {
    femaleGenderDetailsByPokemonName: {},
    maleGenderDetailsByPokemonName: {},
    genderlessGenderDetailsByPokemonName: {},
}

const GENDER_VARIABLES = {
    female: {
        image: "images/gender/female.png"
    },
    male: {
        image: "images/gender/male.png"
    },
    genderless: {
        image: "images/gender/genderless.png"
    }
}

const HANDLERS = {
    pokemonNameDivClickListener: async function (e) {
        if (e.currentTarget !== CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDiv) {
            RENDERERS.resetDisplay();
            RENDERERS.toggleCurrentlySelectedPokemonClass(e);

            const currentPokemonName = e.currentTarget.textContent.toLowerCase();
            const currentPokemonUrl = EXTRACT_DATA.getPokemonUrl(currentPokemonName);
            const currentPokemonInfos = await EXTRACT_DATA.getPokemonInfos(currentPokemonUrl);
            CURRENTLY_DISPLAYED_POKEMON_VARIABLES.pokemonInfos = currentPokemonInfos;
            const pokemonSprites = await EXTRACT_DATA.getPokemonSprites(currentPokemonInfos);
            const pokemonTypes = await EXTRACT_DATA.getPokemonTypes(currentPokemonInfos);
            const pokemonStats = await EXTRACT_DATA.getPokemonStats(currentPokemonInfos);
            const pokemonGenderInfo = await EXTRACT_DATA.getPokemonGenderInfos(currentPokemonName)

            RENDERERS.displayCurrentlySelectedPokemonName(currentPokemonName);
            RENDERERS.displayCurrentlySelectedPokemonSprites(pokemonSprites);
            RENDERERS.displayCurrentlySelectedPokemonTypes(pokemonTypes);
            RENDERERS.displayCurrentlySelectedPokemonStats(pokemonStats);
            // RENDERERS.displayCurrentlySelectedPokemonInfos(currentPokemonInfos);

            console.log(GLOBAL_CACHED_VARIABLES.femaleGenderDetailsByPokemonName)
        }

    },
    pokemonShinyBtnClickListener: async function () {
        const pokemonSprites = await EXTRACT_DATA.getPokemonSprites(CURRENTLY_DISPLAYED_POKEMON_VARIABLES.pokemonInfos);
        RENDERERS.displayCurrentlySelectedPokemonShinySprites(pokemonSprites);
    }

}

RENDERERS.initDisplay();
EXTRACT_DATA.getPokemonGenderDetails();



// const fonctionA = () => {
//     fonctionB()
// }

// const fonctionB = () => {
//     fonctionC()
// }

// const fonctionC = () => {
//     API_CALLS.getPokemonList().then(pokemonList => {

//     }).catch(err => {

//     })
// }
// exemple nullish coalescing // null safe operator
// ==> pokemon.type2?.name ?? 'pas de second type'

/* 
- carte à côté des caract avec taille et poids 
- afficher force et faiblesse type au survol
- afficher sprite en fonction de la génération
- afficher si F / M ou genderless ou pas 
- mieux gérer les promises: stocker les promises et await then dans l'affichage directement pour afficher
une image "d'attente"
*/ 