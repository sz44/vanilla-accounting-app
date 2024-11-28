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
    this.WASMPromise2 = new Promise((resolve) => {
      Module.onRuntimeInitialized = () => {
        resolve();
      }
    })
    this.nums = leftArr;
    this.targets = rightArr;
  }

  async initVectors() {
    await WASMPromise;

    this.numsVector = new Module['vectorInt']();
    leftArr.forEach(n => numsVector.push_back(n * 100)); // store as int

    this.targetsVector = new Module['vectorInt']();
    rightArr.forEach(n => targetsVector.push_back(n * 100)); // store as int

  }

  async getEstimate() {
    if (!this.numsVector || !this.targetsVector) {
      await this.initVectors();
    }
    return Module.estimateTime(this.numsVector);
  }

  async subsetSums() {
    if (!this.numsVector || !this.targetsVector) {
      await this.initVectors();
    }
    return Module.subsetSums(this.numsVector, this.targetsVector);
  }

}