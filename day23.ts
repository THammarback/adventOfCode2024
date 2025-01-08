const example = `kh-tc
qp-kh
de-cg
ka-co
yn-aq
qp-ub
cg-tb
vc-aq
tb-ka
wh-tc
yn-cg
kh-ub
ta-co
de-co
tc-td
tb-wq
wh-td
ta-ka
td-qp
aq-cg
wq-ub
ub-vc
de-ta
wq-aq
wq-vc
wh-yn
ka-de
kh-ta
co-tc
wh-qp
tb-vc
td-yn`.split('\n')

function graphify(pairs:string[]){
    const graph = new Map<string, Set<string>>()
    for(const [c1, c2] of pairs.map(pair => pair.split('-'))){
        graph.set(c1, graph.get(c1)?.add(c2) || new Set([c2]))
        graph.set(c2, graph.get(c2)?.add(c1) || new Set([c1]))
    }
    return graph
}
function increaseClique(graph: Map<string, Set<string>>, cliques:Set<string>): Set<string> {
    const newCliques: Set<string> = new Set();
    for (const cliqueStr of cliques) {
        const clique = cliqueStr.split('-')
        for (const [node] of graph) {
            if (!clique.includes(node)) {
                if (clique.every(neighbor => graph.get(neighbor)?.has(node))) {
                    newCliques.add([...clique, node].sort().join('-'));
                }
            }
        }
    }
    return newCliques
}

function part1(pairs:string[]){
    const graph = graphify(pairs)
    const clique3s = increaseClique(graph, new Set(pairs))
    return [...clique3s].filter(tripplet => tripplet.split('-').some(x => x.startsWith('t'))).length
}

function part2(pairs:string[]){
    const graph = graphify(pairs)
    let current = new Set(pairs)
    let last = current
    while(current.size > 0){
        last = current
        current = increaseClique(graph, current)
    }
    return last.entries().next().value[0].replaceAll('-',',')
}



console.log("part1:", part1(example))
console.log("part1:", part1(Deno.readTextFileSync('./day23.txt').split('\r\n')))
console.log("part2:", part2(example))
console.log("part2:", part2(Deno.readTextFileSync('./day23.txt').split('\r\n')))
