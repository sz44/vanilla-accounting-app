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