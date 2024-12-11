# emcc -O3 -lembind -o code.js ./c/code.cpp -sALLOW_MEMORY_GROWTH=1 -sASSERTIONS=1

emcc -lembind ./c/code.cpp  \
	-o gluecode.js \
	-s ENVIRONMENT=web \
	-s MODULARIZE=1 \
	-s EXPORT_ES6=1 \
	-s SINGLE_FILE=1 \
	-s ALLOW_MEMORY_GROWTH=1
