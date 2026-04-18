import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  // const user = req.body;
  try{
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  console.log(token);

  const userVerified = jwt.verify(token, process.env.JWT_SECRET);
  req.user = userVerified;

  next();
  }catch(err){
    return res.status(401).json({message: 'Invalid token'})
  }
};

export default authMiddleware;
