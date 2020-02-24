const xml2js = require('xml2js');

const builder = new xml2js.Builder();

var _asset = {
    $: {
        tag: ""
    },
    duration: "",
    datapointset: "",
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
    preorpost: "",
    maction: ""
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


var ProjectFile = {
    root: {
        project:{ 
            $:{ 
                name:"rocky"
            },
            building: []
        }
    }
}


function createXML(data){
    return new Promise((resolve, reject) => {
        try{
            let projectName;
            for(let[key, values] of Object.entries(data)) {
                //console.log(`${key} : ${values}`);
                projectName = key.match(/\d+/g)[0];
                ProjectFile.root.project.$.name = projectName;
                let building;
                for(let [k, v] of Object.entries(values)) {
                   // console.log(`${k} : ${v}`);
                    building = _building;
                    for( let [ke, obj] of Object.entries(v)) {
                        //console.log(`${ke} : ${obj}`);
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
                    building.location.asset.preorpost = "Pre";
                    building.location.asset.maction = "Primary";
                    building.location.asset.datapointset = "Transformer";
                    building.location.asset.duration = "1H20M";

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

module.exports = createXML;