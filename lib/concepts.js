'use strict';

const filters = require('./filters');

module.exports = class Concepts {
	constructor(context) {
		this.context = context;
		this.list = [];
	}

	add(concept) {
		if (concept.isValid()) {
			concept.normalize();
			this.list.push(concept);
		}
	}

	all() {
		return this.list;
	}

	filter(options) {
		return filters.filter(this.all(), this.context, options);
	}
};
