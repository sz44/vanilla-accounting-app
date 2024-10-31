package main

import (
	"fmt"
	"log"
	"net/http"
)

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("request from hostname: %s url: %s", r.Host, r.URL)
		next.ServeHTTP(w, r)
	})
}

func sayHello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "heelloooo0000 again!")
}

type MyHandler struct {
	f func(http.ResponseWriter, *http.Request)
}

func (mh *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "myhandler")
}

// field or method???
// type MySruct struct {
// 	f func(int) int
// }

// type MyStruct struct {}
// func (ms *MyStruct) f(i int) int{
// 	return i + 10
// }

func main() {
	// turn sayHello (func) in to a HandlerFunc which as an object that satisfies the Handler interface
	helloHandler := http.HandlerFunc(sayHello)
	myNewHandler := MyHandler{}

	// http.Handle("/h/", helloHandler)
	// LoggingMiddleware takes a Handler and returns a Handler but with added logging
	logHelloHandler := LoggingMiddleware(helloHandler)
	http.Handle("/h/", logHelloHandler)
	fs := http.FileServer(http.Dir("."))
	strip := http.StripPrefix("/test/", fs)
	handler := LoggingMiddleware(strip)

	http.Handle("/test/", handler)
	http.Handle("/test/2/", &myNewHandler)
	http.Handle("/test/3/", LoggingMiddleware(&myNewHandler))

	port := ":1235"
	log.Printf("Listening on 127.0.0.1%s\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
