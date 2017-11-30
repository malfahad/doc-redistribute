var generatedPdfs = []
var process = require('child_process');
var pathToExe = require('path').join(__dirname,'pdf','getoneresult.exe');
var sourcefile = 'btech22.pdf';

function getMyResult(req,res,next) {
    var page = req.page;
    var rolln = req.rolln;
    console.log(page);
    var myresult = process.execSync(pathToExe+' '+sourcefile+' '+page+' '+rolln).toString()
    console.log(myresult);
    generatedPdfs.push({
        path:myresult,
        page:page,
        rolln:rolln
    });
    
    var s = sourcefile.split('.')
    req.mine ={
        filename:s[0]+'_'+rolln+'.pdf',
        path:myresult,
        page:page,
        rolln:rolln
    }
    console.log(generatedPdfs[0].path)
    next();
}

var theBin = [];
function deleteInTen(filename){
    var d = new Date();
    theBin.push({file:filename,timeofDel:d.getTime()+600000});
    theBin.forEach(function (binItem,index) {
        if(d.getTime()>binItem.timeofDel){
            require('fs').unlink(filename);
        }
    })
}

module.exports.deleteInTen = deleteInTen;
module.exports.getMyResult = getMyResult;