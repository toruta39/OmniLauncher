/* global describe, it, beforeEach, assert, ApplicationList, _ */

(function () {
    'use strict';

    describe('ApplicationList', function () {
        describe('#proceedSearch', function () {
            beforeEach(function() {
                this.list = new ApplicationList();
                this.items = [
                    { name: 'So me want an elevator' },
                    { name: 'Nomatch' },
                    { name: 'textSome' },
                    { name: 'someText' }
                ];
            });

            it('should exist', function () {
                assert.isFunction(this.list.proceedSearch);
            });

            it('should match identical string', function () {
                var result = this.list.proceedSearch(this.items, 'someText');

                assert.equal(result.length, 1);
                assert.notEqual(_.findIndex(result, { name: 'someText' }), -1);
            });

            it('should match string that contains chars in identical order', function () {
                var result = this.list.proceedSearch(this.items, 'some');

                assert.equal(result.length, 3);
                assert.notEqual(_.findIndex(result, { name: 'So me want an elevator' }), -1);
                assert.notEqual(_.findIndex(result, { name: 'someText' }), -1);
                assert.notEqual(_.findIndex(result, { name: 'textSome' }), -1);
            });

            it('should sort results in an order that reflects the relevance', function () {
                var result = this.list.proceedSearch(this.items, 'some');

                assert.equal(result.length, 3);
                assert.equal(_.findIndex(result, { name: 'someText' }), 0);
                assert.equal(_.findIndex(result, { name: 'textSome' }), 1);
                assert.equal(_.findIndex(result, { name: 'So me want an elevator' }), 2);
            });
        });
    });
})();
