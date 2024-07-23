export function checkAuthenticated(req, res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.status(200).json({authStatus:'false'});
}
export function checkNotAuthenticated(req, res,next){

    if(req.isAuthenticated()){
        res.status(200).json({authStatus:'true'});
    }
    next();

}
