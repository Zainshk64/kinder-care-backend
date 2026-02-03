import express from "express"
import cors  from "cors"; 
import parentChildRoutes from "./routes/parents.child.routes.js";
import parentCaseRoutes from "./routes/parents.case.routes.js";
import parentAppointmentRoutes from "./routes/parents.appointment.routes.js";
import authRoutes from "./routes/auth.routes.js"
const app = express();
import clinicCaseRoutes from "./routes/clinic.case.routes.js";
import clinicAppointmentRoutes from "./routes/clinic.appointment.routes.js";




app.use(cors());
app.use(express.json({ limit: "2mb" }));

app.use("/api/auth" , authRoutes)

app.use("/api/parent/children", parentChildRoutes);
app.use("/api/parent/cases", parentCaseRoutes);
app.use("/api/parent/appointments", parentAppointmentRoutes);
app.use("/api/clinic/cases", clinicCaseRoutes);
app.use("/api/clinic/appointments", clinicAppointmentRoutes);


export default app ; 