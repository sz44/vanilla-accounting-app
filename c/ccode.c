#include <stdio.h>
#include <emscripten/emscripten.h>


int main() {
    printf("using wasm with c. Hello!\n");
    return 0;
}

#ifdef __cplusplus
#define EXTERN extern "C"
#else
#define EXTERN
#endif

EXTERN EMSCRIPTEN_KEEPALIVE void myFunction(int argc, char ** argv) {
    printf("MyFunction Called\n");
}

EXTERN EMSCRIPTEN_KEEPALIVE int sum(int a, int b) {
    return a + b;
}

// given 2 arrays a1, a2 check of any elemens in a1 are in a1 return an array of them
// given 2 sets return their intersection
EXTERN EMSCRIPTEN_KEEPALIVE int* both(int* left, int lenLeft, int* right, int lenRight) {
    
    for (int i = 0; i<lenLeft; i++) {
        printf("left[%i]: %i \n", i, left[i]);
    }
    for (int i = 0; i<lenRight; i++) {
        printf("right[%i]: %i \n", i, right[i]);
    }

    int minSize = lenLeft < lenRight ? lenLeft : lenRight; 
    int *out = malloc(minSize * sizeof(int));

    int op = 0;

    for (int i = 0; i < lenLeft; i++) {
        for (int j = 0; j < lenRight; j++) {
            if (left[i] == right[j]) {
                out[op++] = left[i];
                break;
            }
        }
    }

    for (int j = 0; j<minSize; j++) {
        printf("out[%i]: %i \n", j, out[j]);
    }

    return out;
}