
import { parse } from './parse';
import test from 'ava';

test('simple concepts', t => {
	const concepts = parse({
		text: `Europa este un continent. R. Moldova este parte din Europa.`,
		lang: 'ro'
	});
	// console.log(concepts);
	t.is(3, concepts.length);
	t.is('Europa', concepts[0].value);
	t.is('R. Moldova', concepts[1].value);
	t.is('Europa', concepts[2].value);
});

test('text end concept', t => {
	const concepts = parse({
		text: `R. Moldova este parte din UE`,
		lang: 'ro'
	});
	// console.log(concepts);
	t.is(2, concepts.length);
	t.is('R. Moldova', concepts[0].value);
	t.is('UE', concepts[1].value);
});

test('word spaces', t => {
	const concepts = parse({
		text: `sometimes called Bosnia  Herzegovina or Bosnia & Herzegovina`,
		lang: 'en'
	});
	// console.log(concepts);
	t.is(3, concepts.length);
	t.is('Bosnia', concepts[0].value);
	t.is('Herzegovina', concepts[1].value);
	t.is('Bosnia & Herzegovina', concepts[2].value);
});

test('connect words: Bosnia and Herzegovina', t => {
	const concepts = parse({
		text: 'sometimes called Bosnia-Herzegovina or Bosnia & Herzegovina, abbreviated BiH or B&H, and, in short, often known informally as Bosnia, is a country in Southeastern Europe located on the Balkan Peninsula',
		lang: 'en'
	});
	// console.log(concepts);
	t.is(7, concepts.length);
	t.is('Bosnia-Herzegovina', concepts[0].value);
});

test('connect with number: Eurovision 2016', t => {
	const concepts = parse({
		text: 'La Eurovision 2016 vor concura 10 participanti.',
		lang: 'ro'
	});
	// console.log(concepts);
	t.is(1, concepts.length);
	t.is('Eurovision 2016', concepts[0].value);
});

test('invalid connect with 2 numbers: Eurovision 2016 18', t => {
	const concepts = parse({
		text: 'La Eurovision 2016 18 vor concura 10 participanti.',
		lang: 'ro'
	});
	// console.log(concepts);
	t.is(1, concepts.length);
	t.is('Eurovision 2016', concepts[0].value);
});

test('invalid connect with numbers: 2016 Eurovision', t => {
	const concepts = parse({
		text: '2016 Eurovision 2016 18 vor concura 10 participanti. 200 Eurovision',
		lang: 'ro'
	});
	// console.log(concepts);
	t.is(2, concepts.length);
	t.is('Eurovision 2016', concepts[0].value);
	t.is('Eurovision', concepts[1].value);
});

test('invalid concepts without letters', t => {
	const concepts = parse({
		text: '2016. Eurovision 2016 18 vor concura 10.2 participanti Eu 200. Eurovision',
		lang: 'ro'
	});
	// console.log(concepts);
	t.is(3, concepts.length);
	t.is('Eurovision 2016', concepts[0].value);
	t.is('Eu 200', concepts[1].value);
	t.is('Eurovision', concepts[2].value);
});

test('name abbr: B. Obama', t => {
	const concepts = parse({
		text: 'V. Filat a fost retinut.',
		lang: 'ro'
	});
	t.is(1, concepts.length);
	t.is('V. Filat', concepts[0].value);
});

test('name abbr: V. V. Putin', t => {
	const concepts = parse({
		text: 'V. V. Putin este presedintele Rusiei.',
		lang: 'ro'
	});
	t.is(2, concepts.length);
	t.is('V. V. Putin', concepts[0].value);
	t.is('Rusiei', concepts[1].value);
});

test('name abbr: VV Putin', t => {
	const concepts = parse({
		text: 'VV Putin este presedintele Rusiei.',
		lang: 'ro'
	});
	t.is(2, concepts.length);
	t.is('VV Putin', concepts[0].value);
});

test('name abbr: Putin V.', t => {
	const concepts = parse({
		text: 'Putin V. este presedintele Rusiei.',
		lang: 'ro'
	});
	t.is(2, concepts.length);
	t.is('Putin V.', concepts[0].value);
});

test('name abbr: World War II', t => {
	const concepts = parse({
		text: 'World War II mistakes and Atom War I',
		lang: 'en'
	});
	t.is(2, concepts.length);
	t.is('World War II', concepts[0].value);
	t.is('Atom War I', concepts[1].value);
});

