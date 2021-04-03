const path = require('path');
const formidable = require('formidable');
const fs = require('fs');
const util = require('util');

let uploadFile = (req, res, next) => {
 
    const form = new formidable.IncomingForm();
      form.parse(req,  (err, field, file) =>{
     
      let oldPath = file.empLogo.path;
    //   console.log(field);
    let  newPath = path.join(__dirname,"../public/uploads", file.empLogo.name +".jpg");
    fs.copyFile(oldPath, newPath, (err)=>{
       
        let project = 1;
        res.end(util.inspect(project, {field: field, empLogo: newPath}));
        // next();
    });
    });
    form.on("end", (project, field, empLogo)=>{
       
        console.log(field, empLogo); 
        next();
        
    })
}

module.exports = {uploadFile}