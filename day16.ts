import { preParse, BinaryPriorityHeap} from "./tools.ts";

const example = `
#################
#...#...#...#..E#
#.#.#.#.#.#.#.#.#
#.#.#.#...#...#.#
#.#.#.#.###.#.#.#
#...#.#.#.....#.#
#.#.#.#.#.#####.#
#.#...#.#.#.....#
#.#.#####.#.###.#
#.#.#.......#...#
#.#.###.#####.###
#.#.#...#.....#.#
#.#.#.#####.###.#
#.#.#.........#.#
#.#.#.#########.#
#S#.............#
#################`
function parseInput(data:string):{map:boolean[][], start:{x:number, y:number}, end:{x:number, y:number}}{
    let sx, sy, ey, ex
    const map = preParse(data, ((x, coords) => {
        if(x === 'S'){
            [sy, sx] = coords
            return true
        }
        if(x === 'E'){
            [ey, ex] = coords
            return true
        }
        return x === '.'
    }), '\n', '')
    if(typeof sx  !== "number" || typeof sy  !== "number" || typeof ey !== "number" || typeof ex !== "number"){
        throw Error(`Unknown starting or end positions! ${JSON.stringify({start:{x:sx, y:sy}, end:{x:ex, y:ey}})}`)
    }
    return {map, start:{x:sx, y:sy}, end:{x:ex, y:ey}}
}

function Astar<T>(getCost:(option:T, curr:T) => number, start:T, toString:(x:T)=>string, stop:(x:T)=>boolean, options:(x:T) => T[]):[T, Map<string, {cost: number, camefrom: string}>]{
    const list = new BinaryPriorityHeap<{prio:number, value:T}>((e1, e2)=>e1.prio-e2.prio)
    list.add({prio:0, value:start})
    const costMap = new Map<string, {cost:number, camefrom:string}>()
    costMap.set(toString(start), { cost: 0, camefrom: '' });

    while(list.length){
        const curr = list.pop()!
        if(stop(curr.value)){
            return [curr.value, costMap]
        }
        const currCost = costMap.get(toString(curr.value))?.cost
        if(currCost === undefined){
            throw Error("")
        }
        for (const option of options(curr.value)) {
            const optionCost = currCost + getCost(option, curr.value);
            const existingCost = costMap.get(toString(option))?.cost ?? Infinity
            if (optionCost < existingCost) {
                costMap.set(toString(option), { cost: optionCost, camefrom: toString(curr.value) });
                list.add({prio:optionCost, value:option})
            }
        }
    }
    throw Error("End not found")
}

function part1(data:string){
    const {map, start, end} = parseInput(data)
    const strMap:string[][] = map.map(row => row.map(c => c?'.':'#'))
    const [pos, costMap] = Astar<{x:number, y:number, dir:number}>(
        (option, curr)=> option.dir === curr.dir ? 1 : 1001,
        {...start, dir:0},
        ({x,y})=>`${x},${y}`,
        ({x,y})=>x === end.x && y === end.y,
        ({x, y})=>[{x:x+1, y, dir:0}, {x:x-1, y, dir:2}, {x, y:y+1, dir:1}, {x, y:y-1, dir:3}].filter(({x,y}) => map[y][x])
    )
    let camefrom:string = `${pos.x},${pos.y}`
    const finalCost = costMap.get(camefrom)?.cost
    while(costMap.has(camefrom)){
        const [x,y] = camefrom.split(',').map(Number)
        strMap[y][x] = '*'
        camefrom = costMap.get(camefrom)!.camefrom
    }
    return [strMap.map(x =>x.join('')).join('\n'), finalCost]
}

// console.log(...part1(example))
console.log(...part1(Deno.readTextFileSync('./day16.txt')))
