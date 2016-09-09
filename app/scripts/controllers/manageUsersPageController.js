(function () {
    'use strict';

    angular.module('atmApp')

        .controller('manageUsersPageController', ['$scope', '$window', 'manageUserDataFactory', '$uibModal', '$log', '$location',
            function ($scope, $window, manageUserDataFactory, $uibModal, $log, $location) {

                $scope.allATMUsers = [];
                var animationsEnabled = true;

                $scope.showEditCustomerModal = function (customer) {
                    var editCustomerModalInstance = $uibModal.open({
                        animation: animationsEnabled,
                        templateUrl: 'editCustomerModalContent',
                        controller: 'editCustomerModalController',
                        resolve: {
                            currCustomer: function () {
                                return customer;
                            },
                            modalTitle: function () {
                                if (customer !== null) {
                                    return 'Edit customer data';
                                }
                                else {
                                    return 'Add new customer';
                                }
                            }
                        }
                    });

                    editCustomerModalInstance.result.then(function () {
                        $log.info('User update initiated...');
                    }, function () {
                        $log.info('Changes aborted');
                    });
                };

                $scope.navigate2startpage = function() {
                    $location.path('startpage');
                };

                function loadAllATMUsers() {
                    var customersDataFromDatabase = {};
                    manageUserDataFactory.getAllATMUsers()
                        .query()
                        .$promise
                        .then(
                            function (response) {
                                for (var eachUser in response){
                                    if (response.hasOwnProperty(eachUser)){
                                        var currentUser = response[eachUser];
                                        for(var keyName in currentUser){
                                            if (currentUser.hasOwnProperty(keyName) && keyName=='currentBalance'){
                                                currentUser[keyName] = 0.01*currentUser[keyName];//cents2dollars, for screen representation
                                            }
                                        }
                                    }
                                }
                                customersDataFromDatabase = response;
                                $scope.allATMUsers = customersDataFromDatabase;
                            },
                            function (response) {
                                $scope.Message2Show = 'Promise is not resolved while downloading users data: ' + response.status + ' ' + response.statusText;
                            }
                        );
                }

                loadAllATMUsers();

            }])

        .controller('editCustomerModalController', ['$scope', '$uibModalInstance', '$log', 'modalTitle', 'manageUserDataFactory', 'currCustomer',
            function ($scope, $uibModalInstance, $log, modalTitle, manageUserDataFactory, currCustomer) {

                $scope.currCustomer = currCustomer;
                $scope.modalTitle = modalTitle;

                $scope.ok = function (customer2Update) {

                    console.log(customer2Update);
                    if ($scope.editCustomerForm.expDate.$dirty && typeof customer2Update.expDate == 'undefined'){
                        console.log('Date touched! new expdate undefined!!', customer2Update.expDate);
                    }
                    console.log('HERE111 before re-assignment::', currCustomer);
                    for (var customerProperty in customer2Update) {
                        if (customer2Update.hasOwnProperty(customerProperty)) {
                            currCustomer[customerProperty] = customer2Update[customerProperty];
                        }
                    }
                    console.log('HERE222 before update initited::', currCustomer);
                    manageUserDataFactory.putUserById(currCustomer._id).updateUserRecord(currCustomer)
                        .$promise
                        .then(
                            function (response) {
                                $log.info('User update successfull');
                            },
                            function (response) {
                                $log.info('Promise not resolved after user update call, status = ' + response.status + ' ' + response.statusText);
                            }
                        );
                    $uibModalInstance.close();
                };

                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                    console.log('Edit customer modal: Changes aborted');
                };
            }]);

})
();