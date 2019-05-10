var express = require('express');
var router = express.Router();

var mysql      = require('mysql2/promise');
var connection = mysql.createPool({
    host     : 'localhost',
    user     : 'root',
    password : 'Kirbyno1',
    database : 'tiAddressBook'
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('address-book', { title: 'My Address Book' });
});

// function for ajax query to get json of all contacts on mysql database 'contacts and order them alphabetically.
router.get('/getcontacts', async function(req, res, next) {
    await connection.query({
        sql: 'SELECT * FROM `contacts` ORDER BY forename ASC',
        timeout: 40000 // 40s
    }, function (error, results, fields) {
        // error will be an Error if one occurred during the query
        // results will contain the results of the query
        // fields will contain information about the returned results fields (if any)
        if (error) {
            throw error;
        }
        res.send(results);
    });
});

// inserting a new contact to the database using fields forename, surname, address, city, postcode, dob, phonenumber, emailaddress and county with a post request.
router.post('/newcontact', async function(req, res, next) {
    const form = req.body;
    connection.query({
        sql: 'INSERT INTO contacts(forename, surname, address, city, postcode, dob, phonenumber, emailaddress, county) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
        timeout: 40000 // 40s
    },[
        form.forename,
        form.surname,
        form.address,
        form.city,
        form.postcode,
        form.dob,
        form.phonenumber,
        form.emailaddress,
        form.county
    ], function (error, results) {
        if (error) {
            throw error;
        }
        res.send(results);
    });
});
//  post request to update and edited contact. 
router.post('/editcontact', async function(req, res, next) {
    const form = req.body;
    connection.query({
        sql: 'UPDATE contacts SET forename = ?, surname = ?, address = ?, city = ?, postcode = ?, dob = ?, phonenumber = ?, emailaddress = ?, county = ? WHERE id = ?',
        timeout: 40000 // 40s
    },[
        form.forename,
        form.surname,
        form.address,
        form.city,
        form.postcode,
        form.dob,
        form.phonenumber,
        form.emailaddress,
        form.county,
        form.id
    ], function (error, results) {
        if (error) {
            throw error;
        }
        res.send(results);
    });
});

// function to delete contact details from mysql database. 
router.post('/removecontact', async function(req, res, next) {
    console.log(req.body);
    const form = req.body;
    connection.query({
        sql: 'DELETE FROM contacts WHERE id = ?',
        timeout: 40000 // 40s
    },[
        form.id
    ], function (error, results) {
        if (error) {
            throw error;
        }
        res.send(results);
    });
});

module.exports = router;
