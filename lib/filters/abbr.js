
function isAbbr(text, abbr) {
	const words = text.split(/[ ]+/g);
	let textAbbr = '';
	for (let i = 0; i < words.length; i++) {
		let s = words[i][0];
		if (s === s.toUpperCase()) {
			textAbbr += s;
		}
	}
	return textAbbr === abbr;
}

/**
 * Filter abbreviations
 */
module.exports = function invalid(concepts) {
	let prev;
	return concepts.filter(function(concept) {
		if (prev && concept.getAttr('isAbbr') && prev.endIndex < concept.index && concept.index - prev.endIndex < 4) {
			if (isAbbr(prev.value, concept.value)) {
				prev.setAbbr(concept.value);
				return false;
			}
		}
		prev = concept;
		return true;
	});
};
