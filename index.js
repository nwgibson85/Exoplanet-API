'use strict';

//Get request variables
const apiKey = 'Bsa2YtF9x3coxqZqsYgqI4iAzpAsMgfhoRdKh0w4'; 
const baseURL = 'https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI';
let time = '';

//turn the obj params into appropriate get request format
function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

//DOM manipulation
function printRandomExoPlanets(rPA, num) {
    $('#results-list').empty();
        $('#results-list').append(
            `<h2 class='starName'>${rPA[num].pl_name}</h2> 
            <ul id="jsExoPlanetInfo" class="list-pl" name='userChoiceInfo'>
                <li class="li-hostStar">
                    <h3>${rPA[num].pl_name}'s host star info</h3>
                    <button class="hostStar" id='seeStarInfo' type='click'>Go!</button>
                    <button class='hide' id='hostStar-hide' type='click'>Hide Info</button>
                    <div class='seeStarInfo' id='hostStar'></div>
                </li>
                <li class='li-orbit'>
                    <h3>${rPA[num].pl_name}'s orbital period</h3>
                    <button class='orbit' id='seeOrbit' type='click'>Go!</button>
                    <button class='hide' id='orbit-hide' type='click'>Hide Info</button>
                    <div id='orbit'></div>
                </li>
                <li class='li-sizeCompare'>
                    <h3>See how big this ${rPA[num].pl_name} is compared to earth</h3>
                    <button class='exoCompare' type="click">Go!</button>
                    <button class='hide' id='exoCompare-hide' type='click'>Hide Info</button>
                    <div id='exoCompare'></div>
                </li>
                <li class='li-exoWeight'>
                    <h3>Enter your weight to see how much you would weigh on ${rPA[num].pl_name}</h3>
                    <form action='/action_page.php'>
                    <h4>type your weight here. (or use my weight as the default)<input type='text' id='userWeight' name='weight' required value='220'><br>
                    <select id="imperialOrMetric" name='kgOrlbs' value='lbs'><h4>Select lbs or kg</h4>
                    <option value='lbs'>lbs</option>
                    <option value='kg'>kg</option></select>
                    <button class='exoWeight' type='click'>Go!</button>
                    <button class='hide' id='exoWeight-hide' type='click'>Hide Info</button>
                    <div id='exoWeight'></div>
                </li>
                <li id='link' class='li-link'>
                    <h3>This web link will direct you to a page made by NASA with further information about ${rPA[num].pl_name}</h3>
                    <button class='link' id='linkButton' type='click'>Go!</button>
                </li>
            </ul>`
            
        )
    $('#hostStar').hide();
    $('#orbit').hide();
    $('#exoCompare').hide();
    $('.hide').hide();
    listenToStarInfo(rPA, num);
    listenToOrbit(rPA, num);
    listenToCompare(rPA, num);
    listenForcalcExoWeight(rPA, num);
    listenForLinkClick(rPA, num);
    listenToHide();
}
      
function printStarInfo(rPA, num) {
    let distance = rPA[num].st_dist;
    let shrinkNum = 21600 * distance * Math.pow(10, -6);
    let snailSpeed = shrinkNum + ' million years';
    $('#hostStar').empty();
    if (distance === null) {
        $('#hostStar').append(
            `<h3>The host star ${rPA[num].pl_hostname}'s distance from our solar system has not been confirmed yet.</h3>`
        )
    }
    else {
        $('#hostStar').append(
            `<h3>The host star ${rPA[num].pl_hostname} is ${distance} light years away from our Sun. Using current space tech it would take us ${snailSpeed} to reach this system.</h3>`
        )
    }
    $('#hostStar').show();
}

