'use strict';

const utils = require('../lib/utils');
const assert = require('assert');

describe('utils', function() {

	it('#isLetter', function() {
		assert.equal(true, utils.isLetter('a'));
		assert.equal(true, utils.isLetter('abc'));
		assert.equal(true, utils.isLetter('Șțtrtîăâ'));
		assert.equal(true, utils.isLetter('длР'));
	});

});
