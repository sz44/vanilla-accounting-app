class JSCalculation {
  nums;
  targets;
  constructor(leftArr, rightArr) {
    this.nums = this.removeDecimal(leftArr);
    this.targets = this.removeDecimal(rightArr);
  }

  removeDecimal(nums) {
    return nums.map(n => Math.round(n * 100));
  }

  getEstimate() {
    let testNums = this.#genTestNums(100, 100);
    let start = Date.now();
    this.#genContMap(testNums);
    let end = Date.now();
    let elapsed = Math.max(1, end - start);
    let testSecs = elapsed * 0.001;

    let minSum1 = testNums.reduce((acc,n) => n < 0 ? acc + n : acc, 0);
    let maxSum1 = testNums.reduce((acc,n) => n > 0 ? acc + n : acc, 0);
    let range1 = maxSum1 - minSum1;

    // let maxNum = Math.max(...this.nums);
    // let minNum = Math.min(...this.nums);
    // let largestDiff = Math.max(maxNum, minNum)
    let minSum = this.nums.reduce((acc,n) => n < 0 ? acc + n : acc, 0);
    let maxSum = this.nums.reduce((acc,n) => n > 0 ? acc + n : acc, 0);
    let range = maxSum - minSum;

    let rangeFactor = Math.max(1, range / range1);

    let size = this.nums.length;
    // let sizeFactor = (size / 100) ** 2;
    let sizeFactor = Math.max(1, size / 100);

    let result = testSecs * sizeFactor * rangeFactor;
    return result;
  }

  #genTestNums(size, range) {
    let out = []
    for (let i = 0; i < size; i++) {
      out.push(Math.floor(Math.random() * 2 * range + 1) - range)
    }
    out.push(-range)
    out.push(range)
    return out;
  }

  // build contributions map { sum : first contributing number }
  #genContMap(nums) {
    if (!nums) console.error("could not gen contribution map, nums is undefined");

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

  #subsetSum(contMap, target) {
    if (!contMap.has(target)) {
      return [];
    }

    let out = [];
    while (target !== 0) {
      out.push(this.toCurrency(contMap.get(target)));
      target -= contMap.get(target);
    }

    return out;
  }

  toCurrency(num) {
    return num / 100;
  }

  subsetSums() {
    let contMap = this.#genContMap(this.nums);
    let resultMap = new Map();
    for (let target of this.targets) {
      resultMap.set(this.toCurrency(target), this.#subsetSum(contMap, target));
    }
    return resultMap;
  }

  cleanUp() {}
}