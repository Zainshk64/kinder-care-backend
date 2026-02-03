import Appointment from "../models/Appointment.model.js";

export const listClinicAppointments = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { status, page = 1, limit = 20 } = req.query;

    const query = { clinicId };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [items, total] = await Promise.all([
      Appointment.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("childId")
        .populate("parentId", "name email"),
      Appointment.countDocuments(query),
    ]);

    return res.json({
      success: true,
      data: items,
      meta: { total, page: Number(page), limit: Number(limit) },
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const approveAppointment = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    const { confirmedSlot, clinicMessage } = req.body;

    const appt = await Appointment.findOneAndUpdate(
      { _id: id, clinicId },
      { $set: { status: "CONFIRMED", confirmedSlot, clinicMessage } },
      { new: true }
    );

    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });
    return res.json({ success: true, data: appt });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    const { confirmedSlot, clinicMessage } = req.body;

    const appt = await Appointment.findOneAndUpdate(
      { _id: id, clinicId },
      { $set: { status: "RESCHEDULED", confirmedSlot, clinicMessage } },
      { new: true }
    );

    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });
    return res.json({ success: true, data: appt });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

export const cancelAppointmentByClinic = async (req, res) => {
  try {
    const clinicId = req.user.clinicId;
    const { id } = req.params;
    const { clinicMessage } = req.body;

    const appt = await Appointment.findOneAndUpdate(
      { _id: id, clinicId },
      { $set: { status: "CANCELLED", clinicMessage } },
      { new: true }
    );

    if (!appt) return res.status(404).json({ success: false, message: "Appointment not found" });
    return res.json({ success: true, data: appt });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
