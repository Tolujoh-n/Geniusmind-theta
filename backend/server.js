const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.log(`Failed to connect to MongoDB: ${err.message}`);
});

// Routes
const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");
const walletRoutes = require("./routes/walletRoute"); // Import wallet routes
const participantsRouter = require("./routes/participants");

app.use("/api/quizzes", quizRoutes);
app.use("/api/users", userRoutes);
app.use("/api/participants", participantsRouter);
app.use("/api/wallet", walletRoutes); // Use wallet routes

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
