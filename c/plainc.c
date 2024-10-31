#include <stdio.h>
#include <stdlib.h>

int* both(int *left, int sizeLeft, int *right, int sizeRight, int *sizeOut) {
    const int sz = sizeLeft < sizeRight ? sizeLeft : sizeRight;
    int *out = malloc(sz * sizeof(int));
    int op = 0;

    for (int i = 0; i<sizeLeft; i++) {
        for (int j = 0; j<sizeRight; j++) {
            if (left[i] == right[j]) {
                out[op++] = left[i];
                break;
            }
        }
    }

    *sizeOut = op;

    return out;
}

// incorrect
int* both2(int *left, int sizeLeft, int *right, int sizeRight) {
    const int sz = sizeLeft < sizeRight ? sizeLeft : sizeRight;
    int *out = malloc(sz * sizeof(int));
    int op = 0;

    for (int i = 0; i<sizeLeft; i++) {
        for (int j = 0; j<sizeRight; j++) {
            if (left[i] == right[j]) {
                out[op++] = left[i];
                break;
            }
        }
    }

    return out;
}

int main() {
    printf("hello :)\n");

    int sizeLeft = 5;
    int sizeRight = 4;
    int left[] = {1,2,3,4,5};
    int right[] = {4,5,6,7};
    // int* p = &sizeLeft;
    // int* p2 = left;
    // printf("p: %i, p2: %i \n", p ,p2);
    // printf("p: %i, p2: %i \n", sizeof(p) ,sizeof(p2));
    // printf("sizeof(sizeLeft): %i \n", sizeof(sizeLeft));

    int sizeOut;
    int *ptr = both(left, sizeLeft, right, sizeRight, &sizeOut);

    for (int i=0; i<sizeOut; i++) {
        if (i == sizeOut-1) {
            printf("%i", ptr[i]);
        } else {
            printf("%i, ", ptr[i]);
        }
    }

    printf("\n");
    free(ptr);

    return 0;
}