(function () {

    'use strict';

    angular.module('atmApp')

        .controller('balancePageController', ['$scope', '$window', 'manageUserDataFactory',
            function ($scope, $window, manageUserDataFactory) {

                //yes yes i know that the modal with close timer attached is to be put into separate module blah blah bla
                //i'll hopefully look for refactoring later, after everything will work somehow
                var time2ShowModal = 10, // seconds
                    timeFromTimerStart,
                    startTime4ModalTimer;

                var customerFromLocalStorage = manageUserDataFactory.getUserFromLocalStorage('currentCustomer');
                customerFromLocalStorage.currentBalance = (0.01 * customerFromLocalStorage.currentBalance).toFixed(2); // in mongoose database schema 'currency' type is used
                $scope.customer = customerFromLocalStorage;

                $scope.withdrawModallMessage2Show = 'Current balance is \u20AC';
                $scope.exitToLoginPage = function () {
                    manageUserDataFactory.deleteUserFromLocalStorage('currentCustomer');
                    $window.location.href = '#startpage';
                };

                var myTimer = new Timer();
                myTimer.Interval = 1000; // ticks once per second
                function timer_tick() {
                    var currDate = new Date().getTime();
                    timeFromTimerStart = (currDate - startTime4ModalTimer) / 1000;
                    var secondsLeft2ShowModal = Math.round(time2ShowModal - timeFromTimerStart);
                    if (secondsLeft2ShowModal <= 0) {
                        $scope.closewithdrawModal();
                        return; // added since modal is fully destroyed and further call to its *.innerHTML will produce error
                    }
                    document.getElementById("withdrawModalButtonText").innerHTML = "Ok (" + secondsLeft2ShowModal + ")";
                }

                myTimer.Tick = timer_tick;

                function showwithdrawModal() {
                    document.getElementById("withdrawModalButtonText").innerHTML = "Ok (" + time2ShowModal + ")";
                    $("#withdrawModal").modal('show');
                    startTime4ModalTimer = new Date().getTime();
                    myTimer.Start();
                }

                $scope.closewithdrawModal = function () {
                    myTimer.Stop();
                    $("#withdrawModal").remove();
                    $('.modal-backdrop').remove(); //kill modal completely, w e a r e g o i n g s h r i l a n k a, we are redirecting to login page anyway
                    $scope.exitToLoginPage();
                    //$timeout(function () { // yes i know about that there exist ui-bootstrap modal which return normal manageable promise, coming soon
                    //    $scope.exitToLoginPage();
                    //}, 1000);
                };

                $scope.withdrawCash = function (cashAmount) {
                    if (Number(cashAmount) > Number(customerFromLocalStorage.currentBalance)) {
                        //console.log('no money no honey trololo');
                        $scope.withdrawError = true;
                        document.getElementById("withdrawModalButton").className = "btn btn-danger";
                        $scope.withdrawModallMessage2Show += customerFromLocalStorage.currentBalance + ', requested sum is \u20AC' + cashAmount + '.';
                        showwithdrawModal();
                    }
                    else { // enough money on account
                        $scope.withdrawError = false;
                        document.getElementById("withdrawModalButton").className = "btn btn-primary";

                        $scope.customer.currentBalance = (customerFromLocalStorage.currentBalance - cashAmount).toFixed(2);
                        manageUserDataFactory.putUserById($scope.customer._id).updateUserRecord($scope.customer);

                        showwithdrawModal();

                    }
                };
            }]);
})();