function printOrbit(rPA, num) {  
    let orb = rPA[num].pl_orbper
    let timeArr = [];
    timeArr.push(Math.floor(orb/365));
    let remainder = orb % 365;
    timeArr.push(Math.floor(remainder/30));
    timeArr.push(Math.floor(remainder % 30));
    let timeYears = timeArr[0] + " years, ";
    let timeMonths = timeArr[1] + " months, and ";
    let timeDays = timeArr[2] + " days";
    let time;
    $('#orbit').empty();
    switch (true) {
      case (timeArr[0] > 0 && timeArr[1] > 0 && timeArr[2] > 0):
        time = timeYears + timeMonths + timeDays;
        break;
      case (timeArr[0] > 0 && timeArr[1] === 0 && timeArr[2] > 0):
        time = timeYears + " and " + timeDays;
        break;
      case (timeArr[0] === 0 && timeArr[1] > 0 && timeArr[2] > 0):
        time = timeMonths + timeDays;
        break;
      case (timeArr[0] ===0 && timeArr[1] ===0 && timeArr[2] > 0):
        time = timeDays;
        break;
      default:
        time = null;
      }  
      if (time !== null) {
        $('#orbit').append(
            `<h3>It takes ${rPA[num].pl_name} ${time} to orbit its host Star.</h3>`
      )} 
      else {
      $('#orbit').append(
        `<h3>NASA currently does not have information on how long it takes for ${rPA[num].pl_name} to orbit its star. </h3>`
        )
    }    
    $('#orbit').show();
}

function printCompareRade(rPA, num) {
    $('#exoCompare').empty();
    if (rPA[num].pl_rade === null) {
        $('#exoCompare').append(
            `<p>Sorry NASA's data packet does not have a confirmed radius size for this Exoplanet.</p>`
    )}
    else {  
    $('#exoCompare').append(
        `<div id="circle_box"><h3>${rPA[num].pl_name}'s radius = ${rPA[num].pl_rade} times earth's radius</h3>
            <div id="earth">
                <div id="circleEarth">
                    <div id="circleTextEarth">
                        <div id="textE">
                            <h4>Earth</h4>
                        </div>
                    </div>
                </div>
            </div>
            <div id='exoPlanet'>
                <div id="circleExoP">
                    <div id="circleTextExoPlanet">
                        <div id="textExoP">
                            <h4>${rPA[num].pl_name}</h4>
                        </div>
                    </div>
                </div>
            </div>
        </div>`
    ),
    earthRadiusComparer(rPA, num)
    }
    $('#exoCompare').show();
}

function earthRadiusComparer(rPA, num) {
    let cssWidth = $("#earth").css('width');
    let multiplier = cssWidth.slice(0, -2);
    let kappa;
    if (multiplier > 50) {
        kappa = 100
    }
    else {
        kappa = 50
    }
    let adjWidth = (rPA[num].pl_rade * kappa) + 'px';
    let adjHeight = (rPA[num].pl_rade * kappa) + 'px';
    document.getElementById('exoPlanet').style.height=adjHeight;
    document.getElementById('exoPlanet').style.width=adjWidth;
}

function calcExoWeight(rPA, num) {
    $('#exoWeight').empty();
    let weight;
    let weightType = $('#imperialOrMetric').val();
    if (weightType === 'lbs') {
       weight = $('#userWeight').val()/2.2;
    }
    else {
        weight = $('#userWeight').val();
    }
    let masse = rPA[num].pl_masse;
    let rade = rPA[num].pl_rade;
    let g = 6.673 * Math.pow(10, -11);
    let m = 5.972 * Math.pow(10, 24);
    let r = 6371000;
    let M = masse * m;
    let R = Math.pow((rade * r), 2);
    let GA = (g * M/R);
    let exoGA = GA.toFixed(2);
    let fG =  g * M /R;
    let earthFg = g * m /Math.pow(r, 2);
    let W  = fG/earthFg * weight;
    let lbs = W * 2.2;
    let exoWlbs = lbs.toFixed(2);
    let exoW;
    if (fG < earthFg) {
        if (weightType === 'lbs') {
            exoW = exoWlbs
            $('#exoWeight').append(
                `<h3>The gravitaional force on ${rPA[num].pl_name} is roughly ${exoGA} compared to earth's which is roughly 9.81. This means you would only weigh ${exoW} ${weightType} while standing on its surface.`
            )
        }
        else {
            exoW = W;
            $('#exoWeight').append(
                `<h3>The gravitaional force on ${rPA[num].pl_name} is roughly ${exoGA} compared to earth's which is roughly 9.81. This means you would only weigh ${exoW} ${weightType} while standing on its surface.`
            )
        }
        
    }
    else {
        if (weightType === 'lbs') {
            exoW = exoWlbs
            $('#exoWeight').append(
                `<h3>The gravitaional force on ${rPA[num].pl_name} is ${exoGA} compared to earth's which is roughly 9.81. This means you would weigh ${exoW} ${weightType} while standing on its surface.`
            )
        }
        else {
            exoW = W;
            $('#exoWeight').append(
                `<h3>The gravitaional force on ${rPA[num].pl_name} is ${exoGA} compared to earth's which is roughly 9.81. This means you would weigh ${exoW} ${weightType} while standing on its surface.`
            )
        }
        
    }
    $('#exoWeight').show();
}

