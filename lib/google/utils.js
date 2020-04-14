const {google} = require('googleapis');
//const config = require('../../etc/config.json');

const client_email = require('../../etc/config.json').client_email || process.env.client_email;
const private_key = require('../../etc/config.json').private_key || process.env.private_key;

const JWTclient = new google.auth.JWT(
    client_email,
    null,
    private_key,
    ['https://www.googleapis.com/auth/drive']
);

const Drive = google.drive({
    version: 'v3',
    auth: JWTclient
});
const searchFileId = (fileName, parentFolderId=null) => {
    return new Promise(async(resolve, reject) => {
        if(!fileName){
            reject("No file name to search");
        }
        let searchQuery;
        if(parentFolderId){
            searchQuery = "mimeType = 'text/xml' and '" + parentFolderId + "' in parents and name = '" + fileName + "'"
        } else {
            searchQuery = "mimeType = 'text/xml' and name = '" + fileName + "'"
        }

        try{
            const searchedFile = await Drive.files.list({q: searchQuery});
            if(searchedFile.data.files.length == 1){
                resolve(searchedFile.data.files[0].id);
            } else if(searchedFile.data.files.length > 1){
                reject("More than one file exists with the same name !!")
            } else {
                resolve(false);
            }
        }catch(err){    
            reject(err);
        }
    });
}

const uploadXMLFile = (fileName, fileContent, parentFolderId) => {
    return new Promise(async(resolve, reject) => {
        try{
            const alreadyExist = await searchFileId(fileName, parentFolderId);
            if(alreadyExist){
                reject("File already exist");
            } else {
                console.log('hitting else block ')
                const result = await Drive.files.create({
                    requestBody: {
                        name: fileName,
                        parents: [parentFolderId],
                        mimeType: 'text/xml'
                    },
                    media:{
                        mimeType: 'text/xml',
                        body: fileContent
                    }
                });
                resolve(result.data);
            }
        }catch(err){   
            console.error("Error in upload XML file");
            reject(err);
        } 
    });
}

const getAllPermissions = async(id) => {
    return await Drive.permissions.list({
        fileId: id
    });
}
const getAllFiles = async() => {
    return await Drive.files.list();
}
const deleteAFiles = async(id) => {
    return await Drive.files.delete({fileId: id});
}


const searchFolderId = (folderName, parentFolderId = null) => {
    // if no parentFolderId, it will search in the root.
    return new Promise(async(resolve, reject) => {
        let searchQuery;
        if(!folderName){
            reject('not allowed');
        }
        if(parentFolderId){
            searchQuery = "mimeType = 'application/vnd.google-apps.folder' and '" + parentFolderId + "' in parents and name = '" + folderName + "'"
        } else {
            searchQuery = "mimeType = 'application/vnd.google-apps.folder' and name='" + folderName + "'"
        }
        try {
            //console.log(searchQuery);
            const searchFolder = await Drive.files.list({q: searchQuery});
            if(searchFolder.data.files.length == 1){
                resolve(searchFolder.data.files[0].id)
            } else if (searchFolder.data.files.length > 1) {
                reject("More than one folder with same name")
            } else {
                resolve(false)
            }
        } catch(err){
            console.error("Error in searching folder");
            reject(err);
        }
    });
}

const createFolder = (folderName, parentFolderId = null) => {
    return new Promise(async(resolve, reject) => {
        // if no parentFolderId, it will create new folder on the root. and return folder id
        let parentFolder = []
        if(!folderName){
            reject('Not valid folder name');
        }
        if(parentFolderId){
            parentFolder.push(parentFolderId)
        }
        try {
            const folderMetadata = {
                'name': folderName,
                'mimeType': 'application/vnd.google-apps.folder',
                parents: parentFolder 
            };
            let newFolder = await Drive.files.create({
                resource: folderMetadata,
                fields: 'id'
            });
            resolve(newFolder.data.id);
        } catch(err){
            console.error("Error in create folder ");
            reject(err);
        }
    });
}

const shareFileFolder = (objId, userEmail) => {
    return new Promise(async(resolve, reject) => {
        if(!objId || !userEmail){
            reject("not Valid folder Id provided");
        }
        try{    
            let shareResult = await Drive.permissions.create({
                fileId: objId,
                requestBody: {
                    type: 'user',
                    role: 'reader',
                    emailAddress: userEmail
                }
            });
            resolve(shareResult);
        }catch(err){
            console.error("Error in sharing folder");
            reject(err);
        }
    });
}

const uploadUserFile = (fileName, fileContent, userEmail, uploadTypeProject=true) => {
    return new Promise(async(resolve, reject) => {
        if(!fileName || !fileContent || !userEmail){
            reject('Invalid inputs !!')
        }
        try{
            const rootFolderName = userEmail.slice(0, userEmail.indexOf('@'));
            let subFolderName = null;
            if (uploadTypeProject){
                subFolderName = 'Projects'
            } else {
                subFolderName = 'CTs'
            }
            let userRootFolderId = await searchFolderId(rootFolderName);

            if(!userRootFolderId){
                console.log("*** No root folder found for the user! ***")
                userRootFolderId = await createFolder(rootFolderName);
                console.log('*** User root folder created! ***');
            }

            let portableMeterFolderId = await searchFolderId("PortableMeter", userRootFolderId);
            if(!portableMeterFolderId){
                console.log("*** No PortableMeter folder found *** ");
                portableMeterFolderId = await createFolder("PortableMeter", userRootFolderId);
                console.log("*** Portable Meter folder created *** ");
            }

            await shareFileFolder(portableMeterFolderId, userEmail);
            console.log("*** Portable Meter folder shared *** ");

            let subFolderId = await searchFolderId(subFolderName, portableMeterFolderId);
            if(!subFolderId){
                console.log(`*** No sub folder with the name : ${subFolderName}`)
                subFolderId = await createFolder(subFolderName, portableMeterFolderId);
                console.log(`*** Sub folder ${subFolderName} created ***`);
            }

            console.log('trying to search here');
            const jj = await searchFileId(fileName, subFolderId);
            console.log(jj);

            const uploadFile = await uploadXMLFile(fileName, fileContent, subFolderId);
            console.log("*** Uploaded file to the user shared folder: " + fileName);
            resolve(uploadFile);
        } catch (err){
            console.log(err)
            reject(err);
        }
    });
}

module.exports = {uploadUserFile, getAllPermissions, searchFolderId, getAllFiles, deleteAFiles}