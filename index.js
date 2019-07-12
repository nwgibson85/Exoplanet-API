'use strict';

const getExoPlanet = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=K2names&select=alt_name,K2_kepmag,tm_designation,last_update&format=json'
const apiKey = 'Bsa2YtF9x3coxqZqsYgqI4iAzpAsMgfhoRdKh0w4'; 
const baseURL = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

 


// function displayResults(responseJson) {
//     console.log(responseJson);
//     $('#results-list').empty();
//     $("ul").append(
//         "<li>" +
        
//       );
//     for (let i = 0; i < responseJson.file.textfile; i++){
//       $('#results-list').append(
//         `<li><h3>${responseJson.data[i].cityName}</h3>
//             <p>${responseJson.data[i].description}</p>
//             <a href='${responseJson.data[i].url}'>${responseJson.data[i].url}</a>
//             <ul id=''><h3></h3>    
//             </ul>
//         </li>`
//         )};
//     $('#results').removeClass('hidden');
// };

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
     .then(responseJson => console.log(responseJson), generateRandomPlanets(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
      
}

function generateRandomPlanets() {
    let desiredNum = $('#js-numberOfPlanets').val();
    let randomPlanets = [];
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
    console.log(randomPlanets); 
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      let desiredNum = $('#js-numberOfPlanets').val();
      fetchRandomExoPlanet();
      
    });
}

$(watchForm);