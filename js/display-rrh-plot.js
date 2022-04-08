DB_URL = 'https://seabirdaware.herokuapp.com'
//DB_URL = 'http://127.0.0.1:5000'

function init(){
    
    const projectSelector = document.querySelector('#group');
    const areaSelector = document.querySelector('#area');
    const cblockSelector = document.querySelector('#cblock');

    
    //Initial display at load
    addLoad('#plot')
    setGroups('rrh')
    setAreas('all', 'rrh')
    setCblocks('all','all', 'rrh')
    plotDataRRH('all', 'all', 'all')

    //Project selector event listener
    projectSelector.addEventListener('change', function(event){
        const selectedGroup = event.target.value;
        const selectedArea = 'all'
        const selectedCblock = 'all'
        plotDataRRH(selectedGroup, selectedArea, selectedCblock);
        setAreas(selectedGroup, 'rrh');
        setCblocks(selectedGroup, selectedArea, 'rrh');
    })

    //Area selector event listener
    areaSelector.addEventListener('change', function(event){
        const selectedGroup = document.querySelector('#group').value;
        const selectedArea = event.target.value;
        const selectedCblock = 'all'
        plotDataRRH(selectedGroup, selectedArea, selectedCblock);
        setCblocks(selectedGroup, selectedArea, 'rrh');
    })

    //cblock selector event listener
    cblockSelector.addEventListener('change', function(event){
        const selectedGroup = document.querySelector('#group').value;
        const selectedArea = document.querySelector('#area').value;
        const selectedCblock = event.target.value;
        plotDataRRH(selectedGroup, selectedArea, selectedCblock);
    })
}

////////////// Set items in selectors



//////////////////// Get data and plot
let layout_rrh = {
    yaxis: {
        title: 'Count',
    }
}

let config_rrh = {modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d']
}


function plotDataRRH(selectedGroup, selectedArea, selectedCblock){
    
    const REQUEST_URL = DB_URL + `/rrhresults?group=${selectedGroup}&area=${selectedArea}&cblock=${selectedCblock}`
    const dataPromise = fetch(REQUEST_URL)

    dataPromise.then(function(response){
        const processingPromise = response.json() //Turn into json
        return processingPromise;
    }).then(function(processedResponse){
        const plotData = formatSpecies(processedResponse);
        Plotly.newPlot('plot', plotData, layout_rrh, config_rrh);
        removeLoad();
    })
}



//Only run if on population page
let page_name_rrh = document.querySelector('title').innerText;
if (page_name_rrh == "Roosting, Rafting, Hauled Out – Seabird Aware"){
    console.log('running rrh plot JS')
    init()
}