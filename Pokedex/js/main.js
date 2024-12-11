const DARK_MODE_HANDLING = {
    darkModeBtn: document.querySelector('#dark-mode-btn'),
    logoImg: document.querySelector('.logo-img'),
    darkModeImg: document.querySelector('.dark-mode-img'),
    upArrowImg: document.querySelector('#up-arrow-img'),
    downArrowImg: document.querySelector('#down-arrow-img'),

    toggleDarkModeImg: function () {
        this.logoImg.src = "images/pokeball_dark.png";
        this.darkModeImg.src = "images/light_mode.png";
        this.upArrowImg.src = "images/up-arrow-dark.png";
        this.downArrowImg.src = "images/down-arrow-dark.png";
    },
    toggleLightModeImg: function () {
        this.logoImg.src = "images/pokeball_light.png";
        this.darkModeImg.src = "images/dark_mode.png";
        this.upArrowImg.src = "images/up-arrow.png";
        this.downArrowImg.src = "images/down-arrow.png";
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
    pokemonInfoGlobalDiv: document.querySelector(".pokemon-info-div"),
    pokemonInfoContainer: "",
    pokemonShinyButton: "",
    pokemonFrontSpriteImg: document.querySelector("#pokemon-front-sprite"),
    pokemonBackSpriteImg: document.querySelector("#pokemon-back-sprite"),
    upArrowBtn: document.querySelector('#up-arrow-btn'),
    downArrowBtn: document.querySelector('#down-arrow-btn'),
}

const CURRENTLY_DISPLAYED_POKEMON_VARIABLES = {
    nameDiv: "",
    nameDivs: [],
    pokemonInfos: "",
    currentPageOffset: 0,
}

const POKEAPI_VARIABLES = {
    pokemonListUrl: `https://pokeapi.co/api/v2/pokemon?offset=${CURRENTLY_DISPLAYED_POKEMON_VARIABLES.currentPageOffset}&limit=20`,
    femalePokemonListUrl: "https://pokeapi.co/api/v2/gender/1",
    malePokemonListUrl: "https://pokeapi.co/api/v2/gender/2",
    genderlessPokemonListUrl: "https://pokeapi.co/api/v2/gender/3",
    
    updatePokeApiUrl: function () {
        POKEAPI_VARIABLES.pokemonListUrl =  `https://pokeapi.co/api/v2/pokemon?offset=${CURRENTLY_DISPLAYED_POKEMON_VARIABLES.currentPageOffset}&limit=20`
    }
}

const API_CALLS = {
    fetchJson: async function(url) {
        try {
            let response = await fetch(url);
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
    getPokemonList: function () {
       return API_CALLS.fetchJson(POKEAPI_VARIABLES.pokemonListUrl);
    },
    getPokemonInfo: function (pokemonUrl) {
        return API_CALLS.fetchJson(pokemonUrl);
    },
    getPokemonGenderDetails: function (pokemonGenderUrl) {
        return API_CALLS.fetchJson(pokemonGenderUrl);
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
    initPokemonGenderDetails: async function () {
        const pokemonFemaleGenderDetails = await API_CALLS.getPokemonGenderDetails(POKEAPI_VARIABLES.femalePokemonListUrl);
        const pokemonMaleGenderDetails = await API_CALLS.getPokemonGenderDetails(POKEAPI_VARIABLES.malePokemonListUrl);
        const pokemonGenderlessGenderDetails = await API_CALLS.getPokemonGenderDetails(POKEAPI_VARIABLES.genderlessPokemonListUrl);

        EXTRACT_DATA.initPokemonGenderDetailsByName(pokemonFemaleGenderDetails, GENDER_VARIABLES.female);
        EXTRACT_DATA.initPokemonGenderDetailsByName(pokemonMaleGenderDetails, GENDER_VARIABLES.male);
        EXTRACT_DATA.initPokemonGenderDetailsByName(pokemonGenderlessGenderDetails, GENDER_VARIABLES.genderless);
    },
    initPokemonGenderDetailsByName: async function (genderDetails, genderVariable) {
        for (let genderDetail of genderDetails.pokemon_species_details) {
            genderDetail.gender = genderVariable;
            if (GLOBAL_CACHED_VARIABLES.pokemonGenderDetailsByName[genderDetail.pokemon_species.name]) {
                GLOBAL_CACHED_VARIABLES.pokemonGenderDetailsByName[genderDetail.pokemon_species.name].push(genderDetail);
            } else {
                GLOBAL_CACHED_VARIABLES.pokemonGenderDetailsByName[genderDetail.pokemon_species.name] = [genderDetail];
            }
        }
    },
    getPokemonGenderDetails: async function (currentPokemonName) {
        return GLOBAL_CACHED_VARIABLES.pokemonGenderDetailsByName[currentPokemonName];
    },
    getPokemonSpeciesName: async function (currentPokemonInfos) {
        return currentPokemonInfos.species.name;
    },
    getPokemonHeight: function() {
        const pokemonHeight = CURRENTLY_DISPLAYED_POKEMON_VARIABLES.pokemonInfos.height * 0.1;
        return pokemonHeight.toFixed(1);
    },
    getPokemonWeight: function() {
        const pokemonWeight = CURRENTLY_DISPLAYED_POKEMON_VARIABLES.pokemonInfos.weight * 0.1;
        return pokemonWeight.toFixed(1);
    },
    getGenderRate: async function(currentPokemonGenderDetails) {
        if (currentPokemonGenderDetails.length === 2) {
            for (let gender of currentPokemonGenderDetails) {
                if (gender.gender.name === 'female') {
                    return gender.rate
                }
            }
        } else {
            return -1;
        }
    },
    computeGenderRate: async function(genderRate) {
        return [{"gender": GENDER_VARIABLES.female, "rate": 100 * (genderRate/8)}, {"gender":GENDER_VARIABLES.male, "rate":100 * ((8-genderRate)/8)}]
    }
}

const RENDERERS = {
    initDisplay: async function () {
        RENDERERS.resetDisplay()
        const pokemons = await EXTRACT_DATA.getPokemons();
        COMPONENT_GENERATOR.createPokemonNamesDivs(pokemons);
        RENDERERS.displayPokemon(EXTRACT_DATA.pokemons[0].name, CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDivs[0]);
    },
    resetDisplay: function () {
        DOM.pokemonDisplayNameDiv.replaceChildren();
        DOM.pokemonFrontSpriteDiv.replaceChildren();
        DOM.pokemonBackSpriteDiv.replaceChildren();
        DOM.pokemonDisplayTypesDiv.replaceChildren();
        DOM.pokemonStatsDiv.replaceChildren();
        DOM.pokemonInfoGlobalDiv.replaceChildren();
    },
    emptyPokemonList: function() {
        DOM.pokemonList.replaceChildren();
    },
    toggleCurrentlySelectedPokemonClass: function (currentlySelectedNameDiv) {
        if (CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDiv) {
            CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDiv.classList.toggle('currently-selected-name-div');
        }
        currentlySelectedNameDiv.classList.toggle('currently-selected-name-div');
        CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDiv = currentlySelectedNameDiv;
    },
    displayPokemon: async function(currentPokemonName, currentlySelectedNameDiv) {
        RENDERERS.toggleCurrentlySelectedPokemonClass(currentlySelectedNameDiv);

        const currentPokemonUrl = EXTRACT_DATA.getPokemonUrl(currentPokemonName);
        const currentPokemonInfos = await EXTRACT_DATA.getPokemonInfos(currentPokemonUrl);
        const currentPokemonSpeciesName = await EXTRACT_DATA.getPokemonSpeciesName(currentPokemonInfos);
        CURRENTLY_DISPLAYED_POKEMON_VARIABLES.pokemonInfos = currentPokemonInfos;
        const currentPokemonSprites = await EXTRACT_DATA.getPokemonSprites(currentPokemonInfos);
        const pokemonTypes = await EXTRACT_DATA.getPokemonTypes(currentPokemonInfos);
        const currentPokemonStats = await EXTRACT_DATA.getPokemonStats(currentPokemonInfos);
        const currentPokemonGenderDetails = await EXTRACT_DATA.getPokemonGenderDetails(currentPokemonSpeciesName);

        RENDERERS.displayCurrentlySelectedPokemonName(currentPokemonName);
        RENDERERS.displayCurrentlySelectedPokemonSprites(currentPokemonSprites);
        RENDERERS.displayCurrentlySelectedPokemonTypes(pokemonTypes);
        RENDERERS.displayCurrentlySelectedPokemonStats(currentPokemonStats);
        RENDERERS.displayCurrentlySelectedPokemonInfos(currentPokemonGenderDetails);
    },
    displayCurrentlySelectedPokemonName: function (currentPokemonName) {
        const pokemonShinyBtn = document.createElement('btn');
        pokemonShinyBtn.classList.add('btn');
        pokemonShinyBtn.classList.add('shiny-btn');
        pokemonShinyBtn.addEventListener('click', HANDLERS.pokemonShinyBtnClickListener);
        
        const pokemonShinyImg = document.createElement('img');
        pokemonShinyImg.src = "images/shiny_icon.png";
        pokemonShinyBtn.append(pokemonShinyImg);
        
        DOM.pokemonShinyButton = pokemonShinyBtn;
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
    displayCurrentlySelectedPokemonInfos: function (currentPokemonGenderDetails) {
        COMPONENT_GENERATOR.createInfoDiv(currentPokemonGenderDetails);
    },

}

const COMPONENT_GENERATOR = {
    createPokemonNamesDivs: function (pokemons) {
        CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDivs = [];
        for (const pokemon of pokemons) {
            COMPONENT_GENERATOR.createPokemonNameDiv(pokemon.name);
        }
    },
    createPokemonNameDiv: function (pokemonName) {
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('pokemon-name-div');
        nameDiv.addEventListener('click', HANDLERS.pokemonNameDivClickListener);

        const name = document.createElement('p');
        name.classList.add('pokemon-name-p');
        name.textContent = pokemonName.toUpperCase();

        nameDiv.append(name);
        DOM.pokemonList.append(nameDiv);
        
        CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDivs.push(nameDiv);
    },
    createPokemonTypesDiv: function (pokemonTypes) {
        for (let i = 0; i < pokemonTypes.length; i++) {
            COMPONENT_GENERATOR.createPokemonTypeDiv(pokemonTypes[i], i);
        }
    },
    createPokemonTypeDiv: function (type, pokemonTypeIndex) {
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
        const statsTitle = document.createElement('h2');
        statsTitle.classList.add("stats-title");
        statsTitle.textContent = "Statistics:";
        DOM.pokemonStatsDiv.append(statsTitle);
        pokemonStats.forEach(stat => { COMPONENT_GENERATOR.createStatDiv(stat) });
    },
    createStatDiv: function (stat) {
        const statDiv = document.createElement('div');
        statDiv.classList.add("stat-div");

        const statNameP = document.createElement('p');
        statNameP.classList.add("stat-name");
        statNameP.textContent = stat.name.toUpperCase();

        const statAmountP = document.createElement('p');
        statAmountP.classList.add("stat-amount");
        statAmountP.textContent = " => " + stat.base;
        
        statDiv.append(statNameP);
        statDiv.append(statAmountP);
        DOM.pokemonStatsDiv.append(statDiv);
    },
    createInfoDiv: function (currentPokemonGenderDetails) {
        const generalInfoTitle = document.createElement('h2');
        generalInfoTitle.classList.add("general-info-title");
        generalInfoTitle.textContent = "General informations:";
        DOM.pokemonInfoGlobalDiv.prepend(generalInfoTitle);


        const pokemonInfoContainer = document.createElement('div');
        pokemonInfoContainer.classList.add('pokemon-information-container');
        DOM.pokemonInfoGlobalDiv.append(pokemonInfoContainer); 
        DOM.pokemonInfoContainer = pokemonInfoContainer
        
        COMPONENT_GENERATOR.createGenderDiv(currentPokemonGenderDetails);
        COMPONENT_GENERATOR.createMeasurementsDiv(CURRENTLY_DISPLAYED_POKEMON_VARIABLES.pokemonInfos);
        COMPONENT_GENERATOR.createGenderRateDiv(currentPokemonGenderDetails);
    },
    createGenderDiv: async function (currentPokemonGenderDetails) {
        const gendersGlobalDiv = document.createElement('div');
        gendersGlobalDiv.classList.add("genders-global-div");

        const genderDiv = document.createElement('div');
        genderDiv.classList.add('gender-div');

        const gendersTitle = document.createElement('p');
        gendersTitle.classList.add("genders-title");
        gendersTitle.textContent = "GENDERS:";
        gendersGlobalDiv.append(gendersTitle);

        for (let gender of currentPokemonGenderDetails) {
            const genderImg = document.createElement('img');
            genderImg.classList.add('gender-img');
            genderImg.src = gender.gender.image;
            genderImg.title = gender.gender.label;
            genderDiv.append(genderImg);
        }

        gendersGlobalDiv.append(genderDiv);
        DOM.pokemonInfoContainer.append(gendersGlobalDiv);
    },
    createMeasurementsDiv: function () {
        const measurementsDiv = document.createElement('div');
        const heightDiv = document.createElement('div');
        const weightDiv = document.createElement('div');
        measurementsDiv.classList.add('measurements-div');
        heightDiv.classList.add('height-div');
        weightDiv.classList.add('weight-div');

        const heightTitle = document.createElement('p');
        const weightTitle = document.createElement('p');
        heightTitle.classList.add("height-title");
        weightTitle.classList.add("weight-title");
        heightTitle.textContent = "HEIGHT:";
        weightTitle.textContent = "WEIGHT:";

        const heightValue = document.createElement('p');
        const weightValue = document.createElement('p');
        heightValue.classList.add("height-value");
        weightValue.classList.add("weight-value");
        heightValue.textContent = EXTRACT_DATA.getPokemonHeight() + " m";
        weightValue.textContent = EXTRACT_DATA.getPokemonWeight() + " kg";

        heightDiv.append(heightTitle, heightValue);
        weightDiv.append(weightTitle, weightValue);
        measurementsDiv.append(heightDiv, weightDiv);

        DOM.pokemonInfoContainer.append(measurementsDiv);
    },
    createGenderRateDiv: async function(currentPokemonGenderDetails) {
        const genderRateDiv = document.createElement('div');
        genderRateDiv.classList.add('gender-rate-div');
        
        const genderRateTitle = document.createElement('p');
        genderRateTitle.classList.add("gender-rate-title");
        genderRateTitle.textContent = "GENDER RATE:";
        genderRateDiv.append(genderRateTitle);

        const genderRates = await EXTRACT_DATA.getGenderRate(currentPokemonGenderDetails);
        if (genderRates !== -1) {
            const computedGenderRates = await EXTRACT_DATA.computeGenderRate(genderRates);
            
            for (let rate of computedGenderRates) {
                const genderRateValue = document.createElement('p');
                genderRateValue.classList.add("gender-rate-value");
                genderRateValue.textContent = rate.gender.label + ": " + rate.rate + "%";
                genderRateDiv.append(genderRateValue);
            }
        } else {
            const genderlessGenderRateValue = document.createElement('p');
            genderlessGenderRateValue.classList.add("gender-rate-value");
            genderlessGenderRateValue.textContent = "Genderless: 100%";
            genderRateDiv.append(genderlessGenderRateValue);
        }

        DOM.pokemonInfoContainer.append(genderRateDiv);
    }
}

const GLOBAL_CACHED_VARIABLES = {
    pokemonGenderDetailsByName: {},
}

const GENDER_VARIABLES = {
    female: {
        name: "female",
        label: "Female",
        image: "images/gender/female.png"
    },
    male: {
        name: "male",
        label: "Male",
        image: "images/gender/male.png"
    },
    genderless: {
        name: "genderless",
        label: "Genderless",
        image: "images/gender/genderless.png"
    }
}

const HANDLERS = {
    pokemonNameDivClickListener: async function (e) {
        if (e.currentTarget !== CURRENTLY_DISPLAYED_POKEMON_VARIABLES.nameDiv) {
            RENDERERS.resetDisplay();
            const currentlySelectedNameDiv = e.currentTarget;

            const currentPokemonName = e.currentTarget.textContent.toLowerCase();
            RENDERERS.displayPokemon(currentPokemonName, currentlySelectedNameDiv);
        }
    },
    pokemonShinyBtnClickListener: async function () {
        const pokemonSprites = await EXTRACT_DATA.getPokemonSprites(CURRENTLY_DISPLAYED_POKEMON_VARIABLES.pokemonInfos);
        RENDERERS.displayCurrentlySelectedPokemonShinySprites(pokemonSprites);
    },
    arrowBtnEventListener: async function(e) {
        console.log(CURRENTLY_DISPLAYED_POKEMON_VARIABLES.currentPageOffset);
        
        if (e.currentTarget.id === "up-arrow-btn" && CURRENTLY_DISPLAYED_POKEMON_VARIABLES.currentPageOffset > 0) {
            console.log(CURRENTLY_DISPLAYED_POKEMON_VARIABLES.currentPageOffset + " up arrow");
            CURRENTLY_DISPLAYED_POKEMON_VARIABLES.currentPageOffset -= 20;
            RENDERERS.emptyPokemonList();
            POKEAPI_VARIABLES.updatePokeApiUrl();
            RENDERERS.initDisplay();
        } 
        if (e.currentTarget.id === "down-arrow-btn") {
            CURRENTLY_DISPLAYED_POKEMON_VARIABLES.currentPageOffset += 20;
            RENDERERS.emptyPokemonList();
            POKEAPI_VARIABLES.updatePokeApiUrl();
            RENDERERS.initDisplay();
        }
    }
};

(async () => {
    await EXTRACT_DATA.initPokemonGenderDetails();
    DOM.downArrowBtn.addEventListener('click', HANDLERS.arrowBtnEventListener);
    DOM.upArrowBtn.addEventListener('click', HANDLERS.arrowBtnEventListener);
    RENDERERS.initDisplay();
})();



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
- afficher force et faiblesse type au survol
- afficher sprite en fonction de la génération : check si front default back default de chaque génération est != null
- mieux gérer les promises: stocker les promises et await then dans l'affichage directement pour afficher
une image "d'attente"
*/ 

//function.bind 