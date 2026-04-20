import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
    const token = req.cookies.token; // ← read from cookie

    if (!token) {
      return res.status(401).json({ message: "Unauthorized, no token" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export default authMiddleware;