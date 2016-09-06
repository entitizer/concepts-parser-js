'use strict';

const utils = require('../../utils');

const ABBR_REG = /^([^\d_`&-]\.){1,2}$/;

module.exports = class Word {
	constructor(value, index, context) {
		this.reset(value, index);
		if (context) {
			this.context = {
				country: context.country,
				lang: context.lang
			};
		}
	}

	reset(value, index) {
		if (typeof index === 'number' && index > -1) {
			this.index = index;
		} else {
			this.index = this.index || 0;
		}

		const upperValue = value.toUpperCase();

		if (value.length > 1) {
			// ends with dot
			if (value[value.length - 1] === '.') {
				// is NOT abbreviation
				if (!(value === upperValue && ABBR_REG.test(value))) {
					value = value.substr(0, value.length - 1);
				}
			}
		}

		this.isAbbr = upperValue === value;
		this.isNumber = utils.isDigit(value);
		this.endsWithDot = value[value.length - 1] === '.';

		this.value = value;
	}

	isValid() {
		if (!this.value) {
			return false;
		}

		const value = this.value;

		if (value.length !== value.trim().length) {
			//throw new Error('Trim value is not === with value: "'+ value+'"');
			return false;
		}

		// is not number AND contains letters
		if (!this.isNumber) {
			// contains letters
			return value.toLowerCase() !== value.toUpperCase();
		}

		return true;
	}

};
