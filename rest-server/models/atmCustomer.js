var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

var atmCustomerSchema = new Schema({

  cardNumber: {
    type: String,
    required: true,
    unique: true
  },

  expDate: {
    type: String,
    required: true
  },

  accountNumber: {
    type: String,
    required: true,
    unique: true
  },

  pinCode: {
    type: String,
    required: true
  },

  userName: {
    type: String,
    required: true
  },

  currentBalance: {
    type: Currency,
    required: true
  }

}, {
    timestamps: true
});

var Customers = mongoose.model('Customer', atmCustomerSchema);

module.exports = Customers;
