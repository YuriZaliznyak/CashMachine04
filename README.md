# Cash machine emulator

This repository contains source code for a web application which emulates cash dispenser functionality. This is an
angular.js single-page application with node.js (express + mongoDB) backend, all code is written in javascript.<br />
To run application please follow the steps listed below.<br />

* Clone this repository to any convenient location at your computer. Check whether you have
node (https://nodejs.org/) installed.

* Install MongoDB on your computer. Installers for different platforms are available
at https://www.mongodb.com/download-center. cd to project folder/mongodb, run mongo database daemon
```
mongod --dbpath=.
```
command. MongoDB should start at port 27017. Open another terminal window, change directory to mongodb,
run mongo, switch to database 'atmDatabase' with
```
use atmDatabase
```
then manually add three test users to the database
```
db.customers.insert({cardNumber: '1111111111111111', expDate:'01/2051', accountNumber: '10000000000000000000', pinCode:'1111', userName:'John Doe', currentBalance:'100'});
db.customers.insert({cardNumber: '2222222222222222', expDate:'02/2052', accountNumber: '20000000000000000000', pinCode:'2222', userName:'Charley Root', currentBalance:'200'});
db.customers.insert({cardNumber: '3333333333333333', expDate:'03/2053', accountNumber: '30000000000000000000', pinCode:'3333', userName:'Vasiliy Pupkin', currentBalance:'300'});
```
check result with
```
db.customers.find().pretty();
```
and exit from mongo. Your test database with users/accounts is ready. Alternatively, you may first run the application,
and then add/manage users from its web-interface by clicking "Manage ATM Users" link located on initial screen.

* Switch to 'rest-server' folder. Run
```
npm install
npm start
```
this should launch an express server at port 3000. Now all resources needed by application are up and running.

* Switch to application root folder, run
```
npm install
```
to install packages, and then
```
gulp watch
```
to serve application locally in your default browser.

Check application behavior with test users data (e.g. card number 1111111111111111, pincode 1111).
