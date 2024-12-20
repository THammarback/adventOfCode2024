import { preParse } from "./tools.ts";

const example = `###############
#...#...#.....#
#.#.#.#.#.###.#
#S#...#.#.#...#
#######.#.#.###
#######.#.#...#
#######.#.###.#
###..E#...#...#
###.#######.###
#...###...#...#
#.#####.#.###.#
#.#...#.#.#...#
#.#.#.#.#.#.###
#...#...#...###
###############`

type Pos = {x:number,y:number}
type posStr = `${number},${number}`
const p2s = ({x,y}:Pos):posStr => `${x},${y}`
const s2p = (s:posStr):Pos => {const [x,y] = s.split(',').map(Number); return {x,y}}

function parse(input:string){
    let start:Pos|undefined
    let end:Pos|undefined
    const map = preParse(input, (c, [y, x])=> {
        if(c==='S'){
            start = {x,y}
        }else if(c==='E'){
            end = {x,y}
        }
        return c !== '#'
    }, '\n', '')
    if(start === undefined || end === undefined){
        throw Error("no start or end found")
    }
    return {start, end, map}
}
function* cabDistanceGenerator({x,y}:Pos, N:number) {
    for (let d = 1; d <= N; d++) {
        for (let i = 0; i <= d; i++) {
            const j = d - i;
            yield {x: x + i, y: y + j, d};
            if (i !== 0) yield {x: x - i, y: y + j, d};
            if (j !== 0) yield {x: x + i, y: y - j, d};
            if (i !== 0 && j !== 0) yield {x: x - i, y: y - j, d};
        }
    }
}


function findPath(map: boolean[][], start:Pos, end:Pos): Map<posStr, number>{
    const options = ({x,y}:Pos):Pos[] => [{x:x+1,y},{x:x-1,y},{x,y:y+1},{x,y:y-1}]
    const result:Map<posStr, number> = new Map()
    let curr = start
    let last = start
    let i=0
    while(curr.x !== end.x || curr.y !== end.y){
        result.set(p2s(curr), i++);
        [last, curr] = [curr, options(curr).find(({x,y})=> map[y][x] && (x!==last.x || y!==last.y))!];
        
    }
    result.set(p2s(end), i)
    return result
}


function solve(input:string, distance: number, limit:number): number{
    const {map, start, end} = parse(input)
    const path = findPath(map, start, end)
    let count = 0
    for(const [strPos, t1] of path){
        for(const {x,y,d} of cabDistanceGenerator(s2p(strPos), distance)){
            const t2 = path.get(p2s({x,y}))!
            if(map.at(y)?.at(x) && t2-t1-d >= limit){
                count += 1
            }
            
        }
    }
    return count
}

console.log("Part 1:", solve(example, 2, 1))
console.log("Part 1:", solve(Deno.readTextFileSync('./day20.txt'), 2, 100))
console.log("Part 2:", solve(example, 20, 50))
console.log("Part 2:", solve(Deno.readTextFileSync('./day20.txt'), 20, 100))
