'use strict';

var BaseExtractor = require('./base_extractor');
var util = require('util');
var utils = require('../utils');

var Extractor = module.exports = function Extractor() {
	BaseExtractor.apply(this, arguments);
};

util.inherits(Extractor, BaseExtractor);

Extractor.prototype.extract = function(context) {
	var input = context.text;
	var p = 0;
	var pivot = 0;
	var Point = '.';
	var Space = ' ';
	var self = this;
	var start = 0;
	var concepts = [];
	var isLast = false;

	function addConcept() {
		var concept = self.formatConcept.apply(self, arguments);
		p = 0;
		start = 0;
		if (concept.isValid()) {
			concept.normalize();
			concepts.push(concept);
		}
	}

	for (var i = 0; i < input.length; i++) {
		var c = input[i];
		isLast = i === input.length - 1;
		//console.log(i, c, 'p=', p);

		if (p === 0) {
			if (utils.isLetter(c)) {
				start = i;
				p = utils.isUpper(c) ? 1 : 11;
			}
			pivot = 0;
		} else if (p === 1) {
			if (c === Point) {
				p = 21;
			} else if (utils.isLower(c)) {
				p = 2;
			} else if (utils.isUpper(c) || utils.isDigit(c) || self.isInConnectChars(c)) {
				p = 31;
			} else if (c === Space && self.isLowerStartUpperWord(input, i)) {
				p = 2;
			} else {
				if (i - start < 3) {
					p = 0;
				} else {
					addConcept(context, input, i + 1, start, p);
				}
			}
		} else if (p === 2) {
			if (isLast) {
				addConcept(context, input, i + 2, start, p);
			} else if (utils.isLetterOrDigit(c)) {
				p = 2;
			} else if (self.isInConnectChars(c)) {
				p = -2;
			} else if (c === Space) {
				p = 3;
			} else {
				if (i - start < 3) {
					p = 0;
				} else {
					addConcept(context, input, i + 1, start, p);
				}
			}
		} else if (p === -2) {
			if (utils.isLetterOrDigit(c)) {
				p = 2;
			} else {
				var prefix = input.substr(start, i - start);
				//console.log('prefix', prefix);
				if (!self.isInPrefixes(prefix.toLowerCase())) {
					addConcept(context, input, i, start, p);
				}
			}
		} else if (p === 3) {
			if (utils.isDigit(c)) {
				p = 41;
			} else if (utils.isLower(c) || self.isInConceptWords(c)) {
				if (self.isLowerStartUpperWord(input, i)) {
					//p = 61;
					//pivot = i;
					p = 1;
				} else {
					p = 4;
					pivot = i;
				}
			} else if (utils.isUpper(c)) {
				p = 1;
			} else if (self.isInStartBrackets(c)) {
				p = 51;
				pivot = i;
			} else {
				addConcept(context, input, i, start, p);
			}
		} else if (p === 4) {
			var startInput = input.substr(pivot);
			var startConnectWord = self.getStartConceptWord(startInput);
			if (startConnectWord) {
				p = 5;
				i += startConnectWord.length - 1;
				continue;
			}

			if (p === 4) {
				addConcept(context, input, pivot, start, p);
				pivot = 0;
			}

			/*continue;

			var w = input.Substring(pivot, i - pivot + 1).ToLower();

			var any = AcceptConceptWords.Count(n => n.StartsWith(w));
			if (any == 0 && c == Space)
			{
					w = w.Substring(0, w.Length - 1).ToLower();
					if (AcceptConceptWords.Any(n => n==w))
					{
							p = 5;
							continue;
					}
			}

			if (any == 0)
			{
					addConcept(input, pivot, start, p);
					pivot = 0;
			}*/
		} else if (p === 5) {
			if (utils.isUpper(c)) {
				p = 1;
			} else {
				addConcept(context, input, pivot, start, p);
				pivot = 0;
			}
		}
		//concept starts with lower
		else if (p === 11) {
			if (utils.isLower(c) || self.isInConnectChars(c)) {
				p = 11;
			} else if (utils.isUpper(c)) {
				p = 31;
			} else {
				p = 0;
			}
		}
		//concept contains point abbreviation
		else if (p === 21) {
			if (utils.isUpper(c)) {
				p = 22;
			} else {
				p = 3;
			}
		} else if (p === 22) {
			if (c === Point) {
				p = 21;
			} else if (utils.isLetter(c)) {
				p = 2;
			} else {
				p = 0;
			}
		}
		//spacial names: abbreviations, etc.
		else if (p === 31) {
			if (c === Space) {
				p = 32;
			} else if (utils.isLetterOrDigit(c)) {
				p = 31;
			} else if (self.isInConnectChars(c)) {
				p = -31;
			} else {
				addConcept(context, input, i + 1, start, p);
			}
		} else if (p === -31) {
			if (utils.isLetterOrDigit(c)) {
				p = 31;
			} else {
				//start = p = 0;
				addConcept(context, input, i, start, p);
			}
		} else if (p === 32) {
			if (utils.isUpper(c)) {
				p = 1;
			} else if (utils.isDigit(c)) {
				p = 41;
			} else if (self.isInStartBrackets(c) /* && !_inBrackets*/ ) {
				p = 51;
				pivot = i;
			} else {
				addConcept(context, input, i, start, p);
			}
		}
		//number
		else if (p === 41) {
			if (!utils.isLetterOrDigit(c)) {
				if (['-', ':'].indexOf(c) >= 0) {
					var spacei = input.substr(start, i - start).lastIndexOf(' ');
					if (spacei > 1) {
						addConcept(context, input, spacei + start + 1, start, p);
					} else {
						start = p = 0;
					}
				} else {
					addConcept(context, input, i + 1, start, p);
				}
			}
		}
		//brackets
		else if (p === 51) {
			if (utils.isUpper(c)) {
				p = 52;
			} else {
				addConcept(context, input, pivot, start, p);
			}
		} else if (p === 52) {
			if (c === Space) {
				p = 53;
			} else if (utils.isLetterOrDigit(c) || self.isInConnectChars(c)) {
				p = 52;
			} else if (self.isInEndBrackets(c)) {
				addConcept(context, input, i + 2, start, p);
			} else {
				addConcept(context, input, pivot, start, p);
			}
		} else if (p === 53) {
			if (utils.isUpper(c)) {
				p = 52;
			} else {
				addConcept(context, input, pivot, start, p);
			}
		}
	}

	return concepts;
};
