const fs = require('fs');
const {google} = require('googleapis');
const config = require('../../etc/config.json');
const Path = require('path');

const JWTclient = new google.auth.JWT(
    config.client_email,
    null,
    config.private_key,
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
                reject("File already exist with same name !!")
            } else {
                resolve(false);
            }
        }catch(err){    
            reject(err);
        }
    });
}

const uploadXMLFile = (filePath, parentFolderId) => {
    return new Promise(async(resolve, reject) => {
        try{
            const p = Path.join(__dirname, filePath);
            const fileName = Path.parse(p).base;
            const alreadyExist = await searchFileId(fileName, parentFolderId);
            if(alreadyExist){
                reject("File already exist");
            }
            const result = await Drive.files.create({
                requestBody: {
                    name: fileName,
                    parents: [parentFolderId],
                    mimeType: 'text/xml'
                },
                media:{
                    mimeType: 'text/xml',
                    body: fs.createReadStream(p)
                }
            });
            resolve(result.data.id);
        }catch(err){    
            reject(err);
        }
    });
}

const getAllPermissions = async(id) => {
    return await Drive.permissions.list({
        fileId: id
    });
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
            console.log(searchQuery);
            const searchFolder = await Drive.files.list({q: searchQuery});
            if(searchFolder.data.files.length == 1){
                resolve(searchFolder.data.files[0].id)
            } else if (searchFolder.data.files.length > 1) {
                reject("More than one folder with same name")
            } else {
                resolve(false)
            }
        } catch(err){
            reject(err);
        }
    });
}

const createFolder = (folderName, parentFolderId = null) => {
    // if no parentFolderId, it will create new folder on the root. and return folder id
    return new Promise(async(resolve, reject) => {
        if(!folderName){
            reject('Not valid folder name');
        }
        try {
            const folderMetadata = {
                'name': folderName,
                'mimeType': 'application/vnd.google-apps.folder',
                parents: [parentFolderId] 
            };
            let newFolder = await Drive.files.create({
                resource: folderMetadata,
                fields: 'id'
            });
            resolve(newFolder.data.id);
        } catch(err){
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
            reject(err);
        }
    });
}

const uploadUserFile = (filePath, userEmail, uploadTypeProject=true) => {
    return new Promise(async(resolve, reject) => {
        if(!filePath || !userEmail){
            reject('Invalid inputs !!')
        }
        try{
            const rootFolderName = userEmail.slice(0, userEmail.indexOf('@'));
            let subFolder = null;
            if (uploadTypeProject){
                subFolderName = 'Projects'
            } else {
                subFolderName = 'CTs'
            }
            const userRootFolderId = await searchFolderId(rootFolderName);

            if(userRootFolderId){
                console.log("*** user root folder exsist ")
                const userSubFolderId = await searchFolderId(subFolderName, userRootFolderId);
                if(userSubFolderId){
                    console.log("*** user subfolder exist ");

                    //upload load the file here 
                    const uploadFile = await uploadXMLFile(filePath, userSubFolderId);
                    resolve(uploadFile)
                }
                else{
                    console.log('*** no sub folder exist ');
                    // create user projects folder and upload file
                    const subFolderId = await createFolder(subFolderName, userRootFolderId);
                    console.log("*** sub folder created : " + subFolderId)
                    const uploadFile = await uploadXMLFile(filePath, subFolderId);
                    console.log("*** uploaded file: " + uploadFile);
                    resolve(uploadFile);
                }
            }else{
                // create user root folder
                // share it with user email
                //create project or ct folders 
                // upload file
                console.log('*** No root folder exsist for the user ***')
                const rootFolerId = await createFolder(rootFolderName);
                console.log('*** created root folder ***');
                await shareFileFolder(userRootFolderId, userEmail);
                console.log("*** share the root folder with user: " + userEmail);
                const subFolderId = await createFolder(subFolderName, rootFolerId);
                console.log("*** create subfolder: " + subFolderName);
                const uploadFile = await uploadXMLFile(filePath, subFolderId);
                console.log("*** uploaded file to the user shared folder: " + filePath)
                resolve(uploadFile);
            }
        } catch (err){
            reject(err);
        }
    });
}

module.exports = {
    uploadUserFile,
    shareFileFolder
}