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

func LoggingMiddleware2(next http.Handler) http.Handler {
	return Logger{next: next}
}

type Logger struct {
	next http.Handler
}

func (lf Logger) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	log.Printf("request from hostname: %s url: %s", r.Host, r.URL)
	lf.next.ServeHTTP(w, r)
}

type MyHandler struct{}

func (mh *MyHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "myhandler")
}

func sayHello(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "heelloooo0000 again!")
}

func main() {
	// turn sayHello (func) in to a HandlerFunc which as an object that satisfies the Handler interface
	helloHandler := http.HandlerFunc(sayHello)
	myNewHandler := MyHandler{}

	// http.Handle("/h/", helloHandler)
	// LoggingMiddleware takes a Handler and returns a Handler but with added logging
	logHelloHandler := LoggingMiddleware(helloHandler)
	logHelloHandler2 := LoggingMiddleware2(helloHandler)
	http.Handle("/h/", logHelloHandler)
	http.Handle("/h2/", logHelloHandler2)

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
