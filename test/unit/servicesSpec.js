'use strict';

/*global inject*/

describe('service', function() {

    // load modules
    beforeEach(module('phonecatApp'));

    describe('util', function() {

        describe('isNubmer method', function() {
            it('should check if parameter is a valid number', inject(function(util) {
                expect(util.isNumber(1)).toBe(true);
                expect(util.isNumber({})).toBe(false);
            }));
        });
    });

    describe('phone factory', function() {

        // Test service availability
        it('check the existence of Phone factory', inject(function(Phone) {
            expect(Phone).toBeDefined();
        }));

        // Test http get request using $httpBackend
        describe('Test http get request using $httpBackend', function() {
            var PhoneService, $httpBackend;
            var url;

            beforeEach(inject(function(_$httpBackend_, _Phone_) {
                $httpBackend = _$httpBackend_;
                PhoneService = _Phone_;
                url = 'phones/phones.json';
            }));

            //verify that after all test suites are excuted, all HTTP requests are made and none of them to be flushed.
            afterEach(function() {
                $httpBackend.verifyNoOutstandingExpectation();
                $httpBackend.verifyNoOutstandingRequest();
            });

            it('should make a get request to get a phone detail', function() {
                // use $httpBackend service to respond a HTTP Get rquest to respond with some mock data
                $httpBackend.when('GET', url).respond(200);
                PhoneService.list();
                $httpBackend.flush();
            });

            it('should make a update request', function() {
                // verify data in $httpBackend request
                $httpBackend.when('PUT', url, function(postdata) {
                    var data = angular.fromJson(postdata);
                    expect(data).toBeDefined();
                    expect(data.id).toBeGreaterThan(0);
                    return true;
                }).respond(200);
                PhoneService.update({
                    id: 1
                });
                $httpBackend.flush();
            });

        });

    });
});