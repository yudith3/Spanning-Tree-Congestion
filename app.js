function complete(n) {
    const V = [],
        E = [];
    for (let i = 0; i < n; i++) {
        const a = 2 * Math.PI * i / n - Math.PI / 2;
        V.push([200 + 110 * Math.cos(a), 150 + 110 * Math.sin(a)])
    }
    for (let i = 0; i < n; i++)
        for (let j = i + 1; j < n; j++) E.push([i, j]);
    return {
        V,
        E
    };
}

function grid(r, c) {
    const V = [],
        E = [];
    for (let i = 0; i < r; i++)
        for (let j = 0; j < c; j++) {
            V.push([80 + j * 120, 50 + i * 100]);
            const k = i * c + j;
            if (j < c - 1) E.push([k, k + 1]);
            if (i < r - 1) E.push([k, k + c]);
        }
    return {
        V,
        E
    };
}

const GRAPHS = {
    '6 simpul': {
        V: [
            [70, 60],
            [200, 35],
            [330, 60],
            [70, 235],
            [200, 265],
            [330, 235]
        ],
        E: [
            [0, 1],
            [1, 2],
            [3, 4],
            [4, 5],
            [0, 3],
            [2, 5],
            [1, 4],
            [0, 4],
            [1, 5]
        ]
    },
    'K4': complete(4),
    'K5': complete(5),
    'K6': complete(6),
    'Grid 3x3': grid(3, 3)
};

function parseGraph(text) {
    const toks = text.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean);
    if (!toks.length) throw new Error('Tulis minimal satu sisi, misalnya A-B.');
    const idx = new Map(),
        names = [],
        E = [],
        seen = new Set();
    for (const t of toks) {
        const p = t.split(/[\s\-\u2013]+/).filter(Boolean);
        if (p.length !== 2) throw new Error(`Sisi "${t}" tidak dikenali. Tulis dua simpul, misalnya A-B.`);
        if (p.some(x => x.length > 3)) throw new Error('Nama simpul maksimal 3 karakter.');
        if (p[0] === p[1]) throw new Error(`Sisi "${t}" menghubungkan simpul ke dirinya sendiri.`);
        const ids = p.map(x => {
            if (!idx.has(x)) {
                idx.set(x, names.length);
                names.push(x)
            }
            return idx.get(x)
        });
        const key = ids.slice().sort((x, y) => x - y).join('-');
        if (seen.has(key)) continue;
        seen.add(key);
        E.push(ids);
    }
    if (names.length > 12) throw new Error('Maksimal 12 simpul.');
    if (E.length > 18) throw new Error('Maksimal 18 sisi agar pencarian optimal tetap cepat.');
    const n = names.length;
    const V = names.map((_, i) => {
        const a = 2 * Math.PI * i / n - Math.PI / 2;
        return [200 + 110 * Math.cos(a), 150 + 110 * Math.sin(a)]
    });
    const g = {
        V,
        E,
        names
    };
    if (reach(g, E.map((_, i) => i), 0, -1).size !== n) throw new Error('Graf harus terhubung agar punya pohon rentang.');
    return g;
}

const $ = id => document.getElementById(id);
const svg = $('g');
let g, tree, hov, opt;

function load(name) {
    g = GRAPHS[name];
    opt = solve(g);
    tree = [];
    hov = -1;
    $('opt').textContent = opt.best;
    $('count').textContent = `${g.V.length} simpul, ${g.E.length} sisi, ${opt.count} pohon rentang.`;
    say(`Pilih ${g.V.length-1} sisi yang membentuk pohon rentang.`);
    render();
}

const full = () => tree.length === g.V.length - 1;

function say(t) {
    $('msg').textContent = t
}

const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();

function render() {
    const cut = full() && tree.includes(hov) ? cutOf(g, tree, hov) : null;
    const cutSet = new Set(cut ? cut.edges : []);
    let h = '';
    g.E.forEach(([u, v], i) => {
        const [x1, y1] = g.V[u], [x2, y2] = g.V[v], t = tree.includes(i), c = cutSet.has(i);
        const col = c ? 'var(--cut)' : t ? 'var(--tree)' : 'var(--line)';
        h += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${col}" stroke-width="${t?4:c?2.5:1.5}"${t||c?'':' stroke-dasharray="5 4"'}/>`;
        if (full() && t) h += `<text x="${(x1+x2)/2+8}" y="${(y1+y2)/2-6}" font-size="12" font-weight="600" fill="var(--ink)">${cong(g,tree,i)}</text>`;
        h += `<line data-e="${i}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="transparent" stroke-width="16" style="cursor:pointer"/>`;
    });
    g.V.forEach(([x, y], i) => {
        const col = cut ? (cut.S.has(i) ? 'var(--tree)' : 'var(--b)') : 'var(--sub)';
        h += `<circle cx="${x}" cy="${y}" r="15" fill="var(--paper)" stroke="${col}" stroke-width="2"/>`;
        h += `<text x="${x}" y="${y+4}" text-anchor="middle" font-size="13" font-weight="600" fill="${col}">${(g.names?g.names[i]:String.fromCharCode(65+i))}</text>`;
    });
    svg.innerHTML = h;
    const cur = full() ? maxCong(g, tree) : null;
    $('mine').textContent = cur === null ? '–' : cur;
    if (cur !== null) say(cur === opt.best ? 'Optimal: sama dengan stc(G).' : 'Belum optimal. Coba susun ulang pohonnya.');
}

svg.addEventListener('click', e => {
    if (e.target.dataset.e === undefined) return;
    const k = +e.target.dataset.e;
    if (tree.includes(k)) {
        tree = tree.filter(x => x !== k);
        say('Sisi dilepas.')
    }
    else if (full()) say('Pohon sudah lengkap. Lepas satu sisi dulu.');
    else if (reach(g, tree, g.E[k][0], -1).has(g.E[k][1])) say('Sisi itu membentuk siklus. Pilih sisi lain.');
    else {
        tree.push(k);
        say('Sisi ditambahkan.')
    }
    hov = -1;
    render();
});

svg.addEventListener('mouseover', e => {
    const k = e.target.dataset.e === undefined ? -1 : +e.target.dataset.e;
    if (k !== hov) {
        hov = k;
        render()
    }
});

svg.addEventListener('mouseleave', () => {
    if (hov !== -1) {
        hov = -1;
        render()
    }
});

$('solve').onclick = () => {
    tree = opt.bestTree.slice();
    hov = -1;
    render()
};
$('reset').onclick = () => load($('preset').value);
$('preset').onchange = e => load(e.target.value);
$('apply').onclick = () => {
    try {
        GRAPHS['Graf kustom'] = parseGraph($('edges').value);
        if (![...$('preset').options].some(o => o.value === 'Graf kustom')) $('preset').add(new Option('Graf kustom', 'Graf kustom'));
        $('preset').value = 'Graf kustom';
        $('err').textContent = '';
        load('Graf kustom');
    }
    catch (e) {
        $('err').textContent = e.message
    }
};
$('edges').oninput = () => {
    $('err').textContent = ''
};
Object.keys(GRAPHS).forEach(n => $('preset').add(new Option(n, n)));
load(Object.keys(GRAPHS)[0]);