const express = require('express');
const adminRouter = express.Router();
const path = require('path');
const db = require('../db.js');
const jsdom = require("jsdom");
const crypto = require('crypto');
const url = require('url');
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

const $ = jQuery = require('jquery')(window);

const saveAdminIdToCookie = function (res, id) {
    console.log("ADMIN ID: " + id);
    res.cookie(
        "adminId", 
        id,
        {
            expires: new Date(Date.now() + 24 * 60 * 60 *1000),
            path: '/admin'
        }
    );
}

adminRouter.get('/', function(req, res) {
    if (req.cookies.adminId && req.cookies.adminId != 'undefined') {
        console.log(req.cookies);
        const sql = 'SELECT * FROM `parametr`';
        let symptomsArr = [];
        db.query(sql, (error, result, fields) => {
            if(error){
                console.log(error);
            }
            for(let i=0; i<result.length; i++) {
                let data = {
                    id: result[i].id,
                    name: result[i].name
                };
                symptomsArr.push(data);
            }
            res.render('settings', {symptoms: symptomsArr});
        });
    }
    else {
        console.log("OY MAY");
        console.log(req.cookies);
        res.redirect('/admin/login');
    }
});


adminRouter.post('/logout', function(req, res) {
    saveAdminIdToCookie(res, undefined);
    res.json({
        redirectUrl: url.format({
            protocol: req.protocol,
            host: req.get('host'),
            pathname: '/admin'
        })
    });
});

adminRouter.post('/changePassword', function(req, res) {
    console.log(req.body);
    if (req.cookies.adminId && req.cookies.adminId != 'undefined') {
        const main = () => {
            res.json({
                redirectUrl: url.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    pathname: '/main'
                })
            });
        }
        const hash = crypto.createHash('sha256');
        console.log("adminId: " + req.cookies.adminId);      
        const sql = 'SELECT * FROM admins WHERE id = "' + req.cookies.adminId + '" AND password = "' + hash.update(req.body.oldPassword).digest('base64') +'"';
        db.query(sql, (error, result, fields) => {
            if (error) {
                main();
            }
            if (result && result[0]) {
                console.log("newPassword " + req.body.newPassword);
                const hash2 = crypto.createHash('sha256');
                const update = 'UPDATE admins SET password = "' + hash2.update(req.body.newPassword).digest('base64') + '" WHERE id = "' + + req.cookies.adminId + '"';
                db.query(update, (error, result, fields) => {
                    if (error) {
                        main();
                    }
                    console.log("result = " + result);
                    if(result){
                        console.log("oldPassword " + req.body.oldPassword);
                        res.json({success: "Пароль змінено!"});
                    }
                });
            }
            else {
                console.log("result " + result[0]);
                res.json({error: "Невірнй пароль"});
            }
        });
    }
});

adminRouter.post('/addNewAdmin', function(req, res) {
    const hash = crypto.createHash('sha256');
    console.log(req.body);
    var sql = "INSERT INTO admins (email, password) VALUES ('"+ req.body.username +"', '"+ hash.update(req.body.password).digest('base64') +"')";
    db.query(sql, (error, result, fields) => {
        if (error) {
            console.log("error");
            res.json({error: "Щось пішло не так :("});
        }
        if (result) {
            console.log(result);
            res.json({success: "Адміністратора додано!"});
        }
        else {
            console.log(result);
            res.json({error: "Щось пішло не так :("});
        }
    });
});

adminRouter.post('/addPreparat', function(req, res) {
    var sql = "INSERT INTO preparat (name, description) VALUES ('"+ req.body.name +"', '"+ req.body.description +"')";
    db.query(sql, (error, result, fields) => {
        if (error) {
            console.log("error");
            res.json({error: "Щось пішло не так :("});
        }
        if (result) {
            for(let i of req.body.sympthoms) {
                var pokazannia = "INSERT INTO pokazannia (preparat_id, parametr_id) VALUES ('"+ result.insertId +"', '"+ i +"')";
                db.query(pokazannia, (error, result, fields) => {
                    if (error) {
                        console.log("sympthoms error");
                    }
                });
            }
            for(let i of req.body.protypokazania) {
                var pokazannia = "INSERT INTO protypokazannia (preparat_id, parametr_id) VALUES ('"+ result.insertId +"', '"+ i +"')";
                db.query(pokazannia, (error, result, fields) => {
                    if (error) {
                        console.log("protypokazania error");
                    }
                });
            }                           
            res.json({success: req.body});
        }
        else {
            console.log(result);
            res.json({error: "Щось пішло не так :("});
        }
    });
});

adminRouter.post('/addSympthoms', function(req, res) {
    console.log(req.body);
    var sql = "INSERT INTO parametr (name) VALUES ('"+ req.body.sympthom +"')";
    db.query(sql, (error, result, fields) => {
        if (error) {
            console.log("error");
            res.json({error: "Щось пішло не так :("});
        }
        if (result) {
            console.log(result);
            res.json({success: "Симптом додано!"});
        }
        else {
            console.log(result);
            res.json({error: "Щось пішло не так :("});
        }
    });
});

const loginRouter = express.Router();

loginRouter.get('/', function (req, res) {
    res.render('adminLogin');
});

loginRouter.post('/check', function (req, res) {
    const hash = crypto.createHash('sha256');
    console.log(req.body);
    const sql = 'SELECT * FROM admins WHERE email = "' + req.body.email + '" AND password = "' + hash.update(req.body.password).digest('base64') +'"';
    db.query(sql, (error, result, fields) => {
        if (error) {
            console.log(error);
            res.json({
                redirectUrl: url.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    pathname: '/main'
                })
            });
        }
        if (result && result[0]) {
            saveAdminIdToCookie(res, result[0].id);
            res.json({
                redirectUrl: url.format({
                    protocol: req.protocol,
                    host: req.get('host'),
                    pathname: '/admin'
                })
            });
        }
        else {
            res.json({error: "Невірна електронна пошта або пароль"});
        }
    });
});

adminRouter.use('/login', loginRouter);

module.exports = adminRouter;