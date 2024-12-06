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
    pokemonFirstTypeDiv: document.querySelector("#pokemon-type1-name"),
    pokemonSecondTypeDiv: document.querySelector("#pokemon-type2-name"),
    pokemonFirstTypeImg: document.querySelector("#pokemon-type1-icon"),
    pokemonSecondTypeImg: document.querySelector("#pokemon-type2-icon"),
    pokemonInfoDiv: document.querySelector(".pokemon-display-information")
}

const POKEAPI_VARIABLES = {
    URL: "https://pokeapi.co/api/v2/pokemon/"
}

const API_CALLS = {
    getPokemonList: async function () {
        try {
            let response = await fetch(POKEAPI_VARIABLES.URL);
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
            return [];
        }
    },
    getPokemonInfo: async function (url) {
        try {
            let response = await fetch(url);
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error)
            return [];
        }
    }
}

const EXTRACT_DATA = {
    pokemons: [],
    getPokemons: async function () {
        const pokemonData = await API_CALLS.getPokemonList();
        EXTRACT_DATA.pokemons = [];
        pokemonData.results.forEach(element => {
            EXTRACT_DATA.pokemons.push(element);
        });
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
    },
    getPokemonStats: async function (pokemonInfo) {
        const pokemonStats = pokemonInfo.stats;
        const baseStats = [];
        pokemonStats.forEach(stat => { baseStats.push({ name: stat.stat.name, base: stat.base_stat }) });
        return baseStats;
    }
}

const RENDERERS = {
    initDisplay: async function () {
        const pokemons = await EXTRACT_DATA.getPokemons();
        this.createPokemonNamesDivs(pokemons);
    },
    createPokemonNamesDivs: function (pokemons) {
        for (const pokemon of pokemons) {
            this.createPokemonNameDiv(pokemon.name);
        }
    },
    createPokemonNameDiv: function (pokemonName) {
        const div = document.createElement('div');
        div.classList.add('pokemon-name-div');
        const p = document.createElement('p');
        p.classList.add('pokemon-name-p')
        p.textContent = pokemonName.toUpperCase();
        div.append(p);
        DOM.pokemonList.append(div);
        div.addEventListener('click', HANDLERS.pokemonNameDivClickListener);
    },
    toggleCurrentlySelectedPokemonClass: function (e) {
        if (DISPLAY_VARIABLES.currentlyDisplayedPokemonNameDiv) {
            DISPLAY_VARIABLES.currentlyDisplayedPokemonNameDiv.classList.toggle('currently-selected-name-div');
        }
        e.currentTarget.classList.toggle('currently-selected-name-div');
        DISPLAY_VARIABLES.currentlyDisplayedPokemonNameDiv = e.currentTarget;
    },
    resetDisplay: function () {
        DOM.pokemonDisplayNameDiv.replaceChildren();
        DOM.pokemonFrontSpriteDiv.replaceChildren();
        DOM.pokemonBackSpriteDiv.replaceChildren();
        DOM.pokemonFirstTypeDiv.textContent = "";
        DOM.pokemonSecondTypeDiv.textContent = "";
        DOM.pokemonFirstTypeImg.src = "";
        DOM.pokemonSecondTypeImg.src = "";
        DOM.pokemonInfoDiv.replaceChildren();
    },
    displayCurrentlySelectedPokemonName: function (currentPokemonName) {
        const shinyBtn = document.createElement('btn');
        const shinyImg = document.createElement('img');
        shinyImg.src = "images/shiny_icon.png";
        shinyBtn.append(shinyImg);
        DOM.pokemonDisplayNameDiv.append(shinyBtn)
        DOM.pokemonDisplayNameDiv.append(currentPokemonName.toUpperCase());
    },
    displayCurrentlySelectedPokemonSprites: function (pokemonSprites) {
        const pokemonFrontSprite = document.createElement('img');
        const pokemonBackSprite = document.createElement('img');
        pokemonFrontSprite.classList.add('pokemon-sprite');
        pokemonBackSprite.classList.add('pokemon-sprite');
        pokemonFrontSprite.src = pokemonSprites.front_default;
        pokemonBackSprite.src = pokemonSprites.back_default;
        DOM.pokemonFrontSpriteDiv.append(pokemonFrontSprite);
        DOM.pokemonBackSpriteDiv.append(pokemonBackSprite);
    },
    displayCurrentlySelectedPokemonTypes: function (pokemonTypes) {
        DOM.pokemonFirstTypeDiv.append(pokemonTypes[0]);
        DOM.pokemonFirstTypeImg.src = `images/pokemon-types/type-${pokemonTypes[0]}.png`;
        if (pokemonTypes.length >= 2) {
            DOM.pokemonSecondTypeDiv.append(pokemonTypes[1]);
            DOM.pokemonSecondTypeImg.src = `images/pokemon-types/type-${pokemonTypes[1]}.png`;
        }
    },
    displayCurrentlySelectedPokemonStats: function (pokemonStats) {
        const statsitle = document.createElement('h2');
        statsitle.classList.add("stats-title")
        statsitle.textContent = "Statistics : "
        DOM.pokemonInfoDiv.append(statsitle);
        pokemonStats.forEach(stat => { RENDERERS.createStatsDiv(stat) });
    },
    createStatsDiv: function (stat) {
        const statDiv = document.createElement('div');
        const p = document.createElement('p');
        p.classList.add("stat-text")
        p.textContent = stat.name + " = " + stat.base;
        statDiv.append(p);
        DOM.pokemonInfoDiv.append(statDiv);
    }
}

const DISPLAY_VARIABLES = {
    currentlyDisplayedPokemonNameDiv: "",
}

const HANDLERS = {
    pokemonNameDivClickListener: async function (e) {
        RENDERERS.resetDisplay();
        RENDERERS.toggleCurrentlySelectedPokemonClass(e);

        const currentPokemonName = e.currentTarget.textContent.toLowerCase();
        const currentPokemonUrl = EXTRACT_DATA.getPokemonUrl(currentPokemonName);
        const currentPokemonInfos = await EXTRACT_DATA.getPokemonInfos(currentPokemonUrl);
        const pokemonSprites = await EXTRACT_DATA.getPokemonSprites(currentPokemonInfos);
        const pokemonTypes = await EXTRACT_DATA.getPokemonTypes(currentPokemonInfos);
        const pokemonStats = await EXTRACT_DATA.getPokemonStats(currentPokemonInfos);

        RENDERERS.displayCurrentlySelectedPokemonName(currentPokemonName);
        RENDERERS.displayCurrentlySelectedPokemonSprites(pokemonSprites);
        RENDERERS.displayCurrentlySelectedPokemonTypes(pokemonTypes);
        RENDERERS.displayCurrentlySelectedPokemonStats(pokemonStats);

        //6 stat (hp/attack/defense/At spe/def spe/speed) et weight 
    }
}

RENDERERS.initDisplay();





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