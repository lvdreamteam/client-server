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
        res.render('settings');
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
        if (result) {
            console.log(result);
            saveAdminIdToCookie(res, result[0] ? result[0].id : undefined);
            console.log(req.cookies);
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