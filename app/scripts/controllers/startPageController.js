(function () {

    'use strict';

    angular.module('atmApp')

        .controller('startPageController', ['$scope', '$location', '$timeout', '$uibModal', 'manageUserDataFactory',
            function ($scope, $location, $timeout, $uibModal, manageUserDataFactory) {

                var time2ShowModal = 10, // seconds
                    timeFromTimerStart,
                    startTime4ModalTimer;

                $scope.modalMessage2Show = ''; // modal content

                var myTimer = new Timer();
                myTimer.Interval = 1000; // ticks once per second
                function timer_tick() {
                    var currDate = new Date().getTime();
                    timeFromTimerStart = (currDate - startTime4ModalTimer) / 1000;
                    var secondsLeft2ShowModal = Math.round(time2ShowModal - timeFromTimerStart);
                    if (secondsLeft2ShowModal <= 0) {
                        closeErrorModal();
                    }
                    document.getElementById("loginErrorModalButton").innerHTML = "Ok (" + secondsLeft2ShowModal + ")";
                }

                myTimer.Tick = timer_tick;

                function showErrorModal() {
                    document.getElementById("loginErrorModalButton").innerHTML = "Ok (" + time2ShowModal + ")";
                    $("#loginErrorModal").modal('show');
                    startTime4ModalTimer = new Date().getTime();
                    myTimer.Start();
                    makeFormClear();
                }

                function closeErrorModal() {
                    myTimer.Stop();
                    $("#loginErrorModal").modal('hide');
                }

                function makeFormClear() {
                    $timeout(function () {
                        $scope.loginForm.$setPristine();
                        $scope.customer.creditCardNumber = '';
                        $scope.customer.pinCode = '';
                    }, 1000);
                }

                $scope.loginToAccount = function (customer) {

                    var creditCardNumber = customer.creditCardNumber,
                        pinCode = customer.pinCode,
                        customerDataFromDatabase = {};

                    manageUserDataFactory.getUserByCardNumber(creditCardNumber)
                        .query()
                        .$promise
                        .then(
                            function (response) {
                                customerDataFromDatabase = response[0];
                                if (typeof customerDataFromDatabase != 'undefined') {
                                    if (customerDataFromDatabase.pinCode != $scope.customer.pinCode) {
                                        $scope.modalMessage2Show = "Invalid card number or pin code";
                                        showErrorModal();
                                    }
                                    else { // pin codes match, navigate to the balance page
                                        //customerDataFromDatabase.pinCode = '****';
                                        manageUserDataFactory.saveUserToLocalStorage('currentCustomer', customerDataFromDatabase);
                                        $location.path('balancepage');
                                    }
                                }
                                else {
                                    $scope.modalMessage2Show = "Invalid card number or pin code";
                                    showErrorModal();
                                }
                            },
                            function (response) {
                                $scope.modalMessage2Show = 'Promise is not resolved while downloading credit card details: ' + response.status + ' ' + response.statusText;
                                showErrorModal();
                            }
                        );
                };

                $scope.openAdminLoginModal = function () {
                    var adminLoginModalInstance = $uibModal.open({
                        animation: true,
                        templateUrl: 'adminLoginModalContent',
                        controller: 'adminLoginModalController',
                    });
                };

            }])

        .controller('adminLoginModalController', ['$scope', '$uibModalInstance', '$log', '$location',
            function ($scope, $uibModalInstance, $log, $location) {


                $scope.adminLoginOk = function (adminPasswordFormContent) {
                    $uibModalInstance.close();
                    $location.path('manageusers');
                    console.log(adminPasswordFormContent);

                };

                $scope.adminLoginCancel = function () {
                    console.log('Admin login aborted');
                    $uibModalInstance.dismiss('cancel');
                };
            }]);
})();