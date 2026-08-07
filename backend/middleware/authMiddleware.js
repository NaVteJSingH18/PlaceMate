import jwt from "jsonwebtoken";

const authMiddleware =  (req, res, next) => {
   const authHeader = req.headers.authorization;
   if(!authHeader){
        return res.status(401).json({
            message:"Access Denied",
        })
   }
   const token = authHeader.split(" ")[1];
};

export default authMiddleware;