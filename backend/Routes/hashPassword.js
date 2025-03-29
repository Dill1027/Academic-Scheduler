const bcrypt = require('bcryptjs');

const generateHash = async (password) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);
  } catch (err) {
    console.error("Error generating hash:", err);
  }
};

// Call the function with the password you want to hash
generateHash('plainpassword');
