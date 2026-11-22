const pc = x => {
	let c = 0;
	while (x) {
		c += x & 1;
		x >>= 1
	}
	return c
};
const lg = x => 31 - Math.clz32(x);
const bit = (m, v) => (m >> v) & 1;

function analyze(n, E) {
	const nb = Array(n).fill(0),
		deg = Array(n).fill(0);
	E.forEach(([u, v]) => {
		nb[u] |= 1 << v;
		nb[v] |= 1 << u;
		deg[u]++;
		deg[v]++
	});
	const full = (1 << n) - 1;
	const bnd = S => E.reduce((m, [u, v]) => bit(S, u) !== bit(S, v) ? m | (1 << u) | (1 << v) : m, 0);
	const sz = [];
	let K = 1e9;
	for (let S = 1; S < full; S++) {
		sz[S] = E.reduce((c, [u, v]) => c + (bit(S, u) !== bit(S, v)), 0);
		K = Math.min(K, sz[S]);
	}
	if (K % 2 === 0) return {
		K,
		unsupported: true,
		rows: []
	};
	const r = deg.indexOf(K);
	if (r < 0) return {
		K,
		r,
		yes: false,
		rows: []
	};
	const fam = new Set();
	for (let S = 1; S < full; S++)
		if (sz[S] === K) fam.add(bit(S, r) ? full ^ S : S);
	const Zs = [...fam].sort((a, b) => pc(a) - pc(b) || a - b);
	const H = new Map(),
		rows = [];
	for (const Z of Zs) {
		const sub = Zs.filter(Y => Y !== Z && (Y & Z) === Y);
		const kids = sub.filter(Y => !sub.some(X => X !== Y && (Y & X) === Y));
		const own = Z & ~kids.reduce((a, Y) => a | Y, 0),
			bd = bnd(Z);
		if (pc(own) > 1) return {
			K,
			r,
			yes: false,
			rows
		}; 
		let type, h;
		if (!kids.length) { 
			type = 'ext';
			h = (1 << lg(own)) | nb[lg(own)];
		}
		else if (own) { 
			type = 't1';
			const v = lg(own),
				I = kids.reduce((a, Y) => a & H.get(Y), full);
			h = bit(I, v) ? (1 << v) | (nb[v] & ~Z) : 0;
		}
		else {
			type = 't0';
			const I = kids.reduce((a, Y) => a & H.get(Y), bd);
			let N = 0;
			for (let v = 0; v < n; v++)
				if (bit(I & Z, v)) N |= nb[v];
			h = I | (N & ~Z);
		}
		H.set(Z, h);
		rows.push({
			Z,
			type,
			h
		});
	}
	return {
		K,
		r,
		rows,
		yes: !!bit(H.get(full ^ (1 << r)), r)
	}; 
}

const ring = (r, a0, c) => [...Array(c)].map((_, i) => {
	const a = (a0 + 360 * i / c) * Math.PI / 180;
	return [200 + r * Math.cos(a), 150 + r * Math.sin(a)];
});
const P = {
	'K4': {
		E: [
			[0, 1],
			[0, 2],
			[0, 3],
			[1, 2],
			[1, 3],
			[2, 3]
		],
		pos: ring(105, -90, 4)
	},
	'Prisma': {
		E: [
			[0, 1],
			[1, 2],
			[2, 0],
			[3, 4],
			[4, 5],
			[5, 3],
			[0, 3],
			[1, 4],
			[2, 5]
		],
		pos: [...ring(115, -90, 3), ...ring(55, -90, 3)]
	},
	'K3,3': {
		E: [
			[0, 3],
			[0, 4],
			[0, 5],
			[1, 3],
			[1, 4],
			[1, 5],
			[2, 3],
			[2, 4],
			[2, 5]
		],
		pos: [
			[100, 70],
			[200, 70],
			[300, 70],
			[100, 230],
			[200, 230],
			[300, 230]
		]
	},
	'Kubus': {
		E: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 0],
			[4, 5],
			[5, 6],
			[6, 7],
			[7, 4],
			[0, 4],
			[1, 5],
			[2, 6],
			[3, 7]
		],
		pos: [...ring(125, -135, 4), ...ring(62, -135, 4)]
	},
	'Roda W5': {
		E: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 4],
			[4, 0],
			[5, 0],
			[5, 1],
			[5, 2],
			[5, 3],
			[5, 4]
		],
		pos: [...ring(115, -90, 5), [200, 150]]
	},
	'Petersen': {
		E: [
			[0, 1],
			[1, 2],
			[2, 3],
			[3, 4],
			[4, 0],
			[5, 7],
			[7, 9],
			[9, 6],
			[6, 8],
			[8, 5],
			[0, 5],
			[1, 6],
			[2, 7],
			[3, 8],
			[4, 9]
		],
		pos: [...ring(125, -90, 5), ...ring(62, -90, 5)]
	}
};
const $ = id => document.getElementById(id);
const L = 'ABCDEFGHIJ';
const TY = {
	ext: 'Eksternal (Lemma 5.7)',
	t1: 'Tipe-1 (Lemma 5.9)',
	t0: 'Tipe-0 (Lemma 5.13)'
};
let cur, A, s, n, brute;
const names = m => m ? '{' + [...Array(n).keys()].filter(v => bit(m, v)).map(v => L[v]).join(', ') + '}' : '\u2205';

function load(k) {
	cur = P[k];
	n = cur.pos.length;
	A = analyze(n, cur.E);
	s = 0;
	brute = solve({
		V: Array(n).fill(0),
		E: cur.E
	}).best; 
	$('info').textContent = `K = ${A.K}, akar r = ${L[A.r]} (derajat K), ${A.rows.length} potongan basic`;
	$('xc').textContent = `Cek silang dengan Modul 1 (brute force): stc(G) = ${brute}`;
	render();
}

function render() {
	const R = A.rows,
		c = R[s],
		Z = c.Z,
		h = c.h;
	let g = '';
	cur.E.forEach(([u, v]) => {
		const [a, b] = cur.pos[u], [x, y] = cur.pos[v], cut = bit(Z, u) !== bit(Z, v);
		g += `<line x1="${a}" y1="${b}" x2="${x}" y2="${y}" stroke="${cut?'var(--cut)':'var(--sub)'}" stroke-opacity="${cut?1:.5}" stroke-width="${cut?3:1.5}"/>`;
	});
	cur.pos.forEach(([x, y], v) => {
		const inZ = bit(Z, v),
			hub = bit(h, v),
			col = inZ ? 'var(--tree)' : 'var(--sub)';
		if (hub) g += `<circle cx="${x}" cy="${y}" r="21" fill="none" stroke="var(--b)" stroke-width="2.5"${inZ?'':' stroke-dasharray="4 3"'}/>`;
		g += `<circle cx="${x}" cy="${y}" r="15" fill="var(--paper)" stroke="${col}" stroke-width="${inZ?3:1.5}"/>`;
		g += `<text x="${x}" y="${y+4}" text-anchor="middle" font-size="13" font-weight="600" fill="${inZ?'var(--tree)':'var(--ink)'}">${L[v]}</text>`;
		if (v === A.r) g += `<text x="${x+18}" y="${y-14}" font-size="12" font-weight="600" fill="var(--sub)">r</text>`;
	});
	$('m3').innerHTML = g;
	$('list').innerHTML = R.slice(0, s + 1).map((q, i) => `<div class="step${i===s?' cur':''}"><b>${i+1}.</b> Z = ${names(q.Z)}<br>${TY[q.type]}<br>H(Z) = ${names(q.h)}</div>`).join('');
	$('list').scrollTop = $('list').scrollHeight;
	const end = s === R.length - 1,
		v = $('vd');
	v.className = 'verdict' + (end ? (A.yes ? ' ok' : ' bad') : '');
	v.textContent = end ? (A.yes ? `r \u2208 H(V\u2216{r}): ya. Maka stc(G) = K = ${A.K}.` : `r \u2209 H(V\u2216{r}): tidak. Maka stc(G) > K = ${A.K}.`) : `Langkah ${s+1} dari ${R.length}. Maju sampai akhir untuk melihat keputusan.`;
	$('bp').disabled = s === 0;
	$('bn').disabled = end;
}
$('bp').onclick = () => {
	s--;
	render()
};
$('bn').onclick = () => {
	s++;
	render()
};
$('ba').onclick = () => {
	s = A.rows.length - 1;
	render()
};
$('gs').onchange = e => load(e.target.value);
Object.keys(P).forEach(k => $('gs').add(new Option(k, k)));
load('Prisma');