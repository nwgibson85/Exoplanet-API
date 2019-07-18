'use strict';

const apiKey = 'Bsa2YtF9x3coxqZqsYgqI4iAzpAsMgfhoRdKh0w4'; 
const baseURL = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI';
let x = 0;
let time = '';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function increaseX() {
    x++;
    console.log(x);
}

function resetX() {
    x = 0;
    console.log(x);
}

function printRandomExoPlanets(displayedExoPs, Json) {
    $('#results-list').empty();
    resetX();
    for (let i = 0; i < displayedExoPs.length; i++){
        $('#results-list').append(
            `<h3>${Json[displayedExoPs[i]].pl_name}</h3>
            <label for="moreExoPlanetInfo">Choose what information you would like to display.</label> 
            <ul id="${x}jsExoPlanetInfo" name='userChoiceInfo'>
                <li class="li-hostStar">
                    <h3>${Json[displayedExoPs[i]].pl_name}'s host star info</h3>
                    <button class="starInfo" id='${x}SeeStarInfo' type='click'>Go!</button>
                    <div class='${x}SeeStarInfo' id='${x}HostStar'></div>
                </li>
                <li class='li-orbit'>
                    <h3>${Json[displayedExoPs[i]].pl_name}'s orbital period</h3>
                    <button class='orbit' id='${x}SeeOrbit' type='click'>Go!</button>
                    <div class='${x}SeeOrbit' id='${x}Orbit'></div>
                </li>
                <li class='li-sizeCompare'>
                    <h3>See how big this ${Json[displayedExoPs[i]].pl_name} is compared to earth</h3>
                    <button class='compare' id='${x}' type="click">Go!</button>
                    <div id='${x}SizeCompareBox'></div>
                </li>
            </ul>
            <a href='${Json[displayedExoPs[i]].pl_pelink}'>link to this planet's page in the Exoplanet Encyclopedia</a><span>  Scroll to the bottom of the page to see a list of publications related to this Exoplanet</span>`
        )
        increaseX();
    };
    hideYoDivs(displayedExoPs);
    listenToStarInfo(Json, displayedExoPs);
    listenToOrbit(Json, displayedExoPs);
    listenToCompare(Json, displayedExoPs);   
}

function hideYoDivs(displayedExoPs) {
    for (let i = 0; i < displayedExoPs.length; i++) { 
        let eta = 0;
        console.log(eta);
        let hostStar = "#" + eta + "HostStar";
        let orbit = "#" + eta + "Orbit";
        let size = "#" + eta + "SizeCompareBox";
        $(hostStar).hide();
        $(orbit).hide();
        $(size).hide();
        eta++;  
    }
    console.log("divs hidden");
}

function printStarInfo(Json, displayedExoPs, delta) {
    let epsilon = delta.charAt(1);
    let divDesired = "#" + epsilon + "HostStar";
    console.log(Json[displayedExoPs[epsilon]].st_dist);
    $(divDesired).empty();
    if (Json[displayedExoPs[epsilon]].st_dist === null) {
        $(divDesired).append(
            `The host star ${Json[displayedExoPs[epsilon]].pl_hostname}'s distance from our solar system has not been confirmed yet.`
        )
    }
    else {
        $(divDesired).append(
            `The host star ${Json[displayedExoPs[epsilon]].pl_hostname} is ${Json[displayedExoPs[epsilon]].st_dist} light years away from our Sun.`
        )
    }
    $(divDesired).show();
}

function printOrbit(Json, displayedExoPs, beta) {  
    let zeta = beta.charAt(1);
    let div = "#" + zeta + "Orbit";
    console.log(Json[displayedExoPs[zeta]].pl_orbper);
    $(div).empty();
    if (Json[displayedExoPs[zeta]].pl_orbper === null) {
        $(div).append(
            `NASA currently does not have information on how long it takes for ${Json[displayedExoPs[zeta]].pl_name} to orbit its star.`
        )
    }
    else {
        let num = Json[displayedExoPs[zeta]].pl_orbper
        let timeArr = [];
        timeArr.push(Math.floor(num/365));
        let remainder = num % 365;
        timeArr.push(Math.floor(remainder/30));
        timeArr.push(Math.floor(remainder % 30));
        console.log(timeArr);
        let time = timeArr[0] + " years, " + timeArr[1] + ' months, and ' + timeArr[2] + ' days' 
        console.log(time);
        
        $(div).append(
            `It takes ${Json[displayedExoPs[zeta]].pl_name} ${time} to orbit its host Star.`
        )
    }
    $(div).show();
}



function printCompareRade(Json, n, displayedExoPs) {
    let desiredDiv = "#" + n + "SizeCompareBox";
    $(desiredDiv).empty();
    console.log(Json[displayedExoPs[n]].pl_rade);
    if (Json[displayedExoPs[n]].pl_rade === null) {
        $(desiredDiv).append(
            `<p>Sorry NASA's data packet does not have a confirmed radius size for this Exoplanet.</p>`
    )}
    else {  
    $(desiredDiv).append(
        `<div id="circle_box">
            <div id="earth">
                <div id="circleEarth">
                    <div id="circleTextEarth">
                        <div id="textE">
                            <p>Earth</p>
                        </div>
                    </div>
                </div>
            </div>
            <div id='${n}exoPlanet'>
                <div id="circleExoP">
                    <div id="circleTextExoPlanet">
                        <div id="textExoP">
                            <p>${Json[displayedExoPs[n]].pl_name}'s radius = ${Json[displayedExoPs[n]].pl_rade} times earth's radius</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    ),
    earthRadiusComparer(Json, n, displayedExoPs)
    }
    $(desiredDiv).show();
}

function earthRadiusComparer(Json, n, displayedExoPs) {
    let adjWidth = (Json[displayedExoPs[n]].pl_rade * 200) + 'px';
    let adjHeight = (Json[displayedExoPs[n]].pl_rade * 200) + 'px';
    let circleId = n + "exoPlanet";
    document.getElementById(circleId).style.height=adjHeight;
    document.getElementById(circleId).style.width=adjWidth;
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
     .then(responseJson => generateRandomPlanetsArr(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);
      });
      
}

function generateRandomPlanetsArr(responseJson) {
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
    let Json = $.extend(true, {}, responseJson);
    console.log(Json);
    printRandomExoPlanets(displayedExoPs, Json);
}

function listenToStarInfo(Json, displayedExoPs) {
    $(document).on("click", ".starInfo", function(event) {
        event.preventDefault();
        let gamma = $(this).prop('id');
        let delta = "." + gamma;
        console.log(delta);
        printStarInfo(Json, displayedExoPs, delta);   
    })
}

function listenToOrbit(Json, displayedExoPs) {
    $(document).on('click', '.orbit', function(event) {
        event.preventDefault();
        let alpha = $(this).prop('id');
        let beta = "." + alpha;
        console.log(beta);
        printOrbit(Json, displayedExoPs, beta) 
    })
}

function listenToCompare(Json, displayedExoPs) {
    console.log('listening')
    $('#results-list').on('click', '.compare', function(event) {
    event.preventDefault();
    let n = this.id;
    console.log(n);
    printCompareRade(Json, n, displayedExoPs);
    });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        
        $('#results').show();
        fetchRandomExoPlanet();
    });
}

function startTheEngines() {
    $('#results').hide();
    watchForm();
}

$(startTheEngines);