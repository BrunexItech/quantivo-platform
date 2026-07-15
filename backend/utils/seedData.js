const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Tour = require('../models/Tour');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('📦 Connected to MongoDB');

    // ============================
    // Create admin if it doesn't exist
    // ============================
    let admin = await User.findOne({
      email: 'quantivo.itech@gmail.com'
    });

    if (!admin) {
      admin = await User.create({
        name: 'Quantivo',
        email: 'quantivo.itech@gmail.com',
        password: '@Quantivo@#',
        role: 'admin',
        isActive: true,
        dataConsent: true
      });

      console.log('✅ Admin user created');
    } else {
      console.log('ℹ️ Admin already exists');
    }

    // ============================
    // Create sample creator
    // ============================
    let creator = await User.findOne({
      email: 'creator@quantivo.co.ke'
    });

    if (!creator) {
      creator = await User.create({
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
    } else {
      console.log('ℹ️ Sample creator already exists');
    }

    // ============================
    // Sample tours
    // ============================

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

    let createdTours = 0;

    for (const tour of sampleTours) {
      const exists = await Tour.findOne({ title: tour.title });

      if (!exists) {
        await Tour.create(tour);
        createdTours++;
      }
    }

    console.log(`✅ ${createdTours} sample tours added`);

    console.log('\n🎉 Database initialization complete!');

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