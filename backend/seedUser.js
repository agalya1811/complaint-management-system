// seedUser.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Define schema (same as models/User.js)
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  role: String
});
const User = mongoose.model('User', userSchema);

// Connect and insert
mongoose.connect('mongodb://localhost:27017/complaint_system')
  .then(async () => {
    const hashedPassword = bcrypt.hashSync('123456', 10); // plain password: 123456

    await User.create([
      { username: 'client1', password: hashedPassword, role: 'client' },
      { username: 'support1', password: hashedPassword, role: 'support' },
      { username: 'tech1', password: hashedPassword, role: 'technician' },
    ]);

    console.log('✅ Users inserted');
    mongoose.disconnect();
  })
  .catch(err => console.error('❌ MongoDB Error:', err));
