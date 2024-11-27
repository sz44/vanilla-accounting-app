// build solution map
function getMap(nums) {
  // {sum : contributing number}
  let outMap = new Map();

  let range = getRange(nums);
  let offSet = -minSum;

  let prev = Array(range).fill(false); 
  prev[offSet] = true;
  let curr = prev.slice();

  for (let num of nums) {
    for (let col = 0; col < range; col++) {
      // if inbound and can contribute and not already assigned
      if (!prev[col] && col - num >= 0 && col - num < range && prev[col - num]) {
        curr[col] = true;
        outMap.set(col - offSet, num);
      }
    }
    prev = curr.slice();
  }

  return outMap;
}

function getRange(nums) {
  let minSum = nums.reduce((acc,n) => n < 0 ? acc + n : acc, 0);
  let maxSum = nums.reduce((acc,n) => n > 0 ? acc + n : acc, 0);

  return maxSum - minSum + 1;
}

function subsetSum(contMap, target) {
  if (!contMap.has(target)) {
    return [];
  }
  let out = [];
  while ( target !== 0 ) {
    out.push(contMap.get(target));
    target -= contMap.get(target);
  }

  return out;
}

function subsetSums(contMap, targets) {
  let out = new Map();
  for (let target of targets) {
    out.set(target, subsetSum(contMap, target));
  }
  return out;
}


function estimate(nums) {
  let testNums = getNums(100, 100)
  let start = Date.now();
  getMap(testNums);
  let end = Date.now();
  let elapsed = end - start;
  let testSecs = elapsed * 0.001;
  // size * 100 ns
  // range ** 10 ns
  let size = nums.length;
  let sr = Math.max(1, size / 100);
  let range = getRange(nums);
  let rr = Math.max(1, range / 100); 
  // 100 - 1
  // 1000 - 100
  // 10000 - 10000
  return testSecs * sr * 100;
}

function getNums(size, range) {
  let out = []
  for (let i = 0; i < size; i++) {
    out.push(Math.floor(Math.random() * 2 * range) - range)
  }
  out.push(-range)
  out.push(range)
  return out;
}

let n1 = [2,4,-2];

let m = getMap(n1);
// console.log(m);

console.log(estimate(n1))
// console.log(getNums(10,10))

// console.log(subsetSum(m,-2))
// console.log(subsetSums(m,[2,4,5,6]))

