/* global describe, it, assert, Keyword */

(function () {
    'use strict';

    describe('Keyword', function () {
        describe('#match', function () {
            it('should exist', function () {
                var keyword = new Keyword('someText');

                assert.isFunction(keyword.match);
            });

            it('should match identical string', function () {
                var keyword = new Keyword('someText');

                assert.ok(keyword.match('someText'));
            });

            it('should match string that contains identical string', function () {
                var keyword = new Keyword('someText');

                assert.ok(keyword.match('This is someText.'));
            });

            it('should unmatch string that doesn\'t contain identical string', function () {
                var keyword = new Keyword('someText');

                assert.notOk(keyword.match('noText'));
            });

            it.skip('should match string that contains characteristics of query', function () {
                var keyword = new Keyword('sT');

                assert.ok(keyword.match('someText'));
            });
        });
    });
})();