//NASA API Get request
function fetchRandomExoPlanet() {
    let selected = ['pl_hostname', 'pl_name', 'pl_pnum', 'st_dist', 'st_mass', 'pl_masse', 'pl_rade', 'pl_disc', 'pl_pelink', 'pl_edelink', 'pl_orbper', 'pl_eqt'];
    const params = {
      table: 'exoplanets',
      select: selected,
      format: "json",
    };
    const queryString = formatQueryParams(params);
    const url = baseURL + "?" + queryString;
  
    
    fetch(url)
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      
     .then(responseJson => sortJson(responseJson))
      .catch(err => {
        $('#js-error-message').text(`Something went wrong: ${err.message}`);  
      });   
}

// narrow down responseJSon to most useful planets 4k down to ~ 110
function sortJson(responseJson) { 
    let uselessJson = [];
    let arr = [];
    let arr1 = [];
    let arr2 = [];
    let randomPlanetsArr = [];
    for (let i = 0; i < responseJson.length; i++) {
      if (responseJson[i].pl_pelink === null) {
          uselessJson.push(responseJson[i]);
      }
      else {
          arr.push(responseJson[i]);
      }
    }
    for (let i = 0; i < arr.length; i ++) {
      if (responseJson[i].pl_orbper === null) {
            uselessJson.push(responseJson[i]);
        }
        else {
            arr1.push(responseJson[i]);
        }
    }
    for (let i = 0; i < arr1.length; i++) {
      if (responseJson[i].pl_eqt === null) {
        uselessJson.push(responseJson[i]);
      }
      else {
        arr2.push(responseJson[i]);
      }
    }
    for (let i = 0; i < arr2.length; i++) {
      if (responseJson[i].pl_masse === null) {
        uselessJson.push(responseJson[i]);
      }
      else {
        randomPlanetsArr.push(responseJson[i]);
      }
    }
    generateRandomPlanet(randomPlanetsArr);
}

//pick a random planet to display info  
function generateRandomPlanet(randomPlanetsArr) {
    let rPA = randomPlanetsArr  
    let num = Math.floor(Math.random() * rPA.length);  
    printRandomExoPlanets(rPA, num);
}

//event listeners
function listenToHide() {
    $(document).on('click', '.hide', function(event) {
        event.preventDefault();
        let alpha = $(this).prop('id');
        let beta = alpha.slice(0, -5);
        let gamma = '#' + beta;
        $(gamma).hide();
        $(this).hide();
    })
}

function listenForLinkClick(rPA, num) {
    $(document).on("click", ".link", function(event){
        event.preventDefault();
        let link = (rPA[num].pl_pelink); 
        window.open(
            link, '_blank');   
    });
}

function listenToStarInfo(rPA, num) {
    $(document).on("click", ".hostStar", function(event) {
        event.preventDefault();
        let alpha = $(this).prop('class');
        let beta = '#' +  alpha + '-hide';
        $(beta).show();
        printStarInfo(rPA, num);   
    })
}

function listenToOrbit(rPA, num) {
    $(document).on('click', '.orbit', function(event) {
        event.preventDefault();
        let alpha = $(this).prop('class');
        let beta = '#' +  alpha + '-hide';
        $(beta).show();
        printOrbit(rPA, num) 
    })
}

function listenToCompare(rPA, num) {
    $('#results-list').on('click', '.exoCompare', function(event) {
        event.preventDefault();
        let alpha = $(this).prop('class');
        let beta = '#' + alpha + '-hide';
        $(beta).show();
        printCompareRade(rPA, num);
    });
}

function listenForcalcExoWeight(rPA, num) {
    $(document).on('click', '.exoWeight', function(event) {
        event.preventDefault();
        let alpha = $(this).prop('class');
        let beta = '#' + alpha + '-hide';
        $(beta).show();
        calcExoWeight(rPA, num);  
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