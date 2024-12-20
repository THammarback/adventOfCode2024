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

type Pos = {x:number, y:number}
type PosStr = `${number},${number}`

function p2s({x,y}:Pos):PosStr{
  return `${x},${y}`
}
function parse(input:string){
  let start:Pos|undefined 
  let end:Pos|undefined 
  const map = preParse(input, (el, [y, x]) => {
    if(el === 'S'){
      start = {x,y}
    } else if(el === 'E'){
      end = {x,y}
    }
    return el !== '#'
  }, '\n', '')
  if(start === undefined || end === undefined){
    throw Error("No start or end found")
  }
  return {map, start, end}
}

type Dir = 'N'|'E'|'S'|'W'
type Loc = Pos & {dir:Dir}
type LocStr = `${number},${number},${Dir}`

function l2s({x,y,dir}:Loc):LocStr{
  return `${x},${y},${dir}`
}

function solve(map:boolean[][], start:Pos){
  function inBounds({x,y}:Pos){
    return x >= 0 && y >= 0 && y < map.length && x < map[y].length
  }

  const getNeighbours = ({x, y, dir}:Loc): {el:Loc, cost:number}[] => {
    const directions:Record<Dir, Record<'left'|'right'|'forward',Dir>> = {
      'N': { left: 'W', right: 'E', forward: 'N' },
      'E': { left: 'N', right: 'S', forward: 'E' },
      'S': { left: 'E', right: 'W', forward: 'S' },
      'W': { left: 'S', right: 'N', forward: 'W' }
    };

    const moves:Record<Dir, Pos> = {
      'N': { x: 0, y: -1 },
      'E': { x: 1, y: 0 },
      'S': { x: 0, y: 1 },
      'W': { x: -1, y: 0 }
    };

    return [
      {el:{ x: x + moves[directions[dir].left].x, y: y + moves[directions[dir].left].y, dir: directions[dir].left }, cost:1001},
      {el:{ x: x + moves[directions[dir].right].x, y: y + moves[directions[dir].right].y, dir: directions[dir].right }, cost:1001},
      {el:{ x: x + moves[directions[dir].forward].x, y: y + moves[directions[dir].forward].y, dir: directions[dir].forward}, cost:1}
    ].filter(({el:{x,y}})=>inBounds({x,y}) && map[y][x])
  };

  const queue = new BinaryPriorityHeap<{el:Loc, cost:number}>((a, b)=>a.cost-b.cost)
  queue.add({el:{x:start.x, y:start.y, dir:'E'}, cost:0})
  const visited = new Map<LocStr, {camefroms:Loc[], cost:number}>()
  while(queue.length){
    const {el:currentLoc, cost:currentCost} = queue.pop()!
    for(const {el, cost} of getNeighbours(currentLoc)){
      const gotSame = visited.get(l2s(el))
      if(gotSame){
        if(gotSame.cost === cost+currentCost){
          gotSame.camefroms.push(currentLoc)
        }
      }else{
        visited.set(l2s(el), {camefroms: [currentLoc], cost:cost+currentCost})
        queue.add({el, cost:cost+currentCost})
      }
    }
  }
  return visited
}

function part1(input:string){
  const {map, start, end} = parse(input)
  const visited = solve(map, start)
  return visited.get(l2s({x:end.x, y:end.y, dir:'N'}))?.cost
}

function part2(input:string){
  const {map, start, end} = parse(input)
  const visited = solve(map, start)
  const tiles: Set<PosStr> = new Set([p2s(end)])
  const list:Loc[] = [{x:end.x, y:end.y, dir:'N'}]
  while(list.length){
    const current = visited.get(l2s(list.pop()!))
    if(!current){
      continue
    }
    for(const camefrom of current.camefroms){
      tiles.add(p2s(camefrom))
      list.push(camefrom)
    }
  }
  return tiles.size
}

// console.log("Part 1:", part1(example))
console.log("Part 1:", part1(Deno.readTextFileSync('./day16.txt')))
// console.log("Part 2:", part2(example))
console.log("Part 2:", part2(Deno.readTextFileSync('./day16.txt')))