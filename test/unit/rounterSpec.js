'use strict';
/*global inject*/

describe('router control', function() {
    beforeEach(module('phonecatApp'));

    beforeEach(inject(function($templateCache) {
        // enusure required html template is cached prior to each test case
        $templateCache.put('partials/phone-list.html', ' phone-list template');
        $templateCache.put('partials/phone-detail.html', ' phone-detail template');
    }));

    it('phones should map to PhoneListCtrl ', inject(function($rootScope, $location, $route) {
        $location.path('/phones');
        // use $rootScope.apply() to ensure that changes are propagated
        $rootScope.$apply();
        expect($route.current.controller).toEqual('PhoneListCtrl');
    }));

    it('phones should map to phone-list template ', inject(function($rootScope, $location, $route) {
        $location.path('/phones');
        // use $rootScope.apply() to ensure that changes are propagated
        $rootScope.$apply();
        expect($route.current.templateUrl).toEqual('partials/phone-list.html');
    }));
});