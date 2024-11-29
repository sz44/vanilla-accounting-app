class CPPCalculation {
  nums;
  targets;
  numsVector = null;
  targetsVector = null;
  WASMPromise;
  WASMPromise2;
  constructor(leftArr, rightArr) {
    this.WASMPromise = new Promise((resolve) => {
      let interval = setInterval(() => {
        if (WASMReady) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
    // this.WASMPromise2 = new Promise((resolve) => {
    //   Module.onRuntimeInitialized = () => {
    //     resolve();
    //   }
    // });
    this.nums = leftArr;
    this.targets = rightArr;
    console.log("constructor", this.nums, this.targets);
  }

  removeDecimal(f) {
    return Math.round(f * 100);
  }

  async initVectors() {
    await WASMPromise;

    this.numsVector = new Module['vectorInt']();
    this.nums.forEach(n => this.numsVector.push_back(this.removeDecimal(n))); // store as int
    
    this.targetsVector = new Module['vectorInt']();
    this.targets.forEach(n => this.targetsVector.push_back(this.removeDecimal(n))); // store as int
  }

  async getEstimate() {
    if (!this.numsVector || !this.targetsVector) {
      await this.initVectors();
    }
    return Module.estimateTime(this.numsVector);
  }

  toCurrency(n) {
    return n / 100;
  }

  CPP2JSMap(cppMap) {
    let JSMap = new Map();
    for (let i = 0; i < this.targetsVector.size(); i++) {
      const target = this.targetsVector.get(i);
      const vector = cppMap.get(target);

      const jsArr = [];
      for (let j = 0; j < vector.size(); j++) {
        let n = vector.get(j);
        
        jsArr.push(this.toCurrency(n));
      }
      JSMap.set(this.toCurrency(target), jsArr);
    }
    return JSMap;
  }

  async subsetSumsCPP() {
    if (!this.numsVector || !this.targetsVector) {
      await this.initVectors();
    }

    console.log("subsetSumsCPP", this.nums, this.targets);
    return Module.subsetSums(this.numsVector, this.targetsVector);
  }

  async subsetSums() {
    return this.CPP2JSMap(await this.subsetSumsCPP());
  }

}