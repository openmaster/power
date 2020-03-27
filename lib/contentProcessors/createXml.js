const xml2js = require('xml2js');
const parseString = require('xml2js').parseString;
const builder = new xml2js.Builder();

var _asset = {
    $: {
        tag: ""
    },
    duration: "1H20M",
    datapointset: "Transformer",
    manufacturer: "Powersmiths",
    kVA: "",
    pWiring: "",
    sWiring: "",
    model: "",
    pVoltage: "",
    sVoltage: "",
    phases: "",
    efclass: "",
    type: "",
    impedance: "",
    temprise: "",
    krating: "",
    esshield: "",
    preorpost: "Pre",
    maction: "Primary"
}

var _location = {
    $: {
        id: ""
    },
    asset: _asset
}

var _building = {
    $: {
        name: ""
    },
    location: _location
}


var _ProjectFile = {
    root: {
        project:{ 
            $:{ 
                name:""
            },
            building: []
        }
    }
}

function ConvertXmlToJson(xml) {
    return new Promise((resolve, reject) => {
        parseString(xml, (err, json) => {
            if(err){
                reject(err);
            } else {
                resolve(json);
            }
        })
    });
}

function ConvertJsonToXml(json) {
    return new Promise((resolve, reject) => {
        try {
            const xml = builder.buildObject(json);
            resolve(xml);
        } catch (err){
            reject(err);
        }
    })
}

function createXML(data){
    return new Promise((resolve, reject) => {
        try{
            let projectName;
            let ProjectFile = JSON.parse(JSON.stringify(_ProjectFile));
            for(let[key, values] of Object.entries(data)) {
                //console.log(`${key} : ${values}`);
                projectName = key.match(/\d+/g)[0];
                ProjectFile.root.project.$.name = projectName;
                for(let [k, v] of Object.entries(values)) {
                    //console.log(`${k} : ${v}`);
                    let building = JSON.parse(JSON.stringify(_building));
                    for( let [ke, obj] of Object.entries(v)) {
                        switch(ke.trim().toUpperCase()){
                            case 'Building Name'.toUpperCase():
                                building.$.name = obj;
                                break;
                            case 'Location ID / Room #'.toUpperCase():
                                building.location.$.id = obj;
                                break;
                            case 'Transformer Tag Number'.toUpperCase():
                                building.location.asset.$.tag = obj;
                                break;
                            case 'kVA Typical Sizes'.toUpperCase():
                                building.location.asset.kVA = obj;
                                break;
                            case 'Primary Winding Configuration'.toUpperCase():
                                building.location.asset.pWiring = obj;
                                break;
                            case 'Secondary Winding Configuration'.toUpperCase():
                                building.location.asset.sWiring = obj;
                                break;
                            case 'Phase'.toUpperCase():
                                building.location.asset.phases = obj;
                                break;
                            case 'Effciency Class'.toUpperCase():
                                building.location.asset.efclass = obj;
                                break;
                            case 'Winding Material'.toUpperCase():
                                building.location.asset.type = obj;
                                break;
                            case 'Impedance (%)'.toUpperCase():
                                building.location.asset.impedance = obj;
                                break;
                            case 'Temp Rise (Deg C)'.toUpperCase():
                                building.location.asset.temprise = obj;
                                break;
                            case 'K Rating'.toUpperCase():
                                building.location.asset.krating = obj;
                                break;
                            case 'Electrostatic Shield'.toUpperCase():
                                building.location.asset.esshield = obj;
                                break;
                            case 'Manufacturer'.toUpperCase():
                                building.location.asset.manufacturer = obj;
                                break;
                            case 'Model / Catalog #'.toUpperCase():
                                building.location.asset.model = obj;
                                break;
                            case 'Primary Voltage'.toUpperCase():
                                building.location.asset.pVoltage = obj;
                                break;
                            case 'Secondary Voltage'.toUpperCase():
                                building.location.asset.sVoltage = obj;
                                break;
                        }
                    }
                    ProjectFile.root.project.building.push(building);
                }                
            }
            let xml = builder.buildObject(ProjectFile);
            resolve(xml);
        } catch(err){
            reject(err);
        }
    });
}

module.exports = {createXML, ConvertXmlToJson, ConvertJsonToXml};