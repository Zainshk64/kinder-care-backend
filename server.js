import dotenv from "dotenv"
import connectDB from "./src/config/db.js"
import app from "./src/app.js"
dotenv.config()
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await connectDB();
    app.listen(PORT, () => console.log(`✅ Server running on ${PORT}`));
  } catch (err) {
    console.error("❌ Failed to start:", err);
    process.exit(1);
  }
})();
