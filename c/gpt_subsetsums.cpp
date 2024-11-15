#include <iostream>
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

vector<int> subsetSum(const vector<int>& nums, int target) {
    // Calculate the range of possible sums
    int minSum = 0, maxSum = 0;
    for (int num : nums) {
        if (num > 0) maxSum += num;
        else minSum += num;
    }

    int range = maxSum - minSum;
    int shift = -minSum; // Offset for negative sums

    // DP array to track achievable sums
    vector<bool> dp(range + 1, false);
    dp[shift] = true; // Zero sum is always possible

    // Parent map to track subsets
    unordered_map<int, int> parent; // sum -> contributing number

    // Update DP for each number
    for (int num : nums) {
        // Traverse backwards to avoid overwriting during updates
        for (int j = range; j >= 0; --j) {
            if (j - num >= 0 && j - num <= range && dp[j - num]) {
                if (!dp[j]) { // Only update if sum wasn't already achievable
                    dp[j] = true;
                    parent[j - shift] = num; // Store the contributing number
                }
            }
        }
    }

    // Check if the target sum is achievable
    if (!(target + shift >= 0 && target + shift <= range && dp[target + shift])) {
        return {}; // Return an empty vector if target sum is not achievable
    }

    // Retrieve the subset
    vector<int> result;
    int currSum = target;
    while (currSum != 0) {
        int contributingNum = parent[currSum];
        result.push_back(contributingNum);
        currSum -= contributingNum;
    }

    return result;
}

int main() {
    vector<int> nums = {3, -2, 5, -8, 6, -1};
    int target = 4;

    vector<int> result = subsetSum(nums, target);

    if (!result.empty()) {
        cout << "Subset with sum " << target << " is: ";
        for (int num : result) {
            cout << num << " ";
        }
        cout << endl;
    } else {
        cout << "No subset with sum " << target << " exists." << endl;
    }

    return 0;
}
