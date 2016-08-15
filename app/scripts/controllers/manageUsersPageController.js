(function () {
    'use strict';

    angular.module('atmApp')

        .controller('manageUsersPageController', ['$scope', '$window', 'manageUserDataFactory', '$uibModal', '$log',
            function ($scope, $window, manageUserDataFactory, $uibModal, $log) {

                $scope.allATMUsers = [];
                var animationsEnabled = true;

                function loadAllATMUsers() {
                    var customersDataFromDatabase = {};
                    manageUserDataFactory.getAllATMUsers()
                        .query()
                        .$promise
                        .then(
                            function (response) {
                                customersDataFromDatabase = response;
                                $scope.allATMUsers = customersDataFromDatabase;
                            },
                            function (response) {
                                $scope.Message2Show = 'Promise is not resolved while downloading users data: ' + response.status + ' ' + response.statusText;
                            }
                        );
                }

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

                    for (var customerProperty in customer2Update) {
                        if (customerProperty !== null) {
                            $scope.currCustomer[customerProperty] = customer2Update[customerProperty];
                        }
                    }
                    manageUserDataFactory.putUserById($scope.currCustomer._id).updateUserRecord($scope.currCustomer)
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
                };
            }]);

})
();