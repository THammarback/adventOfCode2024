const example = `
1
10
100
2024`.split('\n').filter(x => x).map(Number)

function evolve(secret:number){
    secret = (secret^(secret<<6)) & 16777215
    secret = (secret^(secret>>5)) & 16777215
    secret = (secret^(secret<<11)) & 16777215
    return secret
}

function part1(inputs:number[], times:number){
    return inputs.map(start => {
        let x = start
        for(let i=0; i<times; i++){
            x = evolve(x)
        }
        return x
    }).reduce((sum,curr) => sum+curr,0)
}

function part2(inputs:number[], times:number){
    const priceSums: Map<string, number> = new Map()
    for(const secret of inputs){
        const keys = new Set<string>()
        const seq:number[] = [secret, evolve(secret), evolve(evolve(secret)), evolve(evolve(evolve(secret)))]
        for(let i=0; i<times-3; i++){
            const next = evolve(seq[3])
            const key = seq.map((x,i,arr) => (x%10) - ((arr[i+1] ?? next)%10)).toString()
            seq.shift()
            seq.push(next)
            if(!keys.has(key)){
                keys.add(key)
                priceSums.set(key, (priceSums.get(key)??0) + (next%10))
            }
        }
    }
    return [...priceSums].reduce(([accKey, accValue], [currKey, currValue])=> accValue > currValue?[accKey, accValue]:[currKey, currValue])

}
console.log(part2(Deno.readTextFileSync('./day22.txt').split('\n').filter(x=>x).map(Number), 2000))
