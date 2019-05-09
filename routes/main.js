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
    let where2 = '';

    for (let i = 0; i < arr.length; i++) {
        if (i === 0) {
            where = 'parametr.id = ' + arr[i];
            where2 = 'parametr_id = ' + arr[i];
        } else {
            where += ' or parametr.id = ' + arr[i];
            where2 += ' or parametr_id = ' + arr[i];
        }
    }

    const sql2 = 'select preparat_id from protypokazannia where ' + where2;

    console.log(sql2);

    con.query(sql2, (error, result, fields) => {
        let ids = [];
        if(result.length > 0) {
            for (let i = 0; i < result.length; i++) {
                ids.push(result[i].preparat_id);
            }
        }

        const sql = 'SELECT preparat.id, preparat.name, preparat.description FROM preparat JOIN pokazannia on preparat.id = ' +
            'pokazannia.preparat_id JOIN parametr on pokazannia.parametr_id = parametr.id WHERE ' + where;

        con.query(sql, (error, result2, fields) => {
            if (error) {
                console.log(error);
            }

            if(result2.length > 0) {
                let resArr = [];
                console.log(result2);
                for (let i = 0; i < result2.length; i++) {
                    if(ids.indexOf(result2[i].id) === -1){
                        let data = {
                            name: result2[i].name,
                            desc: result2[i].description
                        };
                        resArr.push(data);
                    } else {
                        console.log('not allowed');
                    }
                }
                res.render('resultView', {preparats: resArr});
            } else {
                res.render('error', {message: "Ліків за даним запитом не знайдено ¯\\_(ツ)_/¯"});
            }
        });

    });



});


module.exports = router;