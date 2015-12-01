'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('PhoneListCtrl', ['$scope', 'Phone',
  function($scope, Phone) {
    Phone.list().then(function(phones) {
      $scope.phones = phones;
    });
    $scope.orderProp = 'age';
  }
]);

phonecatControllers.controller('PhoneDetailCtrl', ['$scope', '$routeParams', 'Phone', '$location',
  function($scope, $routeParams, Phone, $location) {

    Phone.get($routeParams.phoneId).then(function(phone) {
      $scope.phone = phone;
      $scope.mainImageUrl = phone.images[0];
    }).catch(function(error) {
      if (error.status === 404) {
        $scope.$broadcast('not_found', error);
      }
    });

    $scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    };

    $scope.$on('timeout', redirect);

    function redirect(event, retry) {
      if (retry) {
        return;
      } else {
        $location.path('/phones');
      }
    }
  }
]);