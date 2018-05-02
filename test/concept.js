'use strict';

const parser = require('../lib/index');
const Concept = require('../lib/concept').Concept;
const assert = require('assert');

describe('Concept', function () {

    it('constructor', function () {
        const concept = new Concept({ value: 'Vlad Filat', index: 0, lang: 'ro' });
        assert.equal('Vlad Filat', concept.value);
        assert.equal('ro', concept.lang);
        assert.equal(0, concept.index);
    });

    it('PERSON Concept', function () {
        const concepts = parser.parse({
            text: `Vlad Filat este presedintele parlamentului iar Iurie Rosca...`,
            lang: 'ro'
        });
        assert.equal(2, concepts.length);
        assert.equal('Vlad Filat', concepts[0].value);
        assert.equal('ro', concepts[0].lang);
        assert.equal('PERSON', concepts[0].type);
        assert.equal('Iurie Rosca', concepts[1].value);
        // assert.equal('PERSON', concepts[1].type);
    });

    it('PERSON split Concept', function () {
        let concepts = parser.parse({
            text: `Vlad Filat și Iurie Rosca vor merge la răcoare`,
            lang: 'ro'
        });

        assert.equal(2, concepts.length);

        assert.equal('Vlad Filat', concepts[0].value);
        assert.equal('PERSON', concepts[0].type);
        assert.equal('Iurie Rosca', concepts[1].value);
        // assert.equal('PERSON', concepts[1].type);
    });

});
