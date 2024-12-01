// graph size x time

const fs = require('node:fs');
const path = require('node:path');
const JSCalculation = require('./JSCalculation.js');


// 1-10 // time record
// 1-20 // time record
// ...
// 1-100
// all * 100
//

// return 1.71 * (10 ** -7) * (n ** 3) + 3.22 * (10 ** -4) * (n ** 2) - 8.9 * (10 ** -3) * n + 5.36 * (10 ** -2);
// return 0.0531 + -9.26 * (10 ** -3) * n + 3.48 * (10 ** -4) * (n ** 2)
let eq = function(n) {
    return 0.0923 + (-1.16e-3 * n) + (3.5e-6 * n ** 2);
}

let times = [];
const MAX_SIZE = 50000;

let calcObj = new JSCalculation([],[]);

let benchmarkStart = performance.now();

for (let n = 100; n <= MAX_SIZE; n+=100) {
  calcObj.nums.push(n);
  if (n % 1000 === 0) {
    let start = performance.now();
    calcObj.subsetSums();
    let end = performance.now()
    let run_ms = end - start;
    if (run_ms < 0) {
      console.log(run_ms);
      console.log(n);
      console.log(start, end);
    }
    let run_s = run_ms/1000; 
    times.push(parseFloat(run_s.toFixed(4)));
  }
}

let benchmarkEnd = performance.now();
console.log(times);
console.log("run time: ", (benchmarkEnd - benchmarkStart)/1000);
fs.writeFile(path.join(__dirname, "data.json"), JSON.stringify(times), err => {
  if (err) {
    console.error(err);
  }
});
