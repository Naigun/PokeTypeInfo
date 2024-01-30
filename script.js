document.querySelector("#search").addEventListener("click", getPokemon);

document.querySelector("#pokemonName").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getPokemon(event);
  }
});

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function lowerCaseName(string) {
  return string.toLowerCase();
}

function changeBackgroundColor(type) {
  let backgroundColor;

  switch (type) {
    case 'normal':
      backgroundColor = '#7A7553';
      break;
    case 'fire':
      backgroundColor = '#A16E25';
      break;
    case 'water':
      backgroundColor = '#496AA5';
      break;
    case 'electric':
      backgroundColor = '#D3BB1F';
      break;
    case 'grass':
      backgroundColor = '#5E8F3D';
      break;
    case 'ice':
      backgroundColor = '#7AACA8';
      break;
    case 'fighting':
      backgroundColor = '#8F1F1D';
      break;
    case 'poison':
      backgroundColor = '#802D80';
      break;
    case 'ground':
      backgroundColor = '#A58D46';
      break;
    case 'flying':
      backgroundColor = '#7A6FB8';
      break;
    case 'psychic':
      backgroundColor = '#D33565';
      break;
    case 'bug':
      backgroundColor = '#749014';
      break;
    case 'rock':
      backgroundColor = '#9E8F2B';
      break;
    case 'ghost':
      backgroundColor = '#4B406B';
      break;
    case 'dragon':
      backgroundColor = '#5F2FDB';
      break;
    case 'dark':
      backgroundColor = '#5D4C3E';
      break;
    case 'steel':
      backgroundColor = '#86868F';
      break;
    case 'fairy':
      backgroundColor = '#B37492';
      break;
    default:
      backgroundColor = '#4F745E';
      break;
  }

  document.body.style.backgroundColor = backgroundColor;
}

// fetch JSON 
let nameMapping;
fetch('./pokemonNames.json')
  .then(response => response.json())
  .then(data => {
    nameMapping = data;
  })
  .catch(error => {
    console.error('Error fetching name :', error);
  });

function getPokemon(e) {
  const name = document.querySelector("#pokemonName").value;
  const lowerCasePokemonName = lowerCaseName(name);

  // check german name exists
  const germanName = Object.keys(nameMapping).find(germanName => lowerCaseName(germanName) === lowerCasePokemonName);

  // use the english name if found 
  const pokemonName = germanName ? nameMapping[germanName] : lowerCasePokemonName;

  fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Pokemon not found for name: ${name}`);
      }
      return response.json();
    })

    .then((data) => {
      let types = data.types.map(t => t.type.name);

      changeBackgroundColor(types[0]);

      let damageRelations = {
        "superEffectiveAgainst": new Set(),
        "notVeryEffectiveAgainst": new Set(),
        "notEffectiveAgainst": new Set()
      };

      let promises = types.map(type => {
        return fetch(`https://pokeapi.co/api/v2/type/${type}`)
          .then((response) => response.json())
          .then((typeData) => {

            typeData.damage_relations.double_damage_to.forEach(t => damageRelations.superEffectiveAgainst.add(t.name));
            typeData.damage_relations.half_damage_to.forEach(t => damageRelations.notVeryEffectiveAgainst.add(t.name));
            typeData.damage_relations.no_damage_to.forEach(t => damageRelations.notEffectiveAgainst.add(t.name));
          });
      });

      Promise.all(promises).then(() => {
        document.querySelector("#pokemonInfos").innerHTML = `
        <p>Type: ${types.map(type => `<span class="result" style="background-color: ${getTypeColor(type)}">${capitalizeFirstLetter(type)}</span>`).join(" ")}</p>
        <p>Super effective (200%) against: ${[...damageRelations.superEffectiveAgainst].map(t => `<span class="result" style="background-color: ${getTypeColor(t)}">${capitalizeFirstLetter(t)}</span>`).join(" ")}</p>
        <p>Not very effective (50%) against: ${[...damageRelations.notVeryEffectiveAgainst].map(t => `<span class="result" style="background-color: ${getTypeColor(t)}">${capitalizeFirstLetter(t)}</span>`).join(" ")}</p>
        <p>Not effective (0%) against: ${[...damageRelations.notEffectiveAgainst].map(t => `<span class="result" style="background-color: ${getTypeColor(t)}">${capitalizeFirstLetter(t)}</span>`).join(" ")}</p>
        `;
      });

      document.querySelector("#pokemonBox").innerHTML = `
      <div>
        <img
          src="${data.sprites.other["official-artwork"].front_default}"
          alt="Pokemon name"
        />
      </div>
      <div id="pokemonBox">
        <h1>🇬🇧  ${capitalizeFirstLetter(data.name)}/🇩🇪  ${germanName ? capitalizeFirstLetter(germanName) : 'N/A'}</h1>

      </div>`;
    })
    .catch((err) => {
      document.querySelector("#pokemonBox").innerHTML = `
      <h4>${err.message}</h4>
      `;
      console.log("Pokemon not found", err);
    });

  e.preventDefault();
}

function getTypeColor(type) {
  switch (type) {
    case 'normal':
      return '#A8A77A';
    case 'fire':
      return '#EE8130';
    case 'water':
      return '#6390F0';
    case 'electric':
      return '#F7D02C';
    case 'grass':
      return '#7AC74C';
    case 'ice':
      return '#96D9D6';
    case 'fighting':
      return '#C22E28';
    case 'poison':
      return '#A33EA1';
    case 'ground':
      return '#E2BF65';
    case 'flying':
      return '#A98FF3';
    case 'psychic':
      return '#F95587';
    case 'bug':
      return '#A6B91A';
    case 'rock':
      return '#B6A136';
    case 'ghost':
      return '#735797';
    case 'dragon':
      return '#6F35FC';
    case 'dark':
      return '#705746';
    case 'steel':
      return '#B7B7CE';
    case 'fairy':
      return '#D685AD';
    default:
      return '#68A090'; 
  }
}

