import { Challenge } from '../types';

export const CODING_CHALLENGES: Challenge[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    category: 'Array & Hash Table',
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.`,
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0, 1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1, 2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0, 1]',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    templates: {
      python: `# NextLeap Practice: Two Sum
import sys

def two_sum(nums, target):
    # Time Complexity: O(n), Space Complexity: O(n)
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []

# Read inputs from STDIN
if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(result)
`,
      javascript: `// NextLeap Practice: Two Sum
function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}

const nums = [2, 7, 11, 15];
const target = 9;
console.log(JSON.stringify(twoSum(nums, target)));
`,
      c: `// NextLeap Practice: Two Sum (C99)
#include <stdio.h>
#include <stdlib.h>

void twoSum(int* nums, int numsSize, int target, int* res) {
    for (int i = 0; i < numsSize; i++) {
        for (int j = i + 1; j < numsSize; j++) {
            if (nums[i] + nums[j] == target) {
                res[0] = i;
                res[1] = j;
                return;
            }
        }
    }
}

int main() {
    int nums[] = {2, 7, 11, 15};
    int target = 9;
    int res[2] = {0};
    twoSum(nums, 4, target, res);
    printf("[%d, %d]\\n", res[0], res[1]);
    return 0;
}
`,
      cpp: `// NextLeap Practice: Two Sum (C++17)
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> seen;
    for (int i = 0; i < nums.size(); ++i) {
        int complement = target - nums[i];
        if (seen.count(complement)) {
            return {seen[complement], i};
        }
        seen[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> ans = twoSum(nums, target);
    cout << "[" << ans[0] << ", " << ans[1] << "]" << endl;
    return 0;
}
`,
      java: `// NextLeap Practice: Two Sum (Java 17)
import java.util.HashMap;
import java.util.Map;
import java.util.Arrays;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] nums = {2, 7, 11, 15};
        int target = 9;
        int[] result = twoSum(nums, target);
        System.out.println(Arrays.toString(result));
    }
}
`,
    },
    testCases: [
      {
        id: 'tc-1',
        input: 'nums = [2, 7, 11, 15], target = 9',
        expectedOutput: '[0, 1]',
        status: 'pending',
      },
      {
        id: 'tc-2',
        input: 'nums = [3, 2, 4], target = 6',
        expectedOutput: '[1, 2]',
        status: 'pending',
      },
      {
        id: 'tc-3',
        input: 'nums = [3, 3], target = 6',
        expectedOutput: '[0, 1]',
        status: 'pending',
      },
      {
        id: 'tc-4',
        input: 'nums = [-1, -2, -3, -4, -5], target = -8',
        expectedOutput: '[2, 4]',
        status: 'pending',
      },
    ],
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    category: 'Two Pointers & Strings',
    description: `A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.

