'use strict';
/*global inject */
/* jasmine specs for controllers go here */
describe('PhoneCat controllers', function() {

    beforeEach(function() {
        this.addMatchers({
            toEqualData: function(expected) {
                return angular.equals(this.actual, expected);
            }
        });
    });

    //load module
    beforeEach(module('phonecatApp'));
    beforeEach(module('phonecatServices'));

    describe('PhoneListCtrl', function() {
        var scope, ctrl, $httpBackend;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('phones/phones.json').
            respond([{
                name: 'Nexus S'
            }, {
                name: 'Motorola DROID'
            }]);

            scope = $rootScope.$new();
            //inject $controller service to register a new instance of PhoneListCtrl, by providing the scope object
            ctrl = $controller('PhoneListCtrl', {
                $scope: scope
            });
        }));


        it('should create "phones" model with 2 phones fetched from xhr', function() {
            expect(scope.phones).toBeUndefined();
            $httpBackend.flush();

            expect(scope.phones).toEqualData(
                [{
                    name: 'Nexus S'
                }, {
                    name: 'Motorola DROID'
                }]);
        });


        it('should set the default value of orderProp model', function() {
            expect(scope.orderProp).toBe('age');
        });
    });


    describe('test PhoneDetailCtrl with spies', function() {
        var scope, $q, ctrl, Phone,
            xyzPhoneData = function() {
                return {
                    name: 'phone xyz',
                    images: ['image/url1.png', 'image/url2.png']
                };
            };

        beforeEach(inject(function(_$q_, $rootScope, $routeParams, $controller, _Phone_) {
            $q = _$q_;
            Phone = _Phone_;
            $routeParams.phoneId = 'xyz';
            scope = $rootScope.$new();
            // create a spy on Phone instance, and stub the 'get' method.
            // cheatSheet, for jasmine v0.3 or higher, andReturn function is replaced by and.returnValue
            spyOn(Phone, 'get').andReturn($q.when(xyzPhoneData()));
            ctrl = $controller('PhoneDetailCtrl', {
                $scope: scope
            });
        }));


        it('should fetch phone detail', function() {
            expect(scope.phone).toBeUndefined();
            scope.$apply();
            expect(scope.phone).toEqualData(xyzPhoneData());
            // expection on our spy
            expect(Phone.get).toHaveBeenCalled();
            // expect correct argument is passed into our spy method
            expect(Phone.get).toHaveBeenCalledWith('xyz');

        });

        it('should get imageUrl', function() {
            expect(scope.mainImageUrl).toBeUndefined();
            scope.$apply();
            expect(scope.mainImageUrl).toBe('image/url1.png');
        });


        it('should update mainImageUrl', function() {
            scope.setImage('test.jpg');
            expect(scope.mainImageUrl).toBe('test.jpg');
        });
    });

    describe('test PhoneDetailCtrl with mocks', function() {
        var scope, $q, ctrl,
            xyzPhoneData = function() {
                return {
                    name: 'phone xyz',
                    images: ['image/url1.png', 'image/url2.png']
                };
            };

        var mockPhone = {};
        mockPhone.get = function() {
            return $q.when(xyzPhoneData());
        };

        beforeEach(function() {
            module(function($provide) {
                $provide.value('Phone', mockPhone);
            });
        });

        beforeEach(inject(function(_$q_, $rootScope, $routeParams, $controller) {
            $q = _$q_;
            $routeParams.phoneId = '';
            scope = $rootScope.$new();
            ctrl = $controller('PhoneDetailCtrl', {
                $scope: scope
            });
        }));


        it('should fetch phone detail', function() {
            expect(scope.phone).toBeUndefined();
            scope.$apply();
            expect(scope.phone).toEqualData(xyzPhoneData());
        });
    });


    describe('test PhoneDetailCtrl with mocks and spies', function() {
        var scope, $q, ctrl,
            xyzPhoneData = function() {
                return {
                    name: 'phone xyz',
                    images: ['image/url1.png', 'image/url2.png']
                };
            };

        var mockPhone = {};

        beforeEach(function() {
            module(function($provide) {
                $provide.value('Phone', mockPhone);
            });
        });

        beforeEach(inject(function(_$q_, $rootScope, $routeParams, $controller) {
            $q = _$q_;
            // in jasmine 0.3 or higher version, replace andCallFake with and.callFake
            mockPhone.get = jasmine.createSpy('get').andCallFake(function() {
                return $q.when(xyzPhoneData());
            });
            $routeParams.phoneId = 'xyz';
            scope = $rootScope.$new();
            ctrl = $controller('PhoneDetailCtrl', {
                $scope: scope
            });
        }));


        it('should fetch phone detail', function() {
            expect(scope.phone).toBeUndefined();
            scope.$apply();
            expect(scope.phone).toEqualData(xyzPhoneData());
            // expection on our spy
            expect(mockPhone.get).toHaveBeenCalled();
            // expect correct argument is passed into our spy method
            expect(mockPhone.get).toHaveBeenCalledWith('xyz');
        });
    });


    describe('test event on spies', function() {
        var scope, $httpBackend, ctrl;

        beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
            $httpBackend = _$httpBackend_;
            $httpBackend.expectGET('phones/xyz.json').respond(404);

            $routeParams.phoneId = 'xyz';
            scope = $rootScope.$new();
            ctrl = $controller('PhoneDetailCtrl', {
                $scope: scope
            });
            spyOn(scope, '$broadcast');
            $httpBackend.flush();
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('should send a broadcast on not_found ', function() {
            expect(scope.$broadcast).toHaveBeenCalled();
            expect(scope.$broadcast.calls[0].args[0]).toBe('not_found');
        });


        it('should call redirect on timeout dispatch', inject(function($rootScope, $location) {
            $rootScope.$broadcast('timeout', true);
            expect($location.url()).toBeFalsy();
        }));

        it('should redirect to /phones on timeout dispatch and retry is false', inject(function($rootScope, $location) {
            $rootScope.$broadcast('timeout', false);
            expect($location.url()).toBe('/phones');
        }));
    });

});