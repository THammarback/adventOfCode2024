
type NumericKeys = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 'A'
type DirKeys = '>' | '<' | 'v' | '^' | 'A'
const numericKeypadMap = {
  A:{0:['<','A'], 1:['^','<','<','A'], 2:['^','<','A'], 3:['^','A'], 4:['^','^','<','<','A'], 5:['^','^','<','A'], 6:['^','^','A'], 7:['^','^','^','<','<','A'], 8:['^','^','^','<','A'], 9:['^','^','^','A'], A:['A']},
  0:{0:['A'], 1:['^','<','A'], 2:['^','A'], 3:['^','>','A'], 4:['^','^','<','A'], 5:['^','^','A'], 6:['^','^','>','A'], 7:['^','^','^','<','A'], 8:['^','^','^','A'], 9:['^','^','^','>','A'], A:['>','A']},
  1:{0:['>','v','A'], 1:['A'], 2:['>','A'], 3:['>','>','A'], 4:['^','A'], 5:['^','>','A'], 6:['^','>','>','A'], 7:['^','^','A'], 8:['^','^','>','A'], 9:['^','^','>','>','A'], A:['>','>','v','A']},
  2:{0:['v','A'], 1:['<','A'], 2:['A'], 3:['>','A'], 4:['^','<','A'], 5:['^','A'], 6:['^','>','A'], 7:['^','^','<','A'], 8:['^','^','A'], 9:['>','^','^','A'], A:['>','v','A']},
  3:{0:['<','v','A'], 1:['<','<','A'], 2:['<','A'], 3:['A'], 4:['^','<','<','A'], 5:['^','<','A'], 6:['^','A'], 7:['^','^','<','<','A'], 8:['^','^','<','A'], 9:['^','^','A'], A:['v','A']},
  4:{0:['>','v','v','A'], 1:['v','A'], 2:['>','v','A'], 3:['>','>','v','A'], 4:['A'], 5:['>','A'], 6:['>','>','A'], 7:['^','A'], 8:['^','>','A'], 9:['^','>','>','A'], A:['>','>','v','v','A']},
  5:{0:['v','v','A'], 1:['<','v','A'], 2:['v','A'], 3:['>','v','A'], 4:['<','A'], 5:['A'], 6:['>','A'], 7:['^','<','A'], 8:['^','A'], 9:['^','>','A'], A:['>','v','v','A']},
  6:{0:['<','v','v','A'], 1:['v','<','<','A'], 2:['v','<','A'], 3:['v','A'], 4:['<','<','A'], 5:['<','A'], 6:['A'], 7:['^','<','<','A'], 8:['^','<','A'], 9:['^','A'], A:['v','v','A']},
  7:{0:['>','v','v','v','A'], 1:['v','v','A'], 2:['>','v','v','A'], 3:['>','>','v','v','A'], 4:['v','A'], 5:['v','>','A'], 6:['v','>','>','A'], 7:['A'], 8:['>','A'], 9:['>','>','A'], A:['>','>','v','v','v','A']},
  8:{0:['v','v','v','A'], 1:['<','v','v','A'], 2:['v','v','A'], 3:['v','v','>','A'], 4:['v','<','A'], 5:['v','A'], 6:['v','>','A'], 7:['<','A'], 8:['A'], 9:['>','A'], A:['>','v','v','v','A']},
  9:{0:['<','v','v','v','A'], 1:['v','v','<','<','A'], 2:['v','v','<','A'], 3:['v','v','A'], 4:['v','<','<','A'], 5:['v','<','A'], 6:['v','A'], 7:['<','<','A'], 8:['<','A'], 9:['A'], A:['v','v','v','A']}
} as Record<NumericKeys, Record<NumericKeys, DirKeys[]>>

const directionalKeypadMap = {
  '>':{'>':['A'],'<':['<','<','A'],'v':['<','A'],'^':['<', '^','A'],'A':['^','A']},
  '<':{'>':['>','>','A'],'<':['A'],'v':['>','A'],'^':['>', '^','A'],'A':['>','>','^','A']},
  'v':{'>':['>','A'],'<':['<','A'],'v':['A'],'^':['^','A'],'A':['>','^','A']},
  '^':{'>':['v','>','A'],'<':['v','<','A'],'v':['v','A'],'^':['A'],'A':['>','A']},
  'A':{'>':['v','A'],'<':['v','<','<','A'],'v':['v','<','A'],'^':['<','A'],'A':['A']}
} as Record<DirKeys, Record<DirKeys, DirKeys[]>>

function solveNumeric(input:NumericKeys[]):DirKeys[]{
  const result:DirKeys[] = []
  result.push(...numericKeypadMap['A'][input[0]])
  for(let i=1; i<input.length; i++){
    result.push(...numericKeypadMap[input[i-1]][input[i]])
  }
  return result
}

function solveDirectional(input:DirKeys[]): DirKeys[]{
  const result:DirKeys[] = []
  result.push(...directionalKeypadMap['A'][input[0]])
  for(let i=1; i<input.length; i++){
    result.push(...directionalKeypadMap[input[i-1]][input[i]])
  }
  return result
}


// console.log(solveDirectional(solveDirectional(solveNumeric([0,2,9,'A']))).join(''))
// console.log('<vA<AA>>^AvAA<^A>A<v<A>>^AvA^A<vA>^A<v<A>^A>AAvA^A<v<A>A>^AAAvA<^A>A')
// console.log(solveDirectional(solveDirectional(solveNumeric([9,8,0,'A']))).join(''))
// console.log('<v<A>>^AAAvA^A<vA<AA>>^AvAA<^A>A<v<A>A>^AAAvA<^A>A<vA>^A<A>A')
// console.log(solveDirectional(solveDirectional(solveNumeric([1,7,9,'A']))).join(''))
// console.log('<v<A>>^A<vA<A>>^AAvAA<^A>A<v<A>>^AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A')
// console.log(solveDirectional(solveDirectional(solveNumeric([4,5,6,'A']))).join(''))
// console.log('<v<A>>^AA<vA<A>>^AAvAA<^A>A<vA>^A<A>A<vA>^A<A>A<v<A>A>^AAvA<^A>A')

console.log(solveNumeric([3,7,9,'A']).join(''))
console.log(solveDirectional(solveNumeric([3,7,9,'A'])).join(''))
console.log(solveDirectional(solveDirectional(solveNumeric([3,7,9,'A']))).join(''))
console.log('<v<A>>^AvA^A<vA<AA>>^AAvA<^A>AAvA^A<vA>^AA<A>A<v<A>A>^AAAvA<^A>A')