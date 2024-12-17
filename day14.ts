
const testRobotStrings = `
p=0,4 v=3,-3
p=6,3 v=-1,-3
p=10,3 v=-1,2
p=2,0 v=2,-1
p=0,0 v=1,3
p=3,0 v=-2,-2
p=7,6 v=-1,-3
p=3,0 v=-1,-2
p=9,3 v=2,3
p=7,3 v=-1,2
p=2,4 v=2,-3
p=9,5 v=-3,-3`.split('\n')

const robotStrings = Deno.readTextFileSync('./day14.txt').split('\r\n')

type Vec = {x:number, y:number}
type Robot = {p:Vec, v:Vec}


function parseRobot(robotStr:string){
  const [px, py, vx, vy] = robotStr.matchAll(/-?\d+/g)
  return {p:{x:Number(px), y:Number(py)}, v:{x:Number(vx),y:Number(vy)}}

}

function afterTime(time:number, robots:Robot[],width:number, height:number):Robot[]{
  return robots.map(({p,v}) => {
    return {p:{
      x:((p.x+v.x*time)%width+width)%width,
      y:((p.y+v.y*time)%height+height)%height
    }, v}
  })
}

function perQuadrant(robots:Robot[], width:number, height:number){
  const width2 = Math.floor(width/2)
  const height2 = Math.floor(height/2)
  return robots.reduce<[number,number,number,number]>(([q1,q2,q3,q4], {p:{x,y}})=>{
    if(x<width2 && y<height2) q1++
    if(x<width2 && y>height2) q2++
    if(x>width2 && y<height2) q3++
    if(x>width2 && y>height2) q4++
    return [q1,q2,q3,q4]
  }, [0,0,0,0])
}


function part1(data:string[], time:number, width:number, height:number){
  return perQuadrant(afterTime(time, data.map(parseRobot), width, height), width, height).reduce((product,factor)=>product*factor)
}

function part2(data:string[], width:number, height:number){
  let stop
  let pause = false
  let i = 0
  while(stop !== 's' && !pause){
    const rows:string[][] = new Array(height);
    for (let i = 0; i < height; i++) {
        rows[i] = new Array(width).fill('.');
    }
    const robots = afterTime(i++, data.map(parseRobot), width, height)
    for(const {p:{x,y}} of robots){
      rows[y][x] = '#'
    }
    const str = rows.map(row => {
      const huh = row.join('')
      if(huh.indexOf("######") !== -1){
        pause = true
      }
      return huh
    }).join('\n')
    if(pause){
      console.log(str)
      stop = prompt(`Press s and then enter to stop: (${i})`)
      pause = false
    }
  }
}



// console.log("Part 1:", part1(testRobotStrings, 100,11,7))
// console.log("Part 1:", part1(robotStrings, 100,101,103))
console.log("Part 2:", part2(robotStrings,101,103)) // 6588 (high)


