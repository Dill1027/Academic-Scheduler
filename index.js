require('dotenv').config(); // Load .env file
const mongoose = require('mongoose');

// Check if MongoDB URI is available
const uri = process.env.MONGO_URI;
if (!uri) {
  console.error("MongoDB URI is missing. Check your .env file.");
  process.exit(1);
}

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(uri);
   
    console.log("Connected to MongoDB");

    // Define a schema
    const userSchema = new mongoose.Schema({
      name: String,
      age: Number,
    });

    // Create a model
    const User = mongoose.model("User", userSchema);

    // Create a new user
    const newUser = new User({ name: "Test User", age: 25 });
    await newUser.save();
    console.log("New user created:", newUser);

  } catch (e) {
    console.error("Error connecting to MongoDB:", e);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log(" MongoDB connection closed.");
  }
}

// Run the script
main().catch(console.error);
