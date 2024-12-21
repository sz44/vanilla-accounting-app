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

  getRangeOffset() {
    let maxSum = this.nums.reduce((acc, n, i, arr) => n > 0 && acc + n, 0);
    let minSum = this.nums.reduce((acc, n, i, arr) => n < 0 && acc + n, 0);
    return [maxSum - minSum + 1, -minSum];
  }

  benchmark10x() {
    // run benchmark upto 10mill
    // build equation
    // predict


    //1, 10, ..., 1e7 
    // const res = []
    // const ranges = Array(8).fill(1).map((_,i)=>math.Pow(10,i));
    // for (let r of ranges) {
    //   // dp1 test
    //   let start = performance.now()
    //   this.#dp1([r])
    //   let end = performance.now()
    //   let time = end - start;
    //   console.log(r, " --- ", time)
    //   res.push(time)
    // }

    // upto 16,000,000
    // for (let r = 1; r <= 2 ** 24; r *= 2) {
    //   let start = performance.now()
    //   this.#dp1([r])
    //   let end = performance.now()
    //   let time = end - start;
    //   console.log(r, " --- ", time)
    // }

    for (let r = 1; r <= 1e8; r *= 10) {
      let start = performance.now()
      this.#dp1([r])
      let end = performance.now()
      let time = end - start;
      console.log(r, " --- ", time)
    }
  }

  benchmark_mean() {
    let total = 0
    for (let i = 0; i < 100; i++) {
      let start = performance.now()
      this.#dp1([1e6]);
      let end = performance.now() 
      let dp1Time = end - start
      // console.log("dp1Time: ", dp1Time)
      total += dp1Time
    }
    return total/100
  }

  benchmark_dp1_dp() {
    //1000000, 500000 + 500000, 
  }

  getEstimate() {
    // if range under 1e6 return 0
    // calc time for 1e6
    // get ratio or our range 
    // this.benchmark10x();
    
    const [range, offset] = this.getRangeOffset()

    // upper limit
    if (range >= 2**31-1) {
      console.log("range over limit: ", range)
      //TODO proper error handle need to exit...
      return 0
    }

    if (range <= 1e6) {
      return 0
    }

    let mean = this.benchmark_mean()

    // let start = performance.now()
    // this.#dp1([1e6]);
    // let end = performance.now() 
    // let dp1Time = end - start
    // console.log("dp1Time: ", dp1Time)
    console.log("mean: ", mean)

    let range_ratio = range / 1e6
    console.log("range_ratio: ", range_ratio)

    // return dp1Time * 0.001 * range_ratio * this.nums.length
    return mean * 0.001 * range_ratio * this.nums.length

    // get range of input,
    // if small enought just do the calc.
    // else calc with 1/100 of the range and multiply the answer * 100
    // let testNums = this.#genTestNums(100, 100);
    // size = 100, range = 5050
    //10, 100, 1000, 10000, 100000, 1000000, 
    // const [range, offset] = this.getRangeOffset()

    // let start = performance.now()
    // this.#dp1(this.nums);
    // let end = performance.now() 
    // let dp1Time = end - start
    // console.log(dp1Time)

    // return dp1Time * 0.001 * this.nums.length * 1 

    // let testSize = 100;
    // let testRange = 5050;
    // let testNums = [];
    // for (let n = 1; n <= testSize; n++) {
    //   testNums.push(n);
    // }

    // let start = Date.now();
    // this.#genContMap(testNums);
    // let end = Date.now();
    // let elapsed = Math.max(1, end - start);
    // let testSecs = elapsed * 0.001;

    // let minSum1 = testNums.reduce((acc,n) => n < 0 ? acc + n : acc, 0);
    // let maxSum1 = testNums.reduce((acc,n) => n > 0 ? acc + n : acc, 0);
    // let range1 = maxSum1 - minSum1;

    // let maxNum = Math.max(...this.nums);
    // let minNum = Math.min(...this.nums);
    // let largestDiff = Math.max(maxNum, minNum)
    // let minSum = this.nums.reduce((acc,n) => n < 0 ? acc + n : acc, 0);
    // let maxSum = this.nums.reduce((acc,n) => n > 0 ? acc + n : acc, 0);
    // let range = maxSum - minSum;

    // let rangeFactor = Math.max(1, range / testRange);

    // let size = this.nums.length;
    // // let sizeFactor = (size / 100) ** 2;
    // let sizeFactor = Math.max(1, size / testSize);

    // let result = testSecs * sizeFactor * rangeFactor * 0.5;
    // return result;
    return 100; 
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

  #dp1(nums) {
    if (!nums) console.error("could not gen contribution map, nums is undefined");

    // const [range, offset] = this.getRangeOffset(nums)
    let minSum = nums.reduce((acc,n) => n < 0 ? acc + n : acc, 0);
    let maxSum = nums.reduce((acc,n) => n > 0 ? acc + n : acc, 0);
    let range = maxSum - minSum + 1;
    console.log("range: ", range)

    let offset = -minSum;

    const outMap = new Map();

    let prev = new Uint8Array(range);
    let curr = new Uint8Array(range);
    prev[offset] = 1;

    for (let col = 0; col < range; col++) {
      // if inbound and can contribute and not already assigned
      if (!prev[col] && col - nums[0] >= 0 && col - nums[0] < range && prev[col - nums[0]]) {
        curr[col] = true;
        outMap.set(col - offset, nums[0]);
      }
    }
  }

  // build contributions map { sum : first contributing number }
  #genContMap(nums) {
    if (!nums) console.error("could not gen contribution map, nums is undefined");

    let outMap = new Map();

    let minSum = nums.reduce((acc,n) => n < 0 ? acc + n : acc, 0);
    let maxSum = nums.reduce((acc,n) => n > 0 ? acc + n : acc, 0);
    let range = maxSum - minSum + 1;
    console.log("range: ", range)

    let offset = -minSum;

    let prev = new Uint8Array(range);
    let curr = new Uint8Array(range);
    prev[offset] = 1;

    for (let num of nums) {
      for (let col = 0; col < range; col++) {
        // if inbound and can contribute and not already assigned
        if (!prev[col] && col - num >= 0 && col - num < range && prev[col - num]) {
          curr[col] = true;
          outMap.set(col - offset, num);
        }
      }
      [prev, curr] = [curr, prev]
      curr.fill(0)
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
    console.log("doing subset sums")
    let start = Date.now()
    let contMap = this.#genContMap(this.nums);
    console.log("real time: ", Date.now()-start);
    let resultMap = new Map();
    for (let target of this.targets) {
      resultMap.set(this.toCurrency(target), this.#subsetSum(contMap, target));
    }
    return resultMap;
  }

  cleanUp() {}
}

// module.exports = JSCalculation;