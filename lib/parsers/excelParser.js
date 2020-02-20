const XLSX = require('xlsx');
 

const parseToExcel = function parseExcel(path){
    return new Promise((resolve, reject) => {
        try{
            var results = {};
            var workBook = XLSX.readFile(path);
            workBook.SheetNames.forEach((sheetName) => {
                let res = XLSX.utils.sheet_to_json(workBook.Sheets[sheetName]);
                if(res.length > 0 ) results[sheetName] = res;
            });
            resolve(results);
        } catch(err){
            reject(err);
        }
    });
}



module.exports = parseToExcel;
