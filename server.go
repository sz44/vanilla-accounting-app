package main

import (
	"log"
	"net/http"
)

func LoggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("request from hostname: %s url: %s", r.Host, r.URL)
		if next != nil {
			next.ServeHTTP(w, r)
		} else {
			w.Write([]byte("static content accessed from /static/"))
		}
	})
}

func main() {
	fs := http.FileServer(http.Dir("."))
	strip := http.StripPrefix("/static/", fs)
	handler := LoggingMiddleware(strip)

	http.Handle("/static/", LoggingMiddleware(handler))
	http.Handle("/", LoggingMiddleware(nil))

	port := ":1235"
	log.Printf("Listening on 127.0.0.1%s\n", port)
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal(err)
	}
}
