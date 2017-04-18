
import * as utils from '../../utils';
import { Context } from '../../types';

const ABBR_REG = /^([^\d_`&-]\.){1,2}$/;

export class Word {
	private context?: Context;
	index?: number;
	value?: string;
	isAbbr?: boolean;
	isNumber?: boolean;
	endsWithDot?: boolean;
	rightText?: string;

	constructor(value: string, index: number, context?: Context) {
		this.reset(value, index);

		if (context) {
			this.context = context;
		}
	}

	reset(value: string, index: number) {
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

	isValid(): boolean {
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
