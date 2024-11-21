// quick_example.cpp
#include <vector>
#include <algorithm>
#include <set>
#include <iostream>
#include "subsetSums2.cpp"
#include <emscripten/bind.h>

using namespace emscripten;

float lerp(float a, float b, float t) {
    return (1 - t) * a + t * b;
}

std::vector<int> intersect(std::vector<int> s1, std::vector<int> s2) {
  std::vector<int> out;
  set_intersection(s1.begin(),s1.end(),s2.begin(),s2.end(), std::back_inserter(out));
  return out;
}
EMSCRIPTEN_BINDINGS(my_module) {
    emscripten::function("lerp", &lerp);
    emscripten::function("intersect", &intersect);

    emscripten::function("subsetSums", &subsetSums);
    emscripten::function("estimateTime", &estimateTime);

    emscripten::register_vector<int>("vectorInt");
    emscripten::register_map<int,vector<int>>("mapIntVectorInt");
}

// int main() {
//   auto s1 = std::vector<int>{1,2,3};
//   auto s2 = std::vector<int>{2,4};
//   auto s3 = intersect(s1,s2);
//   for (auto &n:s3) {
//     std::cout << n << "\n";
//   }
// }