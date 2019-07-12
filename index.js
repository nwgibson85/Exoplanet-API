'use strict';

const getExoPlanet = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=K2names&select=alt_name,K2_kepmag,tm_designation,last_update&format=json'
const apiKey = 'Bsa2YtF9x3coxqZqsYgqI4iAzpAsMgfhoRdKh0w4'; 
const baseURL = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

 


function printRandomExoPlanets(responseJson) {
    
    // $('#results-list').empty();
    // for (let i = 0; i < displayedExoPs.length; i++){
    //   $('#results-list').append(
    //     `<li><h3>${responseJson[displayedExoPs[i]].}</h3>
    //         <p>${responseJson.data[i].description}</p>
    //         <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
    //         <ul id=''><h3></h3>    
    //         </ul>
    //     </li>`
    //     )};
    // $('#results').removeClass('hidden');
}

function fetchRandomExoPlanet() {
    let selected = ['alt_name', 'K2_kepmag', 'tm_designation', 'last_update']
    const params = {
      table: 'K2names',
      select: selected,
      format: "json",
    //   key: apiKey
    };
    const queryString = formatQueryParams(params);
    const url = baseURL + "?" + queryString;
  
    console.log(url);
  
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
     .then(responseJson => generateRandomPlanetsArr(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
      
}

function generateRandomPlanetsArr(responseJson) {
    console.log(responseJson);
    let desiredNum = $('#js-numberOfPlanets').val();
    let randomPlanets;
    let displayedExoPs = [];
    for (let i = 0; i < desiredNum; i++) { 
        do {  
            randomPlanets = Math.floor(Math.random() * responseJson.length); 
        } 
        while (randomExoPs());  
        displayedExoPs.push(randomPlanets); 
    } 
    function randomExoPs() { 
        for (let i = 0; i < displayedExoPs.length; i++) { 
            if (displayedExoPs[i] === randomPlanets) { 
                return true; 
            } 
        }    
        return false; 
    } 
    console.log(displayedExoPs); 
    printRandomExoPlanets(displayedExoPs, responseJson);
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      fetchRandomExoPlanet();
    });
}

$(watchForm);