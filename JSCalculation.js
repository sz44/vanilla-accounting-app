class JSCalculation {
  nums;
  targets;
  resultMap;
  constructor(leftArr, rightArr) {
    this.nums = leftArr;
    this.targets = rightArr;
  }

  estimateRunTime() {
    let testNums = this.genNums(100, 100);
    let start = Date.now();
    this.genResultMap(testNums);
    let end = Date.now();
    let elapsed = Math.max(1, end - start);
    let testSecs = elapsed * 0.001;

    let size = this.nums.length;
    let sizeFactor = (size / 100) ** 2;

    let maxNum = Math.max(...this.nums);
    let minNum = Math.min(...this.nums);
    let largestDiff = Math.max(maxNum, minNum)
    let rangeFactor = Math.max(1, largestDiff / 100);

    let result = testSecs * sizeFactor * rangeFactor;
    return result.toFixed(2);
  }

  genNums(size, range) {
    let out = []
    for (let i = 0; i < size; i++) {
      out.push(Math.floor(Math.random() * 2 * range) - range)
    }
    out.push(-range)
    out.push(range)
    return out;
  }

  // build solution map
  genResultMap(input) {
    let nums = input === undefined ? this.nums : input;

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

    if (input === undefined) {
      this.resultMap = outMap; 
    }
  }
}