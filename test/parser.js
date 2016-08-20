'use strict';

let parser = require('../lib/parser');
let assert = require('assert');

describe('parser', function() {

	it('simple concepts', function() {
		const concepts = parser.parse({
			text: `Europa este un continent. R. Moldova este parte din Europa.`,
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(3, concepts.length);
		assert.equal('Europa', concepts[0].value);
		assert.equal('R. Moldova', concepts[1].value);
		assert.equal('Europa', concepts[2].value);
	});

	it('text end concept', function() {
		const concepts = parser.parse({
			text: `R. Moldova este parte din UE`,
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(2, concepts.length);
		assert.equal('R. Moldova', concepts[0].value);
		assert.equal('UE', concepts[1].value);
	});

	it('word spaces', function() {
		const concepts = parser.parse({
			text: `sometimes called Bosnia  Herzegovina or Bosnia & Herzegovina`,
			lang: 'en'
		});
		// console.log(concepts);
		assert.equal(3, concepts.length);
		assert.equal('Bosnia', concepts[0].value);
		assert.equal('Herzegovina', concepts[1].value);
		assert.equal('Bosnia & Herzegovina', concepts[2].value);
	});

	it('connect words: Bosnia and Herzegovina', function() {
		const concepts = parser.parse({
			text: 'sometimes called Bosnia-Herzegovina or Bosnia & Herzegovina, abbreviated BiH or B&H, and, in short, often known informally as Bosnia, is a country in Southeastern Europe located on the Balkan Peninsula',
			lang: 'en'
		});
		// console.log(concepts);
		assert.equal(7, concepts.length);
	});

	it('connect with number: Eurovision 2016', function() {
		const concepts = parser.parse({
			text: 'La Eurovision 2016 vor concura 10 participanti.',
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(1, concepts.length);
		assert.equal('Eurovision 2016', concepts[0].value);
	});

	it('invalid connect with 2 numbers: Eurovision 2016 18', function() {
		const concepts = parser.parse({
			text: 'La Eurovision 2016 18 vor concura 10 participanti.',
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(1, concepts.length);
		assert.equal('Eurovision 2016', concepts[0].value);
	});

	it('invalid connect with numbers: 2016 Eurovision', function() {
		const concepts = parser.parse({
			text: '2016 Eurovision 2016 18 vor concura 10 participanti. 200 Eurovision',
			lang: 'ro'
		});
		// console.log(concepts);
		assert.equal(2, concepts.length);
		assert.equal('Eurovision 2016', concepts[0].value);
		assert.equal('Eurovision', concepts[1].value);
	});

	it('name abbr: B. Obama', function() {
		const concepts = parser.parse({
			text: 'V. Filat a fost retinut.',
			lang: 'ro'
		});
		assert.equal(1, concepts.length);
		assert.equal('V. Filat', concepts[0].value);
	});

	it('name abbr: V. V. Putin', function() {
		const concepts = parser.parse({
			text: 'V. V. Putin este presedintele Rusiei.',
			lang: 'ro'
		});
		assert.equal(2, concepts.length);
		assert.equal('V. V. Putin', concepts[0].value);
		assert.equal('Rusiei', concepts[1].value);
	});

	it('name abbr: VV Putin', function() {
		const concepts = parser.parse({
			text: 'VV Putin este presedintele Rusiei.',
			lang: 'ro'
		});
		assert.equal(2, concepts.length);
		assert.equal('VV Putin', concepts[0].value);
	});

	it('name abbr: Putin V.', function() {
		const concepts = parser.parse({
			text: 'Putin V. este presedintele Rusiei.',
			lang: 'ro'
		});
		assert.equal(2, concepts.length);
		assert.equal('Putin V.', concepts[0].value);
	});

	it('name abbr: World War II', function() {
		const concepts = parser.parse({
			text: 'World War II mistakes and Atom War I',
			lang: 'en'
		});
		assert.equal(2, concepts.length);
		assert.equal('World War II', concepts[0].value);
		assert.equal('Atom War I', concepts[1].value);
	});

	it('parse 100 times', function() {
		this.timeout(500);
		for (let i = 0; i < 100; i++) {
			parser.parse({
				text: 'Președintele Partidului Democrat, Marian Lupu dă de înțeles într-un interviu acordat Infotag că urmează să vadă în ce măsură președintele Nicolae Timofti s-ar afla în capitivitate.\nDe asemenea, Marian Lupu susține că acesta ar face un joc murdar și vrea să ducă țara în haos.\n„Problema nu este însa Sturza, nu el este subiectul, ci PLDM şi preşedintele Timofti, care dacă vor face un astfel de joc murdar, practic aruncă ţara într-un haos total. Când noi ne-am dus la preşedinte şi i-am spus clar că avem voturile să desemnăm premierul şi să facem guvern pro european, el nesocoteşte această propunere şi vine cu o candidatură care nu adună mai mult de 10 voturi, înseamnă că în mod premeditat, conştient, el aruncă ţara într-o criză totală, o pune în pericol. Şi atunci urmează să vedem în ce măsură preşedintele Timofti este captiv, cum cei care îl presează au luat în captivitate instituţia prezidenţială, pentru că deja discutăm inclusiv de o problemă de securitate naţională. Iar răspunderea o vor purta şi regizorii, dar şi executanţii”, afirmă Lupu.\nTotodată, liderul PD este convins că președintele va aduce țara la alegeri anticipate.\n„După ce preşedintele va face o nominalizare împotriva întregului Parlament aproape, după ce va bloca definitiv negocierile dintre partidele pro europene, după ce va arunca ţara în anticipate, vom avea un preşedinte responsabil direct de declanşarea anticipatelor şi criza pe care o provoacă. Iar un preşedinte care face asta fiind conştient de situaţia dezastruoasă pe care o creează, nu mai reprezintă ţara, ci un partid sau un grup de interese‎. Vom avea un preşedinte aflat în captivitate şi va trebuie să găsim în primul rând soluţii să scoatem instutuţia prezidenţială din captivitatea în care este. Soluţii sunt sigur că sunt, dar să nu anticipăm acum care vor fi acestea”, mai adaugă liderul PD.\nUNIMEDIA amintește că PLDM respinge acuzațiile că liberal-democrații ar avea înțelegeri cu șeful statului, Nicolae Timofti, cu privire la candidatul la funcția de prim-ministru.\nPreședintele Nicolae Timofti nu a comentat deocamdată situația. ',
				lang: 'ro',
				country: 'md'
			});
		}
	});
});
