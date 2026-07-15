const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Tour = require('../models/Tour');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Tour.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create admin user
    const admin = await User.create({
      name: 'Quantivo',
      email: 'quantivo.itech@gmail.com',
      password: '@Quantivo@#',
      role: 'admin',
      isActive: true,
      dataConsent: true
    });
    console.log('✅ Admin user created');

    // Create sample content creator
    const creator = await User.create({
      name: 'Sample Creator',
      email: 'creator@quantivo.co.ke',
      password: 'Creator123!',
      phone: '0712345678',
      role: 'content_creator',
      creatorProfile: {
        bio: 'Experienced virtual tour creator',
        mpesaNumber: '0712345678',
        totalEarnings: 0,
        pendingEarnings: 0,
        revenueSharePercentage: 70
      },
      dataConsent: true
    });
    console.log('✅ Sample creator created');

    // Create sample tours
    const sampleTours = [
      {
        title: 'Maasai Mara Wildlife Safari',
        description: 'Experience the Great Migration and the Big Five in this immersive 360° virtual safari.',
        category: 'wildlife',
        mediaType: '360_video',
        mediaUrl: 'https://example.com/maasai-mara-360.mp4',
        location: {
          county: 'Narok',
          subCounty: 'Kilgoris',
          ward: 'Mara'
        },
        price: {
          ksh: 300,
          usd: 2.31,
          eur: 2.13,
          jpy: 345
        },
        createdBy: creator._id,
        creatorName: creator.name,
        status: 'approved',
        isActive: true
      },
      {
        title: 'Nairobi National Museum',
        description: "Explore Kenya's rich history, culture, and paleontology exhibits.",
        category: 'history',
        mediaType: '360_image',
        mediaUrl: 'https://example.com/nairobi-museum.jpg',
        location: {
          county: 'Nairobi',
          subCounty: 'Nairobi Central',
          ward: 'Nairobi Central'
        },
        price: {
          ksh: 300,
          usd: 2.31,
          eur: 2.13,
          jpy: 345
        },
        createdBy: creator._id,
        creatorName: creator.name,
        status: 'approved',
        isActive: true
      },
      {
        title: 'Lake Turkana - Jade Sea',
        description: 'Visit the largest permanent desert lake in the world, known for its unique jade color.',
        category: 'geography',
        mediaType: '360_video',
        mediaUrl: 'https://example.com/lake-turkana.mp4',
        location: {
          county: 'Turkana',
          subCounty: 'Turkana Central',
          ward: 'Lodwar'
        },
        price: {
          ksh: 300,
          usd: 2.31,
          eur: 2.13,
          jpy: 345
        },
        createdBy: creator._id,
        creatorName: creator.name,
        status: 'approved',
        isActive: true
      }
    ];

    await Tour.insertMany(sampleTours);
    console.log(`✅ ${sampleTours.length} sample tours created`);

    console.log('\n🎉 Database seeded successfully!\n');

    console.log('👤 Admin');
    console.log('   Email: quantivo.itech@gmail.com');
    console.log('   Password: @Quantivo@#\n');

    console.log('👤 Sample Creator');
    console.log('   Email: creator@quantivo.co.ke');
    console.log('   Password: Creator123!');
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exitCode = 1;
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB');
    }
  }
};

seedDatabase();