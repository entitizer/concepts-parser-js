'use strict';
const filterer = require('./filterer');

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

	filter(mode) {
		return filterer.filter(this.all(), this.context, mode);
	}
};
