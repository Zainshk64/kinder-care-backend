import jwt from "jsonwebtoken"
import { _default } from "zod";

const auth = (req, res, next) => {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "Missing or invalid Authorization header" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid/expired token" });
  }
};

const allowRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user?.role) return res.status(401).json({ error: "Unauthorized" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden (role)" });
    next();
  };
};


export default auth; 