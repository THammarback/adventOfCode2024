const example = `x00: 1
x01: 0
x02: 1
x03: 1
x04: 0
y00: 1
y01: 1
y02: 1
y03: 1
y04: 1

ntg XOR fgs -> mjb
y02 OR x01 -> tnw
kwq OR kpj -> z05
x00 OR x03 -> fst
tgd XOR rvg -> z01
vdt OR tnw -> bfw
bfw AND frj -> z10
ffh OR nrd -> bqk
y00 AND y03 -> djm
y03 OR y00 -> psh
bqk OR frj -> z08
tnw OR fst -> frj
gnj AND tgd -> z11
bfw XOR mjb -> z00
x03 OR x00 -> vdt
gnj AND wpb -> z02
x04 AND y00 -> kjc
djm OR pbm -> qhw
nrd AND vdt -> hwm
kjc AND fst -> rvg
y04 OR y02 -> fgs
y01 AND x02 -> pbm
ntg OR kjc -> kwq
psh XOR fgs -> tgd
qhw XOR tgd -> z09
pbm OR djm -> kpj
x03 XOR y03 -> ffh
x00 XOR y04 -> ntg
bfw OR bqk -> z06
nrd XOR fgs -> wpb
frj XOR qhw -> z04
bqk OR frj -> z07
y03 OR x01 -> nrd
hwm AND bqk -> z03
tgd XOR rvg -> z12
tnw OR pbm -> gnj`

const ops = ["OR", "XOR", "AND"] as const
type Op = typeof ops[number]
function isOp(x:unknown): x is Op {
    for(const op of ops){
        if(op === x){
            return true
        }
    }
    return false
}

function parse(input:string):[Map<string, boolean>, Map<string, {arg1:string, arg2:string, op:Op}>]{
    const splitter = input.includes('\r')? '\r\n':'\n' 
    const [constsStr, logicsStr] = input.split(splitter+splitter)
    const consts:Map<string, boolean> = new Map()
    const logics:Map<string, {arg1:string, arg2:string, op:Op}> = new Map()
    for(const line of constsStr.split(splitter)){
        const [name,value] = line.split(': ')
        consts.set(name, Boolean(Number(value)))
    }

    for(const line of logicsStr.split(splitter)){
        const [logic, result] = line.split(' -> ')
        const [arg1, op, arg2] = logic.split(' ')
        if(isOp(op)){
            logics.set(result, {arg1, op, arg2})
        }else{
            throw Error(`op ${op} is not any of ${ops.join(' | ')}`)
        }
    }

    
    return [consts, logics]
}

function gate(op:Op, arg1:boolean, arg2:boolean):boolean{
    switch(op){
        case "OR":
            return arg1 || arg2
        case "XOR":
            return arg1 !== arg2
        case "AND":
            return arg1 && arg2
    }
}

function part1(input:string){
    const [consts, logics] = parse(input)

    function inner(result: string):boolean{
        if(consts.has(result)){
            return consts.get(result)!
        }
        const {op, arg1, arg2} = logics.get(result)!
        const res = gate(op, consts.get(arg1) ?? inner(arg1), consts.get(arg2) ?? inner(arg2))
        consts.set(result, res)
        return res
    }

    for(const result of logics.keys()){
        consts.set(result, inner(result))
    }
    
    return parseInt([...logics.keys()].filter(x => x.startsWith('z')).toSorted().toReversed().reduce((acc, curr)=>acc + (consts.get(curr)?"1":"0"),""),2)
}



function part2(input:string){
    const [_, logics] = input.split('\r\n\r\n')

    const map = new Map<string, Map<string, string>>()
    for(const row of logics.split('\r\n')){
        const [in1, op, in2, _, res] = row.split(' ')
        const key = [in1, in2].sort().join('-')
        if(map.has(key)){
            map.get(key)!.set(op, res)
        }else{
            map.set(key, new Map([[op, res]]))
        }
    }

    function fullAdder(in1:string, in2:string, Cin:string){
        const swaps = []
        const key0 = [in1, in2].sort().join('-')
        if(!map.has(key0)){
            throw Error(`1 - in1:${in1}, in2:${in2}`)
        }
        let andRes = map.get(key0)!.get("AND")
        if(andRes === undefined){
            throw Error(`1.1 - in1:${in1}, in2:${in2}`)
        }
        let xorRes = map.get(key0)!.get("XOR")
        if(andRes === undefined){
            throw Error(`1.2 - in1:${in1}, in2:${in2}`)
        }

        let key1 = [xorRes, Cin].sort().join('-')
        if(!map.has(key1)){
            if(map.has([andRes, Cin].sort().join('-'))){
                console.log(`No key1:${key1} - in1:${in1}, in2:${in2}`)
                console.log(`Tries to swap xorRes:${xorRes} and andRes:${andRes}`);
                ([xorRes, andRes] = [andRes, xorRes])
                swaps.push(xorRes, andRes)
                key1 = [xorRes, Cin].sort().join('-')
            }else{
                throw Error(`2 - in1:${in1}, in2:${in2}, ${xorRes}-${Cin}=key1:${key1}`)
            }
        }
        let res = map.get(key1)!.get("XOR")
        if(res === undefined){
            throw Error(`2.1 - in1:${in1}, in2:${in2}`)
        }
        let cPath = map.get(key1)!.get("AND")
        if(cPath === undefined){
            throw Error(`2.2 - in1:${in1}, in2:${in2}`)
        }

        let error = false
        if(!res.startsWith('z')){
            if(cPath.startsWith('z')){
                console.log(`Wrong Out! - in1:${in1}, in2:${in2}`)
                console.log(`Tries to swap res:${res} and cPath:${cPath}`)
                res = map.get(key1)!.get("AND")!
                cPath = map.get(key1)!.get("XOR")!
                swaps.push(res, cPath)
            }else{
                error = true;
            }
        }

        const key2 = [andRes, cPath].sort().join('-')
        if(!map.has(key2)){

            throw Error(`3 - in1:${in1}, in2:${in2}`)
        }
        
        let carry = map.get(key2)!.get("OR")
        if(carry === undefined){
            throw Error(`3.1 - in1:${in1}, in2:${in2}`)
        }
        if(error){
            console.log(`Wrong Out! - in1:${in1}, in2:${in2}`)
            console.log(`Tries to swap res:${res} and carry:${cPath}`);
            [res, carry] = [carry, res];
            swaps.push(res, carry)
        }

        return {res, carry, swaps}
    }

    let {res, carry} = {res:map.get("x00-y00")?.get("XOR")!, carry:map.get("x00-y00")?.get("AND")!}
    const allSwaps = []
    for(let i=1; i<99; i++){
        let swaps
        const digits = (i<10 ? '0'+i.toString() : i.toString());
        ({res, carry, swaps} = fullAdder("x"+digits, "y"+digits, carry))
        allSwaps.push(...swaps)
    }

}
console.log(part2(Deno.readTextFileSync('./day24.txt')))
"dqr,dtk,pfw,shh,vgs,z21,z33,z39"
andRes  z39
Cin     sjq
cPath   kdd
in1     x39
in2     y39
key0    x39-y39
key1    gqn-sjq
key2    kdd-z39
res     pfw
xorRes  gqn


------------
in1 and in2-> 
in1 xor in2-> gqn
gqn xor Cin-> pfw
gqn and Cin-> kdd

pfw OR kdd -> jqk
// console.log(part1(example))
// console.log(part1(Deno.readTextFileSync('./day24.txt')))
