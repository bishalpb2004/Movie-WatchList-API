import jwt from 'jsonwebtoken'
import { prisma } from '../config/db.js';

// read token from the request
// check if token is valid
const authMiddleware = async (req, res, next) => {
    console.log("Auth middleware reached");
    let token;

    if (
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer")
    ) {
        token = req.headers.authorization.split(" ")[1] // ["Bearer", "etejejnej"]
    }else if(req.cookies?.jwt){
        token = req.cookies.jwt;
    }

    if (!token){
        res.status(401).json({
            error: "No token provided"
        })
    }

    try {
        // verify token and extract the user id
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: {id: decoded.id},
        });

        if(!user){
            return res.status(401).json({
                error: "User no longer exists!"
            })
        }

        req.user = user;
        next();

    }catch(err) {
        res.status(401).json({
            error: "Not authorised, token failed!"
        })
    }
}

export {authMiddleware};