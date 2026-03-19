#Devtinder APIs

#authRouter
- POST/signup
- POST/login
- POST/logout

#profileRouter
- Get/profile/view
- PATCH/profile/edit
- PATCH/profile/passwordUpadet

#connectionRequestRouter
- POST/request/send/interested/:userID
- POST/request/send/ignored/:userID
- POST/request/review/accepted/:requestID
- POST/request/review/rejected/:requestID

#userRouter
- GET/user/connection
- GET/user/request/received
- GET/user/feed - Gets you the profile of other users on platform


Status: ignore, interested, accepted, rejected
