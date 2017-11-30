var fs = require('fs')
var storepath = require('path').join(__dirname,'store');
var users = [];
var separator = 'mRmrkaHkWhQRM0mwGlBk';
const cookieParams = {
    httpOnly: true,
    signed: true,
    maxAge: 600000,
};

function saveuser(rolln,password,cookie) {
    var saveas = {
        rolln:rolln,
        pass:password,
        cookie:cookie
    };
    users.push(saveas);
    savetodisk();
}

function savetodisk(next) {
    var newfile = [];
        users.forEach(function (user,index) {
            newfile.push(JSON.stringify(user));
            if(index == users.length-1){
                var x = newfile.join(separator);
                fs.writeFileSync(storepath,x);
            }
        })
    next();
}

module.exports.logMeIn = function logMeIn(req,res,next){
    if(req.body.firstTimeRoll){
        res.redirect('/signup/'+req.body.firstTimeRoll)
    }else{
        var x =false;
        users.forEach(function (user,index) {
            if(user.rolln === req.body.rolln.toUpperCase()){
                x=!x;
                if(user.pass === req.body.pass) {
                    var t = new Date();
                        t = t.getTime();
                    res.cookie('thisGuy', user.rolln + '_' + t, cookieParams);
                    users[index].cookie = user.rolln + '_' + t;
                        next();
                        savetodisk(next);
                }else{
                    res.render('err', {title:'My Exam Result',err:'Incorrect password',suggestion:'check your input and try again',pageName:'Login',pageLink:'/login'});
                }
            }else{
                if(!x&&index == users.length-1){
                    res.render('err', {title:'My Exam Result',err:'No accaount found',suggestion:'Please signup for an account to access your records',pageName:'signup',pageLink:'/login'});
                }
            }
        })

    }
}



module.exports.signMeUp = function signMeUp(req,res,next) {
            var rolln = req.body.rolln.toUpperCase();
            var pass = req.body.pass;
            var rpass = req.body.repeatpass;
            if(rolln) {
                var x = false;
                if(users.length>0){
                    users.forEach(function (user,index) {
                        if(user.rolln == rolln){
                            res.render('err', {title:'My Exam Result',err:'Account already exists',suggestion:'Just Login with your rollnumber and password',pageName:'Login',pageLink:'/login'});
                            x=!x;
                        }else if(!x && index == users.length-1){
                            if (pass === rpass) {
                                var t = new Date();
                                t = t.getTime();
                                res.cookie('thisGuy', rolln + '_' + t, cookieParams);
                                users.push({
                                    rolln: rolln,
                                    pass: pass,
                                    cookie: rolln + '_' + t
                                });
                                savetodisk(next);
                            }else{
                                console.log('passwords do not match');
                                //    res.redirect('/login');
                                res.render('err', {title:'My Exam Result',err:'Passwords do not match',suggestion:'check you input and try again',pageName:'signup',pageLink:'/signup/'+rolln});

                            }
                        }
                    })
                }else{
                    if (pass === rpass) {
                        var t = new Date();
                        t = t.getTime();
                        res.cookie('thisGuy', rolln + '_' + t, cookieParams);
                        users.push({
                            rolln: rolln,
                            pass: pass,
                            cookie: rolln + '_' + t
                        });
                        savetodisk(next);
                    }else{
                        console.log('passwords do not match');
                        //    res.redirect('/login');
                        res.render('err', {title:'My Exam Result',err:'Passwords do not match',suggestion:'check you input and try again',pageName:'signup',pageLink:'/signup/'+rolln});

                    }
                }
            }else{
                console.log('no roll number')
//                res.redirect('/login');
                res.render('err', {title:'My Exam Result',err:'Invalid input',suggestion:'Check that roll number and try again',pageName:'Signup',pageLink:'/signup/'+rolln});

            }
}

module.exports.getMySession = function getMySession(req,res,next) {
    var x = false
    if(req.signedCookies){
        users.forEach(function (user,index) {
            console.log(req.signedCookies,req.signedCookies)
            if(user.cookie === req.signedCookies.thisGuy){
                req.rolln = user.rolln;
                x= !x;
                next();
            }else{
                if(index == (users.length-1) && !x){
                    res.render('err', {title:'My Exam Result',err:'Your session has expired',suggestion:'Log back in to start a new session',pageName:'Login',pageLink:'/login'});
                    res.redirect('/login');
                }
            }
        });
    }else{
        res.render('err', {title:'My Exam Result',err:'Your session has expired',suggestion:'Log back in to start a new session',pageName:'Login',pageLink:'/login'});
    }
}

fs.readFile(storepath,function (err,data) {

    if(!err){
            if(data>1){
            data = data.toString();
            users=data.split(separator);
            users.forEach(function (user,index) {
                users[index] = JSON.parse(user);
            })   }

    }
})

