'use strict';

var explorer = require('../lib/explorer');
var assert = require('assert');

var concepts;

describe('explorer', function() {
	it('explore', function() {
		concepts = explorer.explore({
			text: 'fsg fgsdfg dfsdfgd sfd hd hd\nPartidul Socialiștilor din R. Moldova (PSRM) îndeamnă cetățenii să organizeze proteste pașnice împotriva actualei guvernări. Anunțul a fost făcut astăzi, în cadrul unei conferințe de presă, de către liderul PSRM, Igor Dodon.\nDupă cum informează TRIBUNA, Igor Dodon a declarat că, R. Moldova se află într-o situație foarte dificilă.\n”Vin cu mesaj către cetățenii: haideți să nu tăcem, să nu temem, să protestăm împreună. Noi, socialiștii susținem orice protest împotriva guvernării, dar fără ideologii. Trebuie să luptăm cu actuala guvernare, trebuie să protestăm în continuarea, deoarece ei se tem de proteste”, a precizat el.\nTotodată, Dodon a menționat că, socialiștii insistă în continuare pentru a fi demiși: Guvernatorul, Dorin Drăguțanu, Procurorul General, Corneliu Gurin, dar și șeful Centrului Național Anticorupție (CNA), Viorel Chetraru.\nÎn același context, liderul PSRM a venit și cu un mesaj către cetățeni , ca în alegerile din 14 iunie curent, să nu voteze pentru candidații înaintați de partidele de la guvernare.\n”Pe data de 14 iunie nici un vot oligarhilor, așa ne va fi mai ușor să îi dăm jos de la guvernare. Trebuie să ne pregătim de alegeri anticipate, aceasta e unica soluție Corneliu Gurin”, a mai spus Dodon.',
			lang: 'ro',
			country: 'md'
		});
		assert.equal(20, concepts.length);
	});
	it('concepts split', function() {
		concepts.forEach(function(concept) {
			// console.log('==========================');
			//  console.log('concept: ', concept.value);
			var list = concept.split();
			if (list.length > 0) {
				// console.log('splited concepts', list);
			}
		});
	});
	it('collect MODE', function() {
		concepts = explorer.explore({
			text: 'Fsg fgsdfg dfsdfgd sfd hd hd\nPartidul Socialiștilor din R. Moldova (PSRM) îndeamnă cetățenii să organizeze proteste pașnice împotriva actualei guvernări. Anunțul a fost făcut astăzi, în cadrul unei conferințe de presă, de către liderul PSRM, Igor Dodon\n   	\tDupă cum informează TRIBUNA, Igor Dodon a declarat că, R. Moldova se află într-o situație foarte dificilă.\n”Vin cu mesaj către cetățenii: haideți să nu tăcem, să nu temem, să protestăm împreună. Noi, socialiștii susținem orice protest împotriva guvernării, dar fără ideologii. Trebuie să luptăm cu actuala guvernare, trebuie să protestăm în continuarea, deoarece ei se tem de proteste”, a precizat el.\nTotodată, Dodon a menționat că, socialiștii insistă în continuare pentru a fi demiși: Guvernatorul, Dorin Drăguțanu, Procurorul General, Corneliu Gurin, dar și șeful Centrului Național Anticorupție (CNA), Viorel Chetraru.\nÎn același context, liderul PSRM a venit și cu un mesaj către cetățeni , ca în alegerile din 14 iunie curent, să nu voteze pentru candidații înaintați de partidele de la guvernare.\n”Pe data de 14 iunie nici un vot oligarhilor, așa ne va fi mai ușor să îi dăm jos de la guvernare. Trebuie să ne pregătim de alegeri anticipate, aceasta e unica soluție Corneliu Gurin”, a mai spus Dodon.',
			lang: 'ro',
			country: 'md'
		}, 'collect');
		assert.equal(12, concepts.length);
	});
});
