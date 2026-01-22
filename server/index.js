const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const financialRoutes = require("./routes/financial-records");

const app = express();
app.use(cors());
app.use(express.json());

const mongoURI =
  process.env.MONGO_URI ||
  "mongodb+srv://dhonikarthicksalem_db_user:d4UTy0WrnQBNCvqg@personalexpensetracker.rhkr5za.mongodb.net/";

mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Failed to connect to MongoDB:", err));

app.use("/financial-records", financialRoutes);

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on ${port}`));
