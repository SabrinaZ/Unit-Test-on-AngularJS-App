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
      expect(scope.phones).toEqualData([]);
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


  describe('PhoneDetailCtrl', function() {
    var scope, $httpBackend, ctrl,
      xyzPhoneData = function() {
        return {
          name: 'phone xyz',
          images: ['image/url1.png', 'image/url2.png']
        };
      };


    beforeEach(inject(function(_$httpBackend_, $rootScope, $routeParams, $controller) {
      $httpBackend = _$httpBackend_;
      $httpBackend.expectGET('phones/xyz.json').respond(xyzPhoneData());

      $routeParams.phoneId = 'xyz';
      scope = $rootScope.$new();
      ctrl = $controller('PhoneDetailCtrl', {
        $scope: scope
      });
    }));


    it('should fetch phone detail', function() {
      expect(scope.phone).toEqualData({});
      $httpBackend.flush();
      expect(scope.phone).toEqualData(xyzPhoneData());
    });


    it('should get imageUrl', function() {
      expect(scope.mainImageUrl).toBeUndefined();
      $httpBackend.flush();
      expect(scope.mainImageUrl).toBe('image/url1.png');
    });


    it('should update mainImageUrl', function() {
      scope.setImage('test.jpg');
      expect(scope.mainImageUrl).toBe('test.jpg');
    });
  });


});