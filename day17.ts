function part1(input:number[], a:bigint){
  let i:number = 0
  let b:bigint = BigInt(0)
  let c:bigint = BigInt(0)
  const out:number[] = []
  
  while(i < input.length){
    const Co:Record<number, bigint> = [BigInt(0), BigInt(1), BigInt(2), BigInt(3), a, b, c]
    
    const map = [
      (op:number)=>{a = a >> Co[op]},
      (op:number)=>{b = b ^ BigInt(op)},
      (op:number)=>{b = BigInt(7) & Co[op]},
      (op:number)=>{i = a?op:i},
      (op:number)=>{b = b ^ c},
      (op:number)=>{out.push(Number(Co[op] & BigInt(7)))},
      (op:number)=>{b = a >> Co[op]},
      (op:number)=>{c = a >> Co[op]},
    ]
    map[input[i++]](input[i++])
  }
  return out
}

function part2(prog:number[]){
  const checkout:bigint[] = [BigInt(0)]
  const results:bigint[] = []
  while(checkout.length){
    const base = checkout.pop()!
    for(let a=base; a<base+BigInt(8); a++){
      const res = part1(prog, a)
      if(res.every((val, index) => val === prog[prog.length - res.length + index])){
        // console.log(base.toString(2).length/3, a2.toString(8), res.join(''))
        if(res.length === prog.length){
          results.push(a)
        }
        checkout.push(a*BigInt(8))
      }
    }
  }
  return results.reduce((min, curr) => min<curr?min:curr)
}

// const [a, b, c, ...prog] = [2024,0,0,   0,3,5,4,3,0] // Test
const [a, b, c, ...prog] = Deno.readTextFileSync('./day17.txt').match(/\d+/g)?.map(Number) ?? (()=>{throw Error("Error parsing data")})()

console.log("part 1:", part1(prog, BigInt(a)).join(","))
console.log("part 2:", part2(prog))
console.log("validate part 2 answer:", part1(prog, part2(prog)).join(",") === prog.join(","))
