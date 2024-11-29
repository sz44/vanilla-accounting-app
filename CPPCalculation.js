class CPPCalculation {
  nums;
  targets;
  numsVector = null;
  targetsVector = null;
  
  constructor(leftArr, rightArr) {
    this.nums = this.removeDecimals(leftArr);
    this.numsVector = new Module['vectorInt']();
    this.nums.forEach(n => this.numsVector.push_back(n)); // store as int

    this.targets = this.removeDecimals(rightArr);
    this.targetsVector = new Module['vectorInt']();
    this.targets.forEach(n => this.targetsVector.push_back(n)); // store as int
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

  removeDecimals(nums) {
    return nums.map(n => Math.round(n * 100));
  }

  getEstimate() {
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

  subsetSumsCPP() {
    let subsetSums =  Module.subsetSums(this.numsVector, this.targetsVector);
    return subsetSums;
  }

  subsetSums() {
    return this.CPP2JSMap(this.subsetSumsCPP());
  }

}