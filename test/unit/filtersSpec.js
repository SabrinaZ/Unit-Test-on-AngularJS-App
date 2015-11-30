'use strict';
/*global inject*/
/* jasmine specs for filters go here */

describe('filter', function() {

    beforeEach(module('phonecatFilters'));

    describe('checkmark', function() {

        var checkmarkFilter;

        beforeEach(inject(function($filter) {
            checkmarkFilter = $filter('checkmark');
        }));

        it('should convert boolean values to unicode checkmark or cross', function() {
            expect(checkmarkFilter(true)).toBe('\u2713');
            expect(checkmarkFilter(false)).toBe('\u2718');
        });
    });
});