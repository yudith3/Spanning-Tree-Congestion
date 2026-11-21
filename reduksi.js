const NV = 12,
	K = 100; 
const $ = id => document.getElementById(id);
const C = [];
[
	[0, 1],
	[2, 3],
	[4, 5],
	[6, 7],
	[8, 9],
	[10, 11]
].forEach(v => C.push({
	t: 'g',
	v
})); 
[
	[1, 2],
	[3, 4],
	[5, 6],
	[7, 8],
	[9, 10],
	[11, 0]
].forEach(v => C.push({
	t: 'a',
	v
})); 
[
	[0, 2, 5],
	[4, 6, 9],
	[8, 11, 1],
	[10, 3, 7]
].forEach(v => C.push({
	t: 'b',
	v
}));
const cnt = {
	g: 0,
	a: 0,
	b: 0
};
C.forEach(c => {
	cnt[c.t]++;
	c.n = ({
		g: '2P',
		a: '2N',
		b: '3P'
	})[c.t] + cnt[c.t]
});
const vn = i => 1 + i,
	cn = j => 13 + j;
const g = {
		V: Array(13 + C.length)
			.fill(0),
		E: []
	},
	M = [];

function add(u, v, w1, w2, extra) {
	g.E.push([u, v]);
	M.push({
		w1,
		w2,
		...extra
	})
}
for (let i = 0; i < NV; i++) add(0, vn(i), 1, K - 5, {
	rx: i
});
C.forEach((c, j) => {
	c.v.forEach(x => add(vn(x), cn(j), 1, 1, {
		c: j,
		x
	})); 
	const roots = {
		g: 1,
		a: 2,
		b: 0
	} [c.t]; 
	for (let r = 0; r < roots; r++) add(0, cn(j), 1, K - 1, {});
});
let att = [];
const inTree = m => m.rx !== undefined || (m.c !== undefined && att[m.c] === m.x);
const treeEdges = () => M.map((m, k) => k)
	.filter(k => inTree(M[k]));
function kongestiAkar(i) {
	const S = reach(g, treeEdges(), vn(i), i); 
	let s = 0;
	g.E.forEach(([u, v], k) => {
		if (S.has(u) !== S.has(v)) s += k === i ? M[k].w2 : M[k].w1
	});
	return s;
}

function dariPenugasan(val) {
	att = C.map(c => {
		const x = c.v.find(x => c.t === 'a' ? !val[x] : val[x]);
		return x === undefined ? c.v[0] : x
	});
}
const vx = i => 34 + i * 56,
	cx = j => 34 + j * 40.7;
const label = d => d === 0 ? 'K' : d > 0 ? 'K+' + d : 'K\u2212' + (-d);

function render() {
	const cg = [...Array(NV)
		.keys()
	].map(kongestiAkar);
	let h = '';
	for (let i = 0; i < NV; i++) h += `<line x1="340" y1="28" x2="${vx(i)}" y2="100" stroke="var(--sub)" stroke-width="0.8"/>`;
	M.forEach(m => {
		if (m.c === undefined) return;
		const t = att[m.c] === m.x;
		h += `<line x1="${vx(m.x)}" y1="114" x2="${cx(m.c)}" y2="238" stroke="${t?'var(--tree)':'var(--line)'}" stroke-width="${t?2.5:1}"/>`;
	});
	h += `<rect x="316" y="14" width="48" height="26" rx="6" fill="var(--paper)" stroke="var(--sub)"/><text x="340" y="31" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">Akar</text>`;
	for (let i = 0; i < NV; i++) {
		const bad = cg[i] > K;
		h += `<circle cx="${vx(i)}" cy="100" r="14" fill="var(--paper)" stroke="${bad?'var(--cut)':'var(--sub)'}" stroke-width="${bad?2.5:1.5}"/>`;
		h += `<text x="${vx(i)}" y="104" text-anchor="middle" font-size="12" font-weight="600" fill="var(--ink)">x${i}</text>`;
		h += `<text x="${vx(i)}" y="134" text-anchor="middle" font-size="11" font-weight="600" fill="${bad?'var(--cut)':'var(--sub)'}">${label(cg[i]-K)}</text>`;
	}
	C.forEach((c, j) => {
		const col = c.t === 'a' ? 'var(--neg)' : 'var(--tree)';
		h += `<rect data-c="${j}" x="${cx(j)-17}" y="238" width="34" height="22" rx="5" fill="var(--paper)" stroke="${col}" stroke-width="1.5" style="cursor:pointer"/>`;
		h += `<text x="${cx(j)}" y="253" text-anchor="middle" font-size="11" font-weight="600" fill="${col}" style="pointer-events:none">${c.n}</text>`;
	});
	$('s')
		.innerHTML = h;
	const val = [],
		conf = [];
	for (let i = 0; i < NV; i++) {
		const A = C.filter((c, j) => att[j] === i);
		const neg = A.some(c => c.t === 'a'),
			pos = A.some(c => c.t !== 'a');
		conf[i] = neg && pos;
		val[i] = !neg;
	}
	const sat = C.every(c => c.t === 'a' ? c.v.some(x => !val[x]) : c.v.some(x => val[x]));
	$('chips')
		.innerHTML = val.map((v, i) => `<span class="${conf[i]?'conf':''}">x${i} = ${conf[i]?'konflik':v?'benar':'salah'}</span>`)
		.join('');
	const ok = cg.every(c => c <= K),
		mx = Math.max(...cg) - K;
	$('verdict')
		.className = 'verdict ' + (ok ? 'ok' : 'bad');
	$('verdict')
		.textContent = ok ? `Semua sisi akar-variabel \u2264 K. Penugasan turunan ${sat?'memenuhi':'belum memenuhi'} \u03d5.` : `Kongesti maksimum K+${mx}: pohon ini melanggar batas K. Lihat variabel bertanda merah.`;
}
$('s')
	.addEventListener('click', e => {
		const j = e.target.dataset.c;
		if (j === undefined) return;
		const c = C[+j],
			k = c.v.indexOf(att[+j]);
		att[+j] = c.v[(k + 1) % c.v.length];
		render();
	});
$('b0')
	.onclick = () => {
		dariPenugasan([...Array(NV)].map((_, i) => i % 2 === 0));
		render()
	};
$('b1')
	.onclick = () => {
		dariPenugasan([...Array(NV)].map((_, i) => i % 2 === 1));
		render()
	};
$('b2')
	.onclick = () => {
		att = C.map(c => c.v[Math.floor(Math.random() * c.v.length)]);
		render()
	};
dariPenugasan([...Array(NV)].map((_, i) => i % 2 === 0));
render();