//const DB_URL = 'http://127.0.0.1:5000'
DB_URL = 'https://seabirdaware.herokuapp.com'

const yearSelector = document.querySelector('#year');
const speciesSelector = document.querySelector('#species');
const flytoMCAS = document.querySelector('.mcas')
const flytoTrinidad = document.querySelector('.trinidad')

function init(){

    addLoad('#map')
    //Base Layer
    //var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      //  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
     //   maxZoom: 18,
      //  id: 'mapbox/streets-v11',
     //   tileSize: 512,
      //  zoomOffset: -1,
     //   accessToken: 'pk.eyJ1IjoicmFuZGVyc29uNTcyNiIsImEiOiJjanl5b2E0NTUxMGR5M25vN2xha2E4aHI1In0.xXUPHJrf_Shr6JX6u5X5cg'
   //});

    var mapboxTiles = L.tileLayer('https://api.mapbox.com/styles/v1/randerson5726/ckkehsrcr0ewu17rvrlvg9d8z/tiles/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoicmFuZGVyc29uNTcyNiIsImEiOiJjanl5b2E0NTUxMGR5M25vN2xha2E4aHI1In0.xXUPHJrf_Shr6JX6u5X5cg', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1,
        
    });

    //Create map and add layers
    var map = L.map('map')
    .addLayer(mapboxTiles)
    .setView([37.217645, -121.749007], 6)
    var markerGroup = L.layerGroup().addTo(map)

    //Popup binder for polygons
    function onEachFeature(feature, layer) {
        // does this feature have a property named popupContent?
        if (feature.properties) {
            layer.bindPopup(feature.properties.cblock);
        }
    }

    //Add cblock polygons
    fetch('https://seabirdaware.wpcomstaging.com/custom/resources/cblocks.json')
        .then(response => response.json())
        .then(json => {
            let polyStyle = {
                color: "#000000",
                opacity: .5,
                weight: 1,
                fillColor: '#838383',
                fillOpacity: .3
            }

            L.geoJSON(json, {style:polyStyle, onEachFeature: function (feature, layer){
                    layer.bindPopup("Count Block: "+feature.properties.cblock.toString())
                }
            }).addTo(map)

            })

    //Initial display at load
    setYears()
    updateMarkers(markerGroup, '2016','bloy')

    //Year selector event listener
    yearSelector.addEventListener('change', function(event){
        const selectedYear = event.target.value;
        const selectedSpecies = 'all'
        updateMarkers(markerGroup, selectedYear, selectedSpecies);
        setSpecies(selectedYear);
    })

    //species selector event listener
    speciesSelector.addEventListener('change', function(event){
        const selectedYear = document.querySelector('#year').value;
        const selectedSpecies = event.target.value;
        updateMarkers(markerGroup, selectedYear, selectedSpecies);
    })

    //Fly to event listeners
    flytoTrinidad.addEventListener('click', event => {
        map.flyTo([41.075821, -124.147390], 11);
    })
    
    flytoMCAS.addEventListener('click', event => {
        map.flyTo([35.293131, -120.839614], 11);
    })
    
}

function updateMarkers(markerGroup, selectedYear, selectedSpecies){
    const REQUEST_URL = DB_URL + `/mapResults?year=${selectedYear}&species=${selectedSpecies}`
    const mapPromise = fetch(REQUEST_URL)

    markerGroup.clearLayers()
    mapPromise.then(response => {return response.json()})
    .then(mapData => {
            console.log(mapData)
            mapData.forEach( item => {

                //Create custom icon
                cIcon = createMarker(item.population);

                //Add marker to map, add popup
                L.marker([item['y'], item['x']], {icon: cIcon})
                .bindPopup(`
                    <div class="popupTable">
                        <div class="label">Group:</div> 
                        <div>${formatProjects(item.group)}</div>
                        <div class="label">Survey Area:</div>
                        <div>${formatAreas(item.area)}</div>
                        <div class="label">Count Block:</div>
                        <div>${formatCblocks(item.cblock, item.group)}</div>
                        <div class="label">Population:</div>
                        <div>${item.population}</div>
                    </div>`)
                .addTo(markerGroup)
            })
            removeLoad();
        })

    //marker.bindPopup("test").openPopup();
}

function createMarker(pop){

    let color 
    let cSize
    if (pop==0){
        color = '#f7f9f7'
        cSize = .5
    } else if (pop < 5){
        color = '#fdd49e'
        cSize = 1
    } else if (pop < 25){
        color = '#fdbb84'
        cSize = 1.5
    } else if (pop < 100){
        color = '#fc8d59'
        cSize = 2
    } else if (pop < 250){
        color = '#e34a33'
        cSize = 2.5
    } else {
        color = '#b30000'
        cSize = 3
    }

    const markerHtmlStyles = `
        background-color: ${color};
        width: ${cSize}rem;
        height: ${cSize}rem;
        display: block;
        left: ${cSize/-2}rem;
        top: ${cSize/-2}rem;
        position: relative;
        border-radius: ${cSize}rem;
        transform: rotate(45deg);
        border: 1px solid #000000`

    const cIcon = L.divIcon({
        className: "my-custom-pin",
        iconAnchor: [0, 0],
        labelAnchor: [0, 0],
        popupAnchor: [0, 0],
        html: `<span style="${markerHtmlStyles}" />`
    }) 
    
    return cIcon
}

////////////// Set items in selectors
//years
function setYears(){
    const REQUEST_URL = DB_URL + '/getYears'
    const yearPromise = fetch(REQUEST_URL)

    //Remove all items in area slector and add 'all'
    removeChilds(yearSelector);

    let opt = document.createElement("option");
    opt.textContent = 'Select Year';
    opt.value = 'Select Year';
    opt.disabled = true;
    opt.selected = true;
    opt.hidden = true;
    yearSelector.appendChild(opt)


    //Get list of years and add to year selector
    yearPromise.then(response => {return response.json()})
        .then(years => {
            years['years'].forEach( item => {
                yearSelector.appendChild(createSelectItem(item, item));
            })
        })
}

//species
function setSpecies(selectedYear){
    const REQUEST_URL = DB_URL + `/getSpecies?year=${selectedYear}`
    const speciesPromise = fetch(REQUEST_URL)

    //Remove all items in area slector and add 'all'
    removeChilds(speciesSelector);
    
    let opt = document.createElement("option");
    opt.textContent = 'Select Species';
    opt.value = 'Select Species';
    opt.disabled = true;
    opt.selected = true;
    opt.hidden = true;
    speciesSelector.appendChild(opt)

    //Get list of species and add to species selector
    speciesPromise.then(response => {return response.json()})
        .then(species => {
            species['species'].forEach( item => {
                speciesSelector.appendChild(createSelectItem(item, formatSpeciesSelector(item)));
            })
        })
    }


//Only run if on population page
page_name = document.querySelector('title').innerText;
if (page_name == "Population Map – Seabird Aware"){
    init()
}