Given a string \`s\`, return \`true\` if it is a palindrome, or \`false\` otherwise.`,
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: 'true',
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: 'false',
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: 'true',
      },
    ],
    constraints: [
      '1 <= s.length <= 2 * 10^5',
      's consists only of printable ASCII characters.',
    ],
    templates: {
      python: `# NextLeap Practice: Valid Palindrome
def is_palindrome(s: str) -> bool:
    filtered = [c.lower() for c in s if c.isalnum()]
    return filtered == filtered[::-1]

if __name__ == "__main__":
    s = "A man, a plan, a canal: Panama"
    print("true" if is_palindrome(s) else "false")
`,
      javascript: `// NextLeap Practice: Valid Palindrome
function isPalindrome(s) {
    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0, right = clean.length - 1;
    while (left < right) {
        if (clean[left] !== clean[right]) return false;
        left++;
        right--;
    }
    return true;
}

const s = "A man, a plan, a canal: Panama";
console.log(isPalindrome(s) ? "true" : "false");
`,
      c: `// NextLeap Practice: Valid Palindrome
#include <stdio.h>
#include <ctype.h>
#include <stdbool.h>
#include <string.h>

bool isPalindrome(const char* s) {
    int i = 0, j = strlen(s) - 1;
    while (i < j) {
        while (i < j && !isalnum((unsigned char)s[i])) i++;
        while (i < j && !isalnum((unsigned char)s[j])) j--;
        if (tolower((unsigned char)s[i]) != tolower((unsigned char)s[j])) return false;
        i++;
        j--;
    }
    return true;
}

int main() {
    const char* s = "A man, a plan, a canal: Panama";
    printf("%s\\n", isPalindrome(s) ? "true" : "false");
    return 0;
}
`,
      cpp: `// NextLeap Practice: Valid Palindrome
#include <iostream>
#include <string>
#include <cctype>

using namespace std;

bool isPalindrome(const string& s) {
    int l = 0, r = s.size() - 1;
    while (l < r) {
        while (l < r && !isalnum(s[l])) l++;
        while (l < r && !isalnum(s[r])) r--;
        if (tolower(s[l]) != tolower(s[r])) return false;
        l++;
        r--;
    }
    return true;
}

int main() {
    string s = "A man, a plan, a canal: Panama";
    cout << (isPalindrome(s) ? "true" : "false") << endl;
    return 0;
}
`,
    },
    testCases: [
      {
        id: 'tc-1',
        input: 's = "A man, a plan, a canal: Panama"',
        expectedOutput: 'true',
        status: 'pending',
      },
      {
        id: 'tc-2',
        input: 's = "race a car"',
        expectedOutput: 'false',
        status: 'pending',
      },
      {
        id: 'tc-3',
        input: 's = " "',
        expectedOutput: 'true',
        status: 'pending',
      },
    ],
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray (Kadane\'s Algorithm)',
    difficulty: 'Medium',
    category: 'Dynamic Programming & Array',
    description: `Given an integer array \`nums\`, find the subarray with the largest sum, and return its sum.

A subarray is a contiguous non-empty sequence of elements within an array.`,
    examples: [
      {
        input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]',
        output: '6',
        explanation: 'The subarray [4,-1,2,1] has the largest sum 6.',
      },
      {
        input: 'nums = [1]',
        output: '1',
      },
      {
        input: 'nums = [5,4,-1,7,8]',
        output: '23',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    templates: {
      python: `# NextLeap Practice: Kadane's Algorithm
def max_sub_array(nums):
    max_sum = nums[0]
    curr_sum = 0
    for n in nums:
        curr_sum = max(n, curr_sum + n)
        max_sum = max(max_sum, curr_sum)
    return max_sum

nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
print(max_sub_array(nums))
`,
      javascript: `// NextLeap Practice: Kadane's Algorithm
function maxSubArray(nums) {
    let maxSum = nums[0];
    let currSum = 0;
    for (const n of nums) {
        currSum = Math.max(n, currSum + n);
        maxSum = Math.max(maxSum, currSum);
    }
    return maxSum;
}

const nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4];
console.log(maxSubArray(nums));
`,
      c: `// NextLeap Practice: Kadane's Algorithm
#include <stdio.h>

int max(int a, int b) { return a > b ? a : b; }

int maxSubArray(int* nums, int numsSize) {
    int maxSum = nums[0];
    int currSum = 0;
    for (int i = 0; i < numsSize; i++) {
        currSum = max(nums[i], currSum + nums[i]);
        maxSum = max(maxSum, currSum);
    }
    return maxSum;
}

int main() {
    int nums[] = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    printf("%d\\n", maxSubArray(nums, 9));
    return 0;
}
`,
    },
    testCases: [
      {
        id: 'tc-1',
        input: 'nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]',
        expectedOutput: '6',
        status: 'pending',
      },
      {
        id: 'tc-2',
        input: 'nums = [1]',
        expectedOutput: '1',
        status: 'pending',
      },
      {
        id: 'tc-3',
        input: 'nums = [5, 4, -1, 7, 8]',
        expectedOutput: '23',
        status: 'pending',
      },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    description: `Given a string \`s\` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.`,
    examples: [
      {
        input: 's = "()"',
        output: 'true',
      },
      {
        input: 's = "()[]{}"',
        output: 'true',
      },
      {
        input: 's = "(]"',
        output: 'false',
      },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consists of parentheses only \'()[]{}\'.',
    ],
    templates: {
      python: `# NextLeap Practice: Valid Parentheses
def is_valid(s: str) -> bool:
    stack = []
    mapping = {')': '(', '}': '{', ']': '['}
    for char in s:
        if char in mapping:
            top = stack.pop() if stack else '#'
            if mapping[char] != top:
                return False
        else:
            stack.append(char)
    return not stack

s = "()[]{}"
print("true" if is_valid(s) else "false")
`,
      javascript: `// NextLeap Practice: Valid Parentheses
function isValid(s) {
    const stack = [];
    const map = { ')': '(', '}': '{', ']': '[' };
    for (const char of s) {
        if (map[char]) {
            if (stack.pop() !== map[char]) return false;
        } else {
            stack.push(char);
        }
    }
    return stack.length === 0;
}

const s = "()[]{}";
console.log(isValid(s) ? "true" : "false");
`,
      cpp: `// NextLeap Practice: Valid Parentheses
#include <iostream>
#include <stack>
#include <unordered_map>

using namespace std;

bool isValid(string s) {
    stack<char> st;
    unordered_map<char, char> m = {{')', '('}, {'}', '{'}, {']', '['}};
    for (char c : s) {
        if (m.count(c)) {
            if (st.empty() || st.top() != m[c]) return false;
            st.pop();
        } else {
            st.push(c);
        }
    }
    return st.empty();
}

int main() {
    string s = "()[]{}";
    cout << (isValid(s) ? "true" : "false") << endl;
    return 0;
}
`,
    },
    testCases: [
      {
        id: 'tc-1',
        input: 's = "()"',
        expectedOutput: 'true',
        status: 'pending',
      },
      {
        id: 'tc-2',
        input: 's = "()[]{}"',
        expectedOutput: 'true',
        status: 'pending',
      },
      {
        id: 'tc-3',
        input: 's = "(]"',
        expectedOutput: 'false',
        status: 'pending',
      },
    ],
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    category: 'Binary Search',
    description: `Given an array of integers \`nums\` which is sorted in ascending order, and an integer \`target\`, write a function to search \`target\` in \`nums\`.

If \`target\` exists, then return its index. Otherwise, return \`-1\`.
You must write an algorithm with \`O(log n)\` runtime complexity.`,
    examples: [
      {
        input: 'nums = [-1,0,3,5,9,12], target = 9',
        output: '4',
        explanation: '9 exists in nums and its index is 4',
      },
      {
        input: 'nums = [-1,0,3,5,9,12], target = 2',
        output: '-1',
        explanation: '2 does not exist in nums so return -1',
      },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique.',
      'nums is sorted in ascending order.',
    ],
    templates: {
      python: `# NextLeap Practice: Binary Search
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

nums = [-1, 0, 3, 5, 9, 12]
target = 9
print(binary_search(nums, target))
`,
      javascript: `// NextLeap Practice: Binary Search
function binarySearch(nums, target) {
    let left = 0, right = nums.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (nums[mid] === target) return mid;
        if (nums[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

const nums = [-1, 0, 3, 5, 9, 12];
const target = 9;
console.log(binarySearch(nums, target));
`,
    },
    testCases: [
      {
        id: 'tc-1',
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 9',
        expectedOutput: '4',
        status: 'pending',
      },
      {
        id: 'tc-2',
        input: 'nums = [-1, 0, 3, 5, 9, 12], target = 2',
        expectedOutput: '-1',
        status: 'pending',
      },
    ],
  },
];
