'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Phone', ['$resource',
    function($resource) {
        var resource = $resource('phones/:phoneId.json', {}, {
            query: {
                method: 'GET',
                isArray: true
            },
            update: {
                method: 'PUT'
            }
        });


        return {
            list: list,
            get: get,
            update: update
        };

        function list() {
            return resource.query({
                phoneId: 'phones'
            }).$promise;
        }

        function get(phoneId) {
            return resource.get({
                phoneId: phoneId
            }).$promise;
        }

        function update(data) {
            return resource.update({
                phoneId: 'phones'
            }, data).$promise;
        }

    }
]);