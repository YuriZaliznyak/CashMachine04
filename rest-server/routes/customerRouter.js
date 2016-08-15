var express = require('express');
var bodyParser = require('body-parser');

var Customers = require('../models/atmCustomer');

var customerRouter = express.Router();
customerRouter.use(bodyParser.json());

customerRouter.route('/')
    .get(function (req, res, next) { // gets list of all customers registered in database
        Customers.find({}, function (err, customer) {
            if (err) throw err;
            res.json(customer);
        });
    })
    .post(function (req, res, next) { // adds new customer to the list of customers
        Customers.create(req.body, function (err, customer) {
            if (err) throw err;
            console.log('New ATM customer created!');
            var id = customer._id;
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            });
            res.end('Added the customer with id: ' + id);
        });
    })
    .delete(function (req, res, next) { // deletes ALL customers
        Customers.remove({}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

// --- main account management part, gets and updates (puts) data for a given card number
customerRouter.route('/cardnumber/:numberOfCreditCard')
    .get(function (req, res, next) { // returns a customer's json data for supplied card number
        Customers.find({cardNumber: req.params.numberOfCreditCard}, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })
    .put(function (req, res, next) { // updates data for supplied card number
        Customers.findOneAndUpdate({cardNumber: req.params.numberOfCreditCard}, {
            $set: req.body
        }, {
            new: true
        }, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });
// ---

// block to manage customers by id, if needed
customerRouter.route('/:customerId')
    .get(function (req, res, next) {
        Customers.findById(req.params.customerId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })
    .put(function (req, res, next) {
        Customers.findByIdAndUpdate(req.params.customerId, {
            $set: req.body
        }, {
            new: true
        }, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    })
    .delete(function (req, res, next) {
        Customers.findByIdAndRemove(req.params.customerId, function (err, resp) {
            if (err) throw err;
            res.json(resp);
        });
    });

module.exports = customerRouter;
