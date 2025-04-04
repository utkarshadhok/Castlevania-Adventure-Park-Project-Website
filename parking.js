var app = angular.module('castlevaniaParkingApp', []);

app.controller('parkingController', function($scope) {

    // Array to hold reservation data
    $scope.reservations = [];

    // Model for new reservation
    $scope.newReservation = {
        name: '',
        vehicleType: '',
        vehiclePlate: '',
        parkingDate: '',
        parkingTime: ''
    };

    // Function to submit the reservation
    $scope.submitReservation = function() {
        if ($scope.newReservation.name && $scope.newReservation.vehicleType && 
            $scope.newReservation.vehiclePlate && $scope.newReservation.parkingDate && 
            $scope.newReservation.parkingTime) {
                
            $scope.reservations.push({
                name: $scope.newReservation.name,
                vehicleType: $scope.newReservation.vehicleType,
                vehiclePlate: $scope.newReservation.vehiclePlate,
                parkingDate: $scope.newReservation.parkingDate,
                parkingTime: $scope.newReservation.parkingTime
            });

            // Clear the form after submission
            $scope.newReservation.name = '';
            $scope.newReservation.vehicleType = '';
            $scope.newReservation.vehiclePlate = '';
            $scope.newReservation.parkingDate = '';
            $scope.newReservation.parkingTime = '';
        } else {
            alert('Please fill in all the fields!');
        }
    };
});
