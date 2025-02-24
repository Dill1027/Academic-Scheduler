const mongoose = require('mongoose');
require('dotenv').config(); // Load .env file

// Replace with your MongoDB connection string
const uri = process.env.MONGODB_URI;

async function main() {
  try {
    // Connect to MongoDB using Mongoose
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to MongoDB");

    // Define a schema
    const userSchema = new mongoose.Schema({
      name: String,
      age: Number,
    });

    // Create a model based on the schema
    const User = mongoose.model("User", userSchema);

    // Example: Create a new user
    const newUser = new User({ name: "Test User", age: 25 });
    await newUser.save();

    console.log("New user created:", newUser);
  } catch (e) {
    console.error("Error connecting to MongoDB", e);
  }
}

main().catch(console.error);
