export default function requireClinic(req, res, next) {
  console.log("req.user:", req.user);

  if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

  if (req.user.role !== "CLINIC") {
    return res.status(403).json({ success: false, message: "Clinic access only" });
  }

  if (!req.user.clinicId) {
    return res.status(403).json({ success: false, message: "clinicId not set for this clinic account" });
  }

  next();
}
