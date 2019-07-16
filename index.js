'use strict';

const apiKey = 'Bsa2YtF9x3coxqZqsYgqI4iAzpAsMgfhoRdKh0w4'; 
const baseURL = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI';
let x = 0;
let Json;
let displayedExoPs;
let n;

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function increaseX() {
    return x ++;
}

function resetX() {
    return x === 0,
    console.log(x);
}

function printRandomExoPlanets(displayedExoPs, Json) {
    
    $('#results-list').empty();
    resetX();
    for (let i = 0; i < displayedExoPs.length; i++){
      $('#results-list').append(
        `<li><h3>${Json[displayedExoPs[i]].pl_name}</h3>
            <p>${Json[displayedExoPs[i]].pl_hostname} is the host star. This system is ${Json[displayedExoPs[i]].st_dist} light years away.</p>
            <a href='${Json[displayedExoPs[i]].pl_pelink}'>link to this planets page in the Exoplanet Encyclopedia</a>
            <ul class='moreExoInfo'><h3>How it compares to Earth</h3> 
                <li>The host star ${Json[displayedExoPs[i]].pl_hostname} is ${Json[displayedExoPs[i]].st_mass} times the Sun's mass</li>
            </ul>    
            <button id='${x}' type="submit" >Visual Size Comparison</button>
        </li>`
        )
        increaseX();
    };   
    $('#results').removeClass('hidden');
}

function printCompareRade(displayExoPs, Json) {
    if ($(Json[displayedExoPs[n]].pl_rade) === null) {
        $('#compareSizeBox').append(
            `<p>Sorry Nasa's data packet does not have a confirmed radius size for this Exoplanet.</p>`
    )}
    else {
        let exoRade = $(Json[displayedExoPs[n]].pl_rade);
    $('#compareSizeBox').append(
        `<div class="circle_box">
            <div class="circle_container_earth">
                <div class="circle_main">
                    <div class="circle_text_container">
                        <div class = "circle_text">
                            <p>Earth</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id='exoPlanet' class="circle_container_exoP">
                <div class="circle_main">
                    <div class="circle_text_container">
                        <div class = "circle_text">
                            <p>${Json[displayExoPs[n]].pl_name}'s radius = ${exoRade}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`)}
    earthRadiusComparer(exoRade);
}

function earthRadiusComparer(exoRade) {
    let adjWidth = (exoRade * 200) + 'px'
    let adjHeight = (exoRade * 200) + 'px';
    document.getElementById("exoPlanet").style.height=adjHeight;
    document.getElementById("exoPlanet").style.width=adjWidth;
}

function fetchRandomExoPlanet() {
    let selected = ['pl_hostname', 'pl_name', 'pl_pnum', 'pl_bmassj', 'pl_k2flag', 'st_dist', 'st_mass', 'pl_masse', 'pl_rade', 'pl_disc', 'pl_pelink', 'pl_edelink', 'pl_eqt', 'pl_insol', 'pl_cbflag', 'pl_orbper'];
    const params = {
      table: 'exoplanets',
      select: selected,
      format: "json",
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
     .then(responseJson => makeJson(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
      
}
function makeJson(responseJson) {
    let Json = responseJson;
    generateRandomPlanetsArr(Json)
}

function generateRandomPlanetsArr(Json) {
    console.log(Json);
    let desiredNum = $('#js-numberOfPlanets').val();
    let randomPlanets;
    let displayedExoPs = [];
    for (let i = 0; i < desiredNum; i++) { 
        do {  
            randomPlanets = Math.floor(Math.random() * Json.length); 
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
    printRandomExoPlanets(displayedExoPs, Json);
}

function listenToCompare() {
    $('#results-list').on('click', 'button', function(event) {
    event.preventDefault();
    let n = this.id;
    console.log(this.id);
    printCompareRade(n);
    });
}

function watchForm() {
    $('form').submit(event => {
      event.preventDefault();
      fetchRandomExoPlanet();
    });
}

function startTheEngines() {
    watchForm();
    listenToCompare();
}

$(startTheEngines);