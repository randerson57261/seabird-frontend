speciesFormatting = {'dcco':'DCCO - Double-Crested Cormorant',
'brac':"BRAC - Brandt's Cormorant",
"peco":"PECO - Pelagic Cormorant",
"wegu":"WEGU - Western Gull",
"bloy":"BLOY - Black Oystercatcher",
"unco":"UNCO - Unidentified Cormorant",
"brpe":"BRPE - Brown Pelican",
"pigu":"PIGU - Pigeon Guillemon",
"casl":"CASL - California Sea Lion",
"hase":"HASE - Harbor Seal",
"comu":"COMU - Common Murres",
"rhau":"RHAU - Rhinoceros Auklet",
"mamu":"MAMU - Marbled Murrelet",
"stsl":"STSL - Steller Sea Lion",
"unsl":"UNSL - Unidentified Sea Lion"
};

function formatSpecies(plotData){
    plotData.forEach( specObj => {
        if (speciesFormatting[specObj.name]){
            return specObj.name = speciesFormatting[specObj.name];
        }
    })

    return plotData
}



function formatSpeciesSelector(value){
    if (speciesFormatting[value]){
        return speciesFormatting[value];
    }
    else{
        return value;
    }
}

function createSelectItem(value, label){
    let opt = document.createElement("option");
    opt.textContent = label;
    opt.value = value;
    return opt
}

const removeChilds = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

function addLoad(html_id){
    const loadingEle = document.createElement('div');
    loadingEle.classList.add('loading');

    console.log(html_id)
    const parent = document.querySelector(html_id)
    parent.appendChild(loadingEle)
}

function removeLoad(){
    const loadingEle = document.querySelector('.loading')
    loadingEle.remove()
}

function formatAreas(value){
    dictionary = {'all':'All Areas',
        'estero_bluffs':'Estero Bluffs',
        'montana_de_oro':'Montana De Oro',
        'shell_beach':'Shell Beach',
        'trinidad':'Trinidad'
         };

    if (dictionary[value]){
        return dictionary[value];
    }
    else{
        return value;
    }
}

function formatProjects(value){
    dictionary = {'all':'All Groups',
                    'mcas':'Morro Coast Audubon Society',
                    'trinidad':'Trinidad'};

    if (dictionary[value]){
        return dictionary[value];
    }
    else{
        return value;
    }
}


function formatCblocks(value, group){
    if (group=='trinidad'){
        dictionary = {'all':'All Count-Blocks',
        '1':'1 Little River Rock Overlook',
        '2':'2 Tepona Point',
        '3':'3 Scenic Drive Trinidad Bay',
        '4':'Camel Rock BIOLOGIST ONLY',
        '5':'4 Trinidad Memorial Lighthouse',
        '6':'5 Scotty Point',
        '7':"6 Patrick's point Drive",
        '8':"7 Palmer's Point",
        '9':'8 Wedding Rock Overlook',
        '10':'Mussel and Cormorant Rocks BIOLOGIST ONLY'};
    } else {
        dictionary = {'all':'All Count-Blocks'};
    }

    if (dictionary[value]){
        return dictionary[value];
    }
    else{
        return value;
    }
}

////////////// Set items in selectors
//groups
function setGroups(mode){
    const REQUEST_URL = DB_URL + '/getGroups?mode=' + mode
    const groupPromise = fetch(REQUEST_URL)

    //Remove all items in area slector and add 'all'
    const groupSelector = document.querySelector('#group');
    removeChilds(groupSelector);
    groupSelector.appendChild(createSelectItem('all',formatProjects('all')));

    //Get list of areas (filtered by group) and add to area selector
    groupPromise.then(response => {return response.json()})
        .then(groups => {
            groups['groups'].forEach( item => {
                groupSelector.appendChild(createSelectItem(item, formatProjects(item)));
            })
        })
}

//Areas
function setAreas(selectedGroup, mode){
    const REQUEST_URL = DB_URL + `/getAreas?group=${selectedGroup}&mode=` + mode
    const areaPromise = fetch(REQUEST_URL)

    //Remove all items in area slector and add 'all'
    const areaSelector = document.querySelector('#area');
    removeChilds(areaSelector);
    areaSelector.appendChild(createSelectItem('all', formatAreas('all')));

    //Get list of areas (filtered by group) and add to area selector
    areaPromise.then(response => {return response.json()})
        .then(areas => {
            areas['areas'].forEach( item => {
                areaSelector.appendChild(createSelectItem(item, formatAreas(item)));
            })
        })
}

//cblocks
function setCblocks(selectedGroup, selectedArea, mode){
    
    const REQUEST_URL = DB_URL + `/getCblocks?group=${selectedGroup}&area=${selectedArea}&mode=`+mode
    const cblockPromise = fetch(REQUEST_URL)

    //Remove all items in area slector and add 'all'
    const cblockSelector = document.querySelector('#cblock');
    removeChilds(cblockSelector);
    cblockSelector.appendChild(createSelectItem('all', formatCblocks('all',selectedGroup)));
    
    //Get list of areas (filtered by group) and add to area selector
    cblockPromise.then(response => {return response.json()})
        .then(cblocks => {
            cblocks['cblocks'].forEach( item => {
                    cblockSelector.appendChild(createSelectItem(item, formatCblocks(item, selectedGroup)));
                })
            })
}