import User from '../models/User.js'

export const seedAdmin = async () => {
  try {
    // Check if ANY admin exists
    const existingAdmin = await User.findOne({ role: 'admin' })
    
    if (existingAdmin) {
      // Ensure existing admin is verified
      if (!existingAdmin.isVerified) {
        existingAdmin.isVerified = true;
        await existingAdmin.save();
        console.log(' Existing admin verified.');
      }
      return 
    }

    // Create default admin
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@aquatrack.com',
      password: 'Admin@123', // Will be hashed by your User model
      address: 'Nairobi, Kenya',
      phone: '+254700000000',
      role: 'admin',
      isVerified: true // Skip email verification for admin
    })

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('DEFAULT ADMIN CREATED')
    console.log(' Email: admin@aquatrack.com')
    console.log(' Password: Admin@123')
    console.log('  CHANGE PASSWORD AFTER FIRST LOGIN!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  } catch (error) {
    console.error(' Seed admin error:', error.message)
  }
}