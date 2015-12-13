'use strict';

var parser = require('../lib/parser');
var assert = require('assert');

var concepts;
var text = 'fsg fgsdfg Moldova cum Partidul  Democrat dfsdfgd sfd hd hd\nPartidul Socialiștilor din R. Moldova (PSRM) îndeamnă cetățenii să organizeze proteste pașnice împotriva actualei guvernări. Anunțul a fost făcut astăzi, în cadrul unei conferințe de presă, de către liderul PSRM, Igor Dodon.\nDupă cum informează TRIBUNA, Igor Dodon a declarat că, R. Moldova se află într-o situație foarte dificilă.\n”Vin cu mesaj către cetățenii: haideți să nu tăcem, să nu temem, să protestăm împreună. Noi, socialiștii susținem orice protest împotriva guvernării, dar fără ideologii. Trebuie să luptăm cu actuala guvernare, trebuie să protestăm în continuarea, deoarece ei se tem de proteste”, a precizat el.\nTotodată, Dodon a menționat că, socialiștii insistă în continuare pentru a fi demiși: Guvernatorul, Dorin Drăguțanu, Procurorul General, Corneliu Gurin, dar și șeful Centrului Național Anticorupție (CNA), Viorel Chetraru.\nÎn același context, liderul PSRM a venit și cu un mesaj către cetățeni , ca în alegerile din 14 iunie curent, să nu voteze pentru candidații înaintați de partidele de la guvernare.\n”Pe data de 14 iunie nici un vot oligarhilor, așa ne va fi mai ușor să îi dăm jos de la guvernare. Trebuie să ne pregătim de alegeri anticipate, aceasta e unica soluție Corneliu Gurin”, a mai spus Dodon. Eurovision 2016.';

describe('parser', function() {
	it('parse', function() {
		concepts = parser.parse({
			text: text,
			lang: 'ro',
			country: 'md'
		});
		assert.equal(21, concepts.length);
		assert.equal('Republica Moldova', concepts[0].name);
		// console.log('concepts', concepts);
	});
	it('concepts split', function() {
		concepts.forEach(function(concept) {
			var list = concept.split();
			if (list.length > 0) {
				// console.log('splited concepts', list, concept);
			}
		});
	});
	it('collect MODE', function() {
		concepts = parser.parse({
			text: text,
			lang: 'ro',
			country: 'md'
		}, {
			mode: 'collect'
		});
		assert.equal(15, concepts.length);
	});
	it('no normalizeText', function() {
		concepts = parser.parse({
			text: text,
			lang: 'ro',
			country: 'md'
		}, {
			normalizeText: false
		});
		assert.equal(22, concepts.length);
	});
});
