const authAdmin = (req,res,next) =>{
    const token = "xyz";
    const isAuthorized = token === "xyz";
    if(!isAuthorized){
        res.status(401).send("Unauthorized");
    }
    else{
        next();
    }
}

const authUser = (req,res,next) =>{
    const token = "xyz";
    const isAuthorized = token === "xyz";
    if(!isAuthorized){
        res.status(401).send("Unauthorized");
    }
    else{
        next();
    }
}

module.exports = {
    authAdmin,
    authUser,
};