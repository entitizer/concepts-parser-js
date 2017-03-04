'use strict';

import * as utils from './utils';
import { models } from 'entitizer.core';

export class Concept extends models.Concept {
	normalize() {
		let value = this.value.replace(/’/g, '\'').replace(/“/g, '"').replace(/”/g, '"').replace(/„/g, '"');
		if (value !== this.value) {
			this.name = value;
		}
	}

	split(lang: string): Concept[] {
		let splitter = require('./splitter');
		return splitter.split(this, lang);
	}
};
