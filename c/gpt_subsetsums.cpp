#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

vector<int> subsetSum(const vector<int>& nums, int target) {
    if (nums.empty()) {
        return {};
    }

    // Calculate the range of possible sums
    int minSum = 0, maxSum = 0;
    for (int num : nums) {
        if (num > 0) maxSum += num;
        else minSum += num;
    }

    int range = maxSum - minSum;
    int shift = -minSum; // Offset for negative sums

    // DP array to track achievable sums
    vector<bool> prev(range + 1, false);
    prev[shift] = true; // Zero sum is always possible
    vector<bool> curr(range + 1, false);

    // Parent map to track subsets
    unordered_map<int, int> parent;

    // Update DP for each number
    for (int num:nums) {
        for (int j = 0; j <= range; ++j) {
            if (prev[j]) {
                curr[j] = true;
            // check if within possiblilites [minSum,maxSum],
            // if true can check if with this num curr target is achievable
            } else if(j - num >= 0 && j - num <= range && prev[j - num]) {
                curr[j] = true;
                parent[j - shift] = num; // Store the contributing number and index
            }
        }
        prev = curr;
    }

    // Check if the target sum is achievable
    if (!(target + shift >= 0 && target + shift <= range && curr[target + shift])) {
        return {}; // Return an empty vector if target sum is not achievable
    }

    // Retrieve the subset
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

double estimateTimeOne(const vector<int>& nums, const int k) {
    vector<int> nums1 = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
    int k1 = 55;
    clock_t start_time = clock();
    subsetSum(nums1, k1);
    clock_t end_time = clock();
    double elapsed_time = double(end_time - start_time) / CLOCKS_PER_SEC;
    double mn = static_cast<double>(nums.size()) / 10;
    if (mn < 1) {
        mn = 1;
    }
    double mk = static_cast<double>(k) / 55;
    if (mk < 1) {
        mk = 1;
    }
    double estimate = elapsed_time * mn * mk;
    return estimate;
}

double estimateTime(const vector<int> &nums, const vector<int> &targets) {
    auto mx = max_element(targets.begin(), targets.end());
    auto e = estimateTimeOne(nums, *mx);
    return e * targets.size();
}

int main() {
    vector<int> nums = {3, -2, 5, -8, 6, -1};
    vector<int> targets = {3, -2, 5, -8, 6, -1};
    // vector<int> nums = {6, -2, 1};
    int target = 7;
    cout << estimateTime(nums, targets) << endl;
}

// int main() {
//     vector<int> nums = {3, -2, 5, -8, 6, -1};
//     // vector<int> nums = {6, -2, 1};
//     int target = 7;

//     vector<int> result = subsetSum(nums, target);

//     if (!result.empty()) {
//         cout << "Subset with sum " << target << " is: ";
//         for (int num : result) {
//             cout << num << " ";
//         }
//         cout << endl;
//     } else {
//         cout << "No subset with sum " << target << " exists." << endl;
//     }

//     return 0;
// }
