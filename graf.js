function reach(g, tree, s, skip) {
    const adj = g.V.map(() => []);
    tree.forEach(i => {
        if (i !== skip) {
            const [u, v] = g.E[i];
            adj[u].push(v);
            adj[v].push(u)
        }
    });
    const seen = new Set([s]),
        q = [s];
    while (q.length) {
        const u = q.pop();
        adj[u].forEach(v => {
            if (!seen.has(v)) {
                seen.add(v);
                q.push(v)
            }
        })
    }
    return seen;
}

function cutOf(g, tree, i) {
    const S = reach(g, tree, g.E[i][0], i);
    return {
        S,
        edges: g.E.map((e, k) => k).filter(k => S.has(g.E[k][0]) !== S.has(g.E[k][1]))
    };
}

const cong = (g, tree, i) => cutOf(g, tree, i).edges.length;
const maxCong = (g, tree) => Math.max(...tree.map(i => cong(g, tree, i)));

function solve(g) {
    const n = g.V.length,
        m = g.E.length;
    let best = Infinity,
        bestTree = [],
        count = 0;
    const find = (p, x) => {
        while (p[x] !== x) x = p[x];
        return x
    };
    (function rec(i, chosen, p) {
        if (chosen.length === n - 1) {
            count++;
            const c = maxCong(g, chosen);
            if (c < best) {
                best = c;
                bestTree = chosen.slice()
            }
            return
        }
        if (i === m || m - i < n - 1 - chosen.length) return;
        const [u, v] = g.E[i], ru = find(p, u), rv = find(p, v);
        if (ru !== rv) {
            const p2 = p.slice();
            p2[ru] = rv;
            chosen.push(i);
            rec(i + 1, chosen, p2);
            chosen.pop()
        }
        rec(i + 1, chosen, p);
    })(0, [], g.V.map((_, i) => i));
    return {
        best,
        bestTree,
        count
    };
}