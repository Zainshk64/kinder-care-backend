import Child from "../models/Child.model.js";
import Case from "../models/Case.model.js";
import Appointment from "../models/Appointment.model.js";

export const requestAppointment = async (req, res) => {
  const parentId = req.user.id;
  const { childId, clinicId, preferredSlots, caseId } = req.body;

  const child = await Child.findOne({ _id: childId, parentId });
  if (!child) return res.status(403).json({ success: false, message: "Invalid child access" });

  if (caseId) {
    const c = await Case.findOne({ _id: caseId, parentId, childId });
    if (!c) return res.status(403).json({ success: false, message: "Invalid case access" });
  }

  const appt = await Appointment.create({
    parentId,
    childId,
    clinicId,
    preferredSlots,
    caseId: caseId || undefined,
    status: "REQUESTED",
  });

  return res.status(201).json({ success: true, data: appt });
};

export const listAppointments = async (req, res) => {
  const parentId = req.user.id;
  const items = await Appointment.find({ parentId }).sort({ createdAt: -1 });
  return res.json({ success: true, data: items });
};

export const getAppointment = async (req, res) => {
  const parentId = req.user.id;
  const { id } = req.params;

  const appt = await Appointment.findOne({ _id: id, parentId });
  if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });

  return res.json({ success: true, data: appt });
};

export const cancelAppointment = async (req, res) => {
  const parentId = req.user.id;
  const { id } = req.params;

  const appt = await Appointment.findOne({ _id: id, parentId });
  if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });

  if (["CANCELLED", "COMPLETED"].includes(appt.status)) {
    return res.status(400).json({ success: false, message: "Cannot cancel" });
  }

  appt.status = "CANCELLED";
  await appt.save();

  return res.json({ success: true, data: appt });
};
