'use strict';

var utils = require('../lib/utils');
var assert = require('assert');

describe('utils', function() {

	it('#isLetter', function() {
		assert.equal(true, utils.isLetter('a'));
		assert.equal(true, utils.isLetter('abc'));
		assert.equal(true, utils.isLetter('Șțtrtîăâ'));
		assert.equal(true, utils.isLetter('длР'));
	});

});
