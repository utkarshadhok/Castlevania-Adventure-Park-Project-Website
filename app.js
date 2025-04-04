(function () {
  'use strict';
  angular.module('rentalApp', [])
    .controller('rentalCtrl', ['$scope', function ($scope) {
      $scope.equipment = [
        {
          id: 1,
          name: 'Surf Board',
          price: 30,
          description: 'A sturdy surfboard for wave riding adventures.',
          image: 'https://via.placeholder.com/300x150?text=Surf+Board'
        },
        {
          id: 2,
          name: 'ATV Quad Bike',
          price: 80,
          description: 'All-terrain vehicle for off-road experiences.',
          image: 'https://via.placeholder.com/300x150?text=ATV'
        },
        {
          id: 3,
          name: 'Kayak',
          price: 40,
          description: 'Single-person kayak, includes paddle & life vest.',
          image: 'https://via.placeholder.com/300x150?text=Kayak'
        },
        {
          id: 4,
          name: 'Rock Climbing Gear',
          price: 20,
          description: 'Harness, helmet, and ropes for rock climbing.',
          image: 'https://via.placeholder.com/300x150?text=Climbing'
        }
      ];
      $scope.cart = [];
      $scope.cartTotal = 0;
      $scope.addToCart = function (item) {
        let found = $scope.cart.find(i => i.id === item.id);
        if (found) {
          found.quantity++;
        } else {
          let cartItem = angular.copy(item);
          cartItem.quantity = 1;
          $scope.cart.push(cartItem);
        }
        $scope.updateCartTotal();
      };
      $scope.removeFromCart = function (item) {
        $scope.cart = $scope.cart.filter(i => i.id !== item.id);
        $scope.updateCartTotal();
      };
      $scope.updateCartTotal = function () {
        let total = 0;
        $scope.cart.forEach(function (cartItem) {
          total += cartItem.price * cartItem.quantity;
        });
        $scope.cartTotal = total;
      };
      $scope.checkout = function () {
        alert('Proceeding to checkout...');
      };
    }]);
})();
