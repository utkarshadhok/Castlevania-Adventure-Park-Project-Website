var app = angular.module('castlevaniaApp', []);

app.controller('reviewController', function($scope, $window) {
    $scope.reviews = [];
    $scope.newReview = {
        name: '',
        rating: '',
        feedback: ''
    };

    $scope.submitReview = function() {
        if ($scope.newReview.name && $scope.newReview.rating && $scope.newReview.feedback) {
            $scope.reviews.push({
                name: $scope.newReview.name,
                rating: $scope.newReview.rating,
                feedback: $scope.newReview.feedback
            });

            // Redirect to the confirmation page
            $window.location.href = 'confirmation.html';
        } else {
            alert('Please fill in all the fields!');
        }
    };
});
