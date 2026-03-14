require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Case = require('./models/Case');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Seeding data...');

    // Clear existing
    await User.deleteMany({});
    await Case.deleteMany({});

    // Create Users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@neoconnect.com',
      password: 'password123',
      role: 'Admin',
      department: 'IT'
    });

    const secretariat = await User.create({
      name: 'Secretariat Officer',
      email: 'sec@neoconnect.com',
      password: 'password123',
      role: 'Secretariat',
      department: 'Management'
    });

    const manager = await User.create({
      name: 'Case Manager John',
      email: 'manager@neoconnect.com',
      password: 'password123',
      role: 'Case Manager',
      department: 'HR'
    });

    const staff = await User.create({
      name: 'Staff Member Mary',
      email: 'staff@neoconnect.com',
      password: 'password123',
      role: 'Staff',
      department: 'Facilities'
    });

    console.log('Users created!');

    // Create Sample Case
    await Case.create({
      trackingId: 'NEO-2026-001',
      title: 'Broken AC in Block B',
      description: 'The AC has been leaking for 3 days and is not cooling properly.',
      category: 'Facilities',
      department: 'Facilities',
      location: 'Block B, 2nd Floor',
      severity: 'Medium',
      submitter: staff._id,
      status: 'New'
    });

    console.log('Seed completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
