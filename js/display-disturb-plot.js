DB_URL = 'https://seabirdaware.herokuapp.com'
//DB_URL = 'http://127.0.0.1:5000'

function init(){
    
    const projectSelector = document.querySelector('#group');

    //Initial display at load
    addLoad('#plot')
    setGroups(mode='disturb')

    plotDataDist('all')

    //Project selector event listener
    projectSelector.addEventListener('change', function(event){
        const selectedGroup = event.target.value;
        plotDataDist(selectedGroup);
    })
}



//////////////////// Get data and plot
const layout_dist = {
    yaxis: {
        title: 'Disturbance Rate (events/day)',
    }
}

const config_dist = {modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomIn2d', 'zoomOut2d', 'autoScale2d']
}


function plotDataDist(selectedGroup){
    
    const REQUEST_URL = DB_URL + `/disturbResults?group=${selectedGroup}`
    const dataPromise = fetch(REQUEST_URL)

    dataPromise.then(function(response){
        const processingPromise = response.json() //Turn into json
        return processingPromise;
    }).then(function(processedResponse){

        processedResponse.forEach( areaObj => {
            areaObj.name = formatAreas(areaObj.name)
        })

        console.log(processedResponse)
        Plotly.newPlot('plot', processedResponse, layout_dist, config_dist);
        removeLoad();
    })
}


//Only run if on population page
page_name = document.querySelector('title').innerText;
if (page_name == "Disturbance – Seabird Aware"){
    console.log('running disturb plot js')
    init()
}
