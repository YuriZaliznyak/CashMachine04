(function () {

    'use strict';

    angular.module('atmApp')

        .constant('atmUsersDataPath', 'http://localhost:3000')

        .factory('manageUserDataFactory', ['$resource', '$localStorage', 'atmUsersDataPath', function ($resource, $localStorage, atmUsersDataPath) {
            return {
                
                getUserByCardNumber: function (cardNumberString) {
                    var filenameString = atmUsersDataPath + '/customers/cardnumber/' + cardNumberString;
                    return $resource(filenameString);
                },

                getAllATMUsers: function () {
                    var filenameString = atmUsersDataPath + '/customers/';
                    return $resource(filenameString);
                },

                putUserById: function (userIdString) {
                    var filenameString = atmUsersDataPath + '/customers/' + userIdString;
                    return $resource(filenameString,
                        {},
                        {'updateUserRecord': {method: 'PUT'}}
                    );
                },

                saveUserToLocalStorage: function (userNameString, value) {
                    $localStorage.storeObject(userNameString, value);
                },

                getUserFromLocalStorage: function (userNameString) {
                    return $localStorage.getObject(userNameString, {});
                },

                deleteUserFromLocalStorage: function (userNameString) {
                    $localStorage.removeObject(userNameString);
                }

            };

        }])

        .factory('$localStorage', ['$window', function ($window) {
            return {
                storeObject: function (key, value) {
                    $window.localStorage[key] = JSON.stringify(value);
                },
                getObject: function (key, defaultValue) {
                    return JSON.parse($window.localStorage[key] || defaultValue);
                },
                removeObject: function (key) {
                    $window.localStorage.removeItem(key);
                }
            };
        }]);
})();