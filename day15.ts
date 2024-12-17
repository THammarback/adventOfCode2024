
const example = `
##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`


const smallExample = `
#######
#...#.#
#.....#
#..OO@#
#..O..#
#.....#
#######

<vv<<^^<<^^`

type Pos = {x:number, y:number}
type strPos = `${number},${number}`
const dirs = ['<', '>', '^', 'v'] as const
type Dir = typeof dirs[number]
function pos2str({x,y}:Pos):strPos {
  return `${x},${y}`
}
function str2pos(str:strPos):Pos{
  const [x,y] = str.split(',').map(Number)
  return {x,y}
}

function move({x,y}:Pos, dir:Dir):Pos{
  switch(dir){
    case '>':
      return {x:x+1, y:y}
    case 'v':
      return {x:x, y:y+1}
    case '<':
      return {x:x-1, y:y}
    case '^':
      return {x:x, y:y-1}
    default:
      throw Error(`Unknown move: <${dir}>`)
  }
}
type id = number
class Crates{

  partsById = new Map<id, Pos[]>()
  partsByPos = new Map<strPos, id>()
  currentId:id = 0

  add(...parts:Pos[]){
    this.partsById.set(this.currentId, parts)
    for(const part of parts){
      this.partsByPos.set(pos2str(part), this.currentId)  
    }
    this.currentId++
  }

  moveById(id:id, dir:Dir){
    return this.partsById.get(id)?.map((pos) => move(pos, dir))
  }
}

function print(width:number, height:number, walls:Iterable<strPos>, crates:Crates, robot?:Pos){
  const ids = "ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvxyz1234567890".split('')
  const newMap:string[][] = []
  for (let y = 0; y < height; y++) {
    newMap[y] = []
    for (let x = 0; x < width; x++) {
      newMap[y][x] = '.'
    }
  }
  for(const [pos, id] of crates.partsByPos){
    const {x, y} = str2pos(pos)
    newMap[y][x] = ids[id%ids.length]
  }
  for(const pos of walls){
    const {x, y} = str2pos(pos)
    newMap[y][x] = '#'
  }
  if(robot){
    const {x, y} = robot
    newMap[y][x] = '@'

  }
  return newMap.map(x => x.join('')).join('\n')
}

function parseInput(input:string){
  const splitter = (input.indexOf('\r')) > -1 ? '\r\n' : '\n'
  const [mapStr, movesStr] = input.split(splitter+splitter)
  const moves = movesStr.split('').filter(x => x === dirs[0] || x === dirs[1] || x === dirs[2] || x === dirs[3])
  const walls = new Set<strPos>()
  const crates = new Crates()
  let robot: Pos|undefined = undefined
  const mapRows = mapStr.split(splitter).filter(x=>x)
  const [width, height] = [mapRows[0].length, mapRows.length]

  for(const [y, row] of mapRows.entries()){
    for(const [x, cell] of row.split('').filter(x=>x).entries()){
      switch(cell){
        case '#':
          walls.add(pos2str({x,y}))
          break
        case 'O':
          crates.add({x,y})
          break
        case '@':
          robot = {x,y}
          break
      }
    }
  }
  if(!robot){
    throw Error("No robot found")
  }
  return {robot, walls, crates, moves, size:{width, height}}
}

function parseInput2(input:string){
  const splitter = (input.indexOf('\r')) > -1 ? '\r\n' : '\n'
  const [mapStr, movesStr] = input.split(splitter+splitter)
  const moves = movesStr.split('').filter(x => x === dirs[0] || x === dirs[1] || x === dirs[2] || x === dirs[3])
  const walls = new Set<strPos>()
  const crates = new Crates()
  let robot: Pos|undefined = undefined
  const mapRows = mapStr.split(splitter).filter(x=>x)
  const [width, height] = [mapRows[0].length*2, mapRows.length]

  for(const [y, row] of mapRows.entries()){
    for(const [x, cell] of row.split('').filter(x=>x).entries()){
      switch(cell){
        case '#':
          walls.add(pos2str({x:x*2,y}))
          walls.add(pos2str({x:x*2+1,y}))
          break
        case 'O':
          crates.add({x:x*2,y}, {x:x*2+1,y})
          break
        case '@':
          robot = {x:x*2,y}
          break
      }
    }
  }
  if(!robot){
    throw Error("No robot found")
  }
  return {robot, walls, crates, moves, size:{width, height}}
}

function solve({robot:r, walls, crates, moves, size:{width, height}}: {robot: Pos, walls: Set<strPos>, crates: Crates, moves: Dir[], size: {width: number, height: number}}){
  let robot = r

  function bfs(dir:Dir):{r:Pos, movedCrates:Map<id, Pos[]>}|false{
    const r = move(robot, dir)
    const cratesToMove:id[] = []
    const movedCrates = new Map<id, Pos[]>()
    const c1 = crates.partsByPos.get(pos2str(r))
    if(c1 !== undefined){
      cratesToMove.push(c1)
    }else{
      if(walls.has(pos2str(r))){
        return false
      }
    }

    while(cratesToMove.length){
      const crateId = cratesToMove.pop()!
      const parts = crates.partsById.get(crateId)!
      const movedParts = parts.map(p => move(p, dir))
      movedCrates.set(crateId, movedParts)
      const newIds = new Set<id>()
      for(const movedPart of movedParts){
        if(walls.has(pos2str(movedPart))){
          return false
        }
        const newId = crates.partsByPos.get(pos2str(movedPart))
        if(newId !== undefined && newId !== crateId){
          newIds.add(newId)
        }
      }
      cratesToMove.push(...newIds)
      
    }
    return {r, movedCrates}
  }

  for(const move of moves){
    // console.log(print(width, height, walls, crates, robot))
    const {r, movedCrates} = bfs(move) || {r:robot, movedCrates:[]}
    robot = r
    for(const [id, _] of movedCrates){
      for(const part of crates.partsById.get(id)!){
        crates.partsByPos.delete(pos2str(part))
      }
    }
    for(const [id, parts] of movedCrates){
      crates.partsById.set(id, parts)
      for(const part of parts){
        crates.partsByPos.set(pos2str(part), id)
      }
    }
  }
  let cost = 0
  for(const [_, crate] of crates.partsById){
    const {x,y} = crate.reduce((leftMost, part)=>leftMost.x<part.x?leftMost:part)
    cost += x+y*100
  }
  console.log(print(width, height, walls, crates, robot))
  return cost
}

// console.log("part 1:", solve(parseInput(example)))
console.log("part 1:", solve(parseInput(Deno.readTextFileSync('./day15.txt'))))
// console.log("part 2:", solve(parseInput2(example)))
// console.log("part 2:", solve(parseInput2(smallExample)))
console.log("part 2:", solve(parseInput2(Deno.readTextFileSync('./day15.txt'))))