#include <iostream>
#include <vector>
#include <map>
#include <unordered_map>
#include <algorithm>
using namespace std;

std::vector<int> generateTestData(int n, int k);

unordered_map<int, int> getTargetsMap(vector<int> &nums)
{
  if (nums.empty()) {
    return {};
  }

  unordered_map<int, int> parent;

  // Calculate the range of possible sums
  int minSum = 0, maxSum = 0;
  for (int num : nums)
  {
    if (num > 0)
      maxSum += num;
    else
      minSum += num;
  }

  int range = maxSum - minSum;
  int shift = -minSum; // Offset for negative sums

  // DP array to track achievable sums
  vector<bool> prev(range + 1, false);
  prev[shift] = true;                  // Zero sum is always possible
  vector<bool> curr(range + 1, false); // avoid reuse of nums (with nagative nums can travel forward so just iterating backwards is not enough)

  // Update DP for each number
  for (int num : nums)
  {
    for (int j = 0; j <= range; ++j)
    {
      if (prev[j])
      {
        curr[j] = true;
      }
      // check if within possiblilites [minSum,maxSum],
      // if true can check if with this num curr target is achievable
      else if (j - num >= 0 && j - num <= range && prev[j - num])
      {
        curr[j] = true;
        parent[j - shift] = num; // Store the sum and its contributing number
      }
    }
    prev = curr;
  }

  return parent;
}


vector<int> subsetSum(unordered_map<int,int> &parent, int target) {
  vector<int> result;
  int currSum = target;

  while (currSum != 0) {
      // using find to avoid potential infinite loops...
      auto contributingNum = parent.find(currSum);
      if (contributingNum == parent.end()) {
          return {};
      }
      result.push_back(contributingNum->second);
      currSum -= contributingNum->second;
  }

  return result;
}

map<int, vector<int>> subsetSums(vector<int> &nums, vector<int> &targets) {

  auto parent = getTargetsMap(nums);

  map<int, vector<int>> result;

  for (auto t: targets) {
    result[t] = subsetSum(parent, t);
  }

  return result;
}

// estaimte how long it takes to build parent map
double estimateTime(vector<int> &nums) {
    // range -55 - 55 = 110
    // vector<int> nums1 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10};
    auto nums1 = generateTestData(100,100);
    clock_t start_time = clock();
    auto parent = getTargetsMap(nums1);
    clock_t end_time = clock();
    double elapsed_time = double(end_time - start_time) / CLOCKS_PER_SEC;
    // elapsed_time = max(1.0, elapsed_time);

    int minSum1 = 0;
    int maxSum1 = 0;
    for (auto &n:nums1) {
      if (n<0) {
        minSum1 += n;
      } else {
        maxSum1 += n;
      }
    }

    int range1 = maxSum1 - minSum1;

    int minSum = 0;
    int maxSum = 0;
    for (auto &n:nums) {
      if (n<0) {
        minSum += n;
      } else {
        maxSum += n;
      }
    }

    int range = maxSum - minSum;

    // size ratio = 100, range ratio = 10
    double sr = static_cast<double>(nums.size()) / 100;
    if (sr < 1) {
        sr = 1;
    }
    double rr = static_cast<double>(range) / static_cast<double>(range1);
    if (rr < 1) {
        rr = 1;
    }

    double estimate = elapsed_time * sr * rr;
    return estimate;
}

// generates n ints between [-k,k]
std::vector<int> generateTestData(int n, int k) {
    std::vector<int> nums(n);
    srand((unsigned int)time(NULL));
    for (int i = 0; i < n; ++i) {
        nums[i] = rand() % (2 * k + 1) - k;
    }
    // guarantee full range
    nums.push_back(k);
    nums.push_back(-k);
    return nums;
}

// int main() {
//   // vector<int> nums = {30,-20,50,-800,60,-10};
//   vector<int> nums = {};
//   vector<int> targets = {5050};
//   // vector<int> nums1 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3, -4, -5, -6, -7, -8, -9, -10};
//   for (int i = 1; i <= 330; i++) {
//     nums.push_back(i);
//   }

//   // auto testNums = generateTestData(1000, 100);

//   auto est = estimateTime(nums);
//   cout << "estimated time: " << est << " seconds" << endl;

//   clock_t start_time = clock();
//   // auto parent = getTargetsMap(testNums);
//   auto res = subsetSums(nums, targets);
//   clock_t end_time = clock();
//   double elapsed_time = double(end_time - start_time) / CLOCKS_PER_SEC;
//   cout << "actual time: " << elapsed_time << " seconds" << endl;

//   if (res.empty()) {
//     cout << "no solution" << endl;
//   } else {
//     for (auto n:res) {
//       string str = "";      
//       for (auto s:n.second) {
//         str += to_string(s) + " ";
//       }
//       cout << n.first << ": " << str << endl;
//     }
//   }
// }