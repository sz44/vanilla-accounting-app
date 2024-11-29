class CPPCalculation {
  nums;
  targets;
  numsVector = null;
  targetsVector = null;
  
  constructor(leftArr, rightArr) {
    this.nums = this.removeDecimal(leftArr);
    this.targets = this.removeDecimal(rightArr);
  }

  cleanUp() {
    if (this.numsVector) {
      this.numsVector.delete();
      this.numsVector = null;
    }
    if (this.targetsVector) {
      this.targetsVector.delete();
      this.targetsVector = null;
    }
  }

  removeDecimal(nums) {
    return nums.map(n => Math.round(n * 100));
  }

  async initVectors() {
    await WASMPromise;

    this.numsVector = new Module['vectorInt']();
    this.nums.forEach(n => this.numsVector.push_back(n)); // store as int
    
    this.targetsVector = new Module['vectorInt']();
    this.targets.forEach(n => this.targetsVector.push_back(n)); // store as int
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
    let start = Date.now();
    let subsetSums =  Module.subsetSums(this.numsVector, this.targetsVector);
    let end = Date.now();
    console.log("Module.subsetSums time: ", (end-start)/1000);
    return subsetSums;
  }

  async subsetSums() {
    return this.CPP2JSMap(await this.subsetSumsCPP());
  }

}