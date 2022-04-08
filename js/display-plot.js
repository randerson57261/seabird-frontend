DB_URL = 'https://seabirdaware.herokuapp.com'
//DB_URL = 'http://127.0.0.1:5000'

function init(){
    
    const projectSelector = document.querySelector('#group');
    const areaSelector = document.querySelector('#area');
    const cblockSelector = document.querySelector('#cblock');

    
    //Initial display at load
    addLoad('#plot')
    setGroups("pop")
    setAreas('all', 'pop')
    setCblocks('all','all', 'pop')
    plotData('all', 'all', 'all')

    //Project selector event listener
    projectSelector.addEventListener('change', function(event){
        const selectedGroup = event.target.value;
        const selectedArea = 'all'
        const selectedCblock = 'all'
        plotData(selectedGroup, selectedArea, selectedCblock);
        setAreas(selectedGroup, 'pop');
        setCblocks(selectedGroup, selectedArea, 'pop');
    })

    //Area selector event listener
    areaSelector.addEventListener('change', function(event){
        const selectedGroup = document.querySelector('#group').value;
        const selectedArea = event.target.value;
        const selectedCblock = 'all'
        plotData(selectedGroup, selectedArea, selectedCblock);
        setCblocks(selectedGroup, selectedArea, 'pop');
    })

    //cblock selector event listener
    cblockSelector.addEventListener('change', function(event){
        const selectedGroup = document.querySelector('#group').value;
        const selectedArea = document.querySelector('#area').value;
        const selectedCblock = event.target.value;
        plotData(selectedGroup, selectedArea, selectedCblock);
    })
}

//////////////////// Get data and plot
let layout_pop = {
    yaxis: {
        title: 'Count',
    }
}

let config_pop = {modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d']
}


function plotData(selectedGroup, selectedArea, selectedCblock){
    
    const REQUEST_URL = DB_URL + `/results?group=${selectedGroup}&area=${selectedArea}&cblock=${selectedCblock}`
    const dataPromise = fetch(REQUEST_URL)

    dataPromise.then(function(response){
        const processingPromise = response.json() //Turn into json
        return processingPromise;
    }).then(function(processedResponse){
        const plotData = formatSpecies(processedResponse);
        Plotly.newPlot('plot', plotData, layout_pop, config_pop);
        removeLoad();
    })
}



//Only run if on population page
let page_name = document.querySelector('title').innerText;
if (page_name == "Seabird Breeding Population – Seabird Aware"){
    console.log('running population plot JS')
    init()
}