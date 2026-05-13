import { AppDataSource } from "./config/data-source";
import dotenv from "dotenv"

dotenv.config();

import express = require("express");
import console = require("node:console");

const app = express()

app.get('/' , (req , res)=> {
    res.send("API is running")

})

const PORT = process.env.PORT || 3000;
AppDataSource.initialize()
  .then(() => {
    console.log("Database connected!");
    

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    ("Database connection failed:", err);
  });


