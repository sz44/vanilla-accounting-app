#include <stdio.h>

// step 1 maps in map

// myMap.set()
// map<int,int> myMap = {{1,2}};
// myMap[1] -> 2;
// myMap[2] = 4;

typedef struct Node {
  int val;
  struct Node *next;
} Node;

typedef struct Map {
  Node *keys;
} Map;

// keys[key1_add, key2_add, key3_add];
// key1 => val 
// key2 => val
// key3 => val

int* genContTable(int nums[]) {

}

int main() {
  Node l1 = {1};
  Node l2 = {2};
  Node l3 = {3};
  l1.next = &l2;

  printf("%i\n", (*l1.next).val);
  printf("%i\n", l1.next->val);
  return 0;
}