test('quotes on word', t => {
	const concepts = parse({
		text: 'I know "SomeoneNew"',
		lang: 'en'
	});
	t.is(1, concepts.length);
	t.is('SomeoneNew', concepts[0].value);
});

test('quotes some words', t => {
	const concepts = parse({
		text: 'I know "Someone Big"',
		lang: 'en'
	});
	t.is(1, concepts.length);
	t.is('Someone Big', concepts[0].value);
});

test('first quotes some words', t => {
	const concepts = parse({
		text: 'I know "SomeoneNew big"',
		lang: 'en'
	});
	t.is(1, concepts.length);
	t.is('SomeoneNew', concepts[0].value);
});

test('Russian quotes', t => {
	const concepts = parse({
		text: `«Сегодня в пункте пропуска «Новые Яриловичи» во время прохождения пограничного контроля попросил политического убежища гражданин России. Он обратился к пограничникам Черниговского отряда с заявлением о получении статуса беженца на территории Украины в связи с политическим преследованием в России», — сообщила Погранслужба Украины.`,
		lang: 'ru'
	});
	// console.log(concepts);
	t.is(6, concepts.length);
	t.is('Новые Яриловичи', concepts[0].value);
});

test('parse 100 times', t => {
	const startTime = Date.now()
	for (let i = 0; i < 100; i++) {
		parse({
			text: 'Președintele Partidului Democrat, Marian Lupu dă de înțeles într-un interviu acordat Infotag că urmează să vadă în ce măsură președintele Nicolae Timofti s-ar afla în capitivitate.\nDe asemenea, Marian Lupu susține că acesta ar face un joc murdar și vrea să ducă țara în haos.\n„Problema nu este însa Sturza, nu el este subiectul, ci PLDM şi preşedintele Timofti, care dacă vor face un astfel de joc murdar, practic aruncă ţara într-un haos total. Când noi ne-am dus la preşedinte şi i-am spus clar că avem voturile să desemnăm premierul şi să facem guvern pro european, el nesocoteşte această propunere şi vine cu o candidatură care nu adună mai mult de 10 voturi, înseamnă că în mod premeditat, conştient, el aruncă ţara într-o criză totală, o pune în pericol. Şi atunci urmează să vedem în ce măsură preşedintele Timofti este captiv, cum cei care îl presează au luat în captivitate instituţia prezidenţială, pentru că deja discutăm inclusiv de o problemă de securitate naţională. Iar răspunderea o vor purta şi regizorii, dar şi executanţii”, afirmă Lupu.\nTotodată, liderul PD este convins că președintele va aduce țara la alegeri anticipate.\n„După ce preşedintele va face o nominalizare împotriva întregului Parlament aproape, după ce va bloca definitiv negocierile dintre partidele pro europene, după ce va arunca ţara în anticipate, vom avea un preşedinte responsabil direct de declanşarea anticipatelor şi criza pe care o provoacă. Iar un preşedinte care face asta fiind conştient de situaţia dezastruoasă pe care o creează, nu mai reprezintă ţara, ci un partid sau un grup de interese‎. Vom avea un preşedinte aflat în captivitate şi va trebuie să găsim în primul rând soluţii să scoatem instutuţia prezidenţială din captivitatea în care este. Soluţii sunt sigur că sunt, dar să nu anticipăm acum care vor fi acestea”, mai adaugă liderul PD.\nUNIMEDIA amintește că PLDM respinge acuzațiile că liberal-democrații ar avea înțelegeri cu șeful statului, Nicolae Timofti, cu privire la candidatul la funcția de prim-ministru.\nPreședintele Nicolae Timofti nu a comentat deocamdată situația. ',
			lang: 'ro',
			country: 'md'
		});
	}
	const endTime = Date.now();
	const time = endTime - startTime;
	t.log(`Parsed 100 texts in ${time}ms`)
	t.true(time < 500);
});

test('Place "Person Name"', t => {
	const concepts = parse({
		text: 'Azi la liceul Ion Creanga va...',
		lang: 'ro',
		country: 'md'
	});
	t.is(concepts.length, 1);
	t.is(concepts[0].value, 'liceul Ion Creanga');
	t.is(concepts[0].type, undefined);
});
