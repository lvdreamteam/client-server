const express = require('express');
const router = express.Router();
const path = require('path');
const con = require('../db.js');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { window } = new JSDOM();
const { document } = (new JSDOM('')).window;
global.document = document;

const $ = jQuery = require('jquery')(window);


router.get('/', function(req, res) {
    const sql = 'SELECT * FROM `parametr`';
    let symptomsArr = [];
    con.query(sql, (error, result, fields) => {
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
        res.render('main', {symptoms: symptomsArr});
    });

});

router.post('/makeRequest', function (req, res) {
    let arr = req.body.symptom;
    let where = '';

    for (let i = 0; i < arr.length; i++) {
        console.log(arr[i]);
        if (i === 0) {
            where = 'parametr.id = ' + arr[i];
        } else {
            where += ' AND parametr.id = ' + arr[i];
        }
    }

    const sql = 'SELECT preparat.name, preparat.description FROM preparat JOIN pokazannia on preparat.id = ' +
        'pokazannia.preparat_id JOIN parametr on pokazannia.parametr_id = parametr.id WHERE ' + where;
    con.query(sql, (error, result, fields) => {
        if (error) {
            console.log(error);
        }

        if(result.length > 0) {
            let resArr = [];
            console.log(result);

            for (let i = 0; i < result.length; i++) {
                let data = {
                    name: result[i].name,
                    desc: result[i].description
                };
                resArr.push(data);
            }
            res.render('resultView', {preparats: resArr});
        } else {
            res.render('error', {message: "Ліків за даним запитом не знайдено ¯\\_(ツ)_/¯"});
        }
    });
});


module.exports = router;