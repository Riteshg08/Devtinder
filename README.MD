IMP-1

->while making the express server we use app.use with different routes so the route "/" should be placed at the bottom 
-> If we placed at the top it will be excuted every time becoz "/" to everything eg "/test", "/abc"
-> Order of the routes matters


<!-- Postman -->
It is an API developement and testing tool used to send http requests(diffrenet http request like get,post,put,patch,delete) to servers and analyze the responses

<!-- IMP -->
If a route handler does not send a response, the client request remains pending because the server keeps the connection open until a response is sent or a timeout occurs.