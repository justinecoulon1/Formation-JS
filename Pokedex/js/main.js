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
    pokemonList: document.querySelector(".poke-list")
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
        }
        catch (error) {
            console.log(error);
        }
    }
}

const EXTRACT_DATA = {
    getPokemonNameList: async function () {
        const pokemonNamesData = await API_CALLS.getPokemonList();
        const POKEMON_NAMES = [];
        pokemonNamesData.results.forEach(element => {
            POKEMON_NAMES.push(element.name);
        });
        console.log(POKEMON_NAMES)
        return POKEMON_NAMES;
    }
}

const RENDERERS = {
    initDisplay: async function () {
        let POKEMON_NAMES = await EXTRACT_DATA.getPokemonNameList();
        console.log(POKEMON_NAMES)
        this.createPokemonNameDiv(POKEMON_NAMES);
    },
    createPokemonNameDiv: function (POKEMON_NAMES) {
        for (const name of POKEMON_NAMES) {
            const div = document.createElement('div');
            const p = document.createElement('p');
            p.textContent = name;
            div.append(p)
            DOM.pokemonList.append(div);
        }
    }
}

const HANDLERS = {

}

RENDERERS.initDisplay();