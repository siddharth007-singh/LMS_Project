import jwt from 'jsonwebtoken';

const isAuthenticated = async(req, res, next)=> {
    try {
        const token  = req.cookies.token;
        if(!token) return res.status(401).json({success:false, message: "Unauthorized."});

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        if(!verified) return res.status(401).json({success:false, message: "Unauthorized."});

        req.id = verified.userId;
        next();

    } catch (error) {
        console.log(error);
    }
}

export default isAuthenticated;