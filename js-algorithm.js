// build solution map
function getMap(nums) {
  // {sum : contributing number}
  let outMap = new Map();

  let minSum = nums.reduce((acc,n) => n < 0 ? acc + n : acc, 0);
  let maxSum = nums.reduce((acc,n) => n > 0 ? acc + n : acc, 0);

  let range = maxSum - minSum + 1;
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
  let testNums = getNums(100, 100);
  let testRange = getRange(testNums);
  let start = Date.now();
  getMap(testNums);
  let end = Date.now();
  let elapsed = Math.max(1, end - start);
  let testSecs = elapsed * 0.001;
  console.log("testSec: ", testSecs);

  let size = nums.length;
  let range = getRange(nums);
  let sizeFactor = (size/100) ** 2;
  // 100 - 1
  // 1000 - 100
  // 10000 - 10000

  let maxNum = Math.max(...nums);
  let minNum = Math.min(...nums);
  let largestDiff = Math.max(maxNum, minNum)
  let rangeFactor = Math.max(1,  largestDiff/ 100); 
  // 100 - 1
  // 1000 - 10
  // 10000 - 100
  return testSecs * sizeFactor * rangeFactor;
}

// for more accuracy would enter true range not [k,-k] ranges
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

let n2 = getNums(10000,10000);

console.log("e: ", estimate(n2))
// console.log(getNums(10,10))

// console.log(subsetSum(m,-2))
// console.log(subsetSums(m,[2,4,5,6]))

