'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
    function($resource) {
        return $resource('phones/:phoneId.json', {}, {
            query: {
                method: 'GET',
                params: {
                    phoneId: 'phones'
                },
                isArray: true
            },
            update: {
                method: 'PUT',
                params: {
                    phoneId: 'phones'
                }
            }
        });
    }
]);


phonecatServices.service('util', function() {
    return {
        isNumber: isNumber
    };

    function isNumber(num) {
        return !isNaN(num);
    }

});