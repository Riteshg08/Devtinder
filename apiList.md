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
- POST/request/send/:status/:userID
- POST/request/review/:status/:requestID


#userRouter
- GET/user/connection
- GET/user/request/received
- GET/user/feed - Gets you the profile of other users on platform


Status: ignore, interested, accepted, rejected
