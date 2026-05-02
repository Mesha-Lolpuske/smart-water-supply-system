// config/seedFaq.js
import FAQ from '../models/FAQ.js';

export const seedFaqs = async () => {
  try {
    const count = await FAQ.countDocuments();
    if (count > 0) return; // Don't seed if data exists

    const originalFaqs = [
      {
        question: "What is AquaTrack?",
        answer: "AquaTrack is a smart water supply management system designed to help residents track water schedules, report leaks, and receive important announcements from the water department.",
        category: "general",
        isPublic: true
      },
      {
        question: "How do I update my profile information?",
        answer: "Navigate to the 'Profile' section from the sidebar and click 'Edit Profile'. You can update your name, contact details, and address there.",
        category: "general",
        isPublic: true
      },
      {
        question: "How do I report a water leak?",
        answer: "Go to the 'Reports' section and click 'New Report'. You can specify the type of issue, provide a location, and even upload photos to help our team identify the problem.",
        category: "reports",
        isPublic: true
      },
      {
        question: "How can I track the status of my report?",
        answer: "In the 'My Reports' section, you can see all your submitted reports and their current status (Pending, In Progress, or Resolved).",
        category: "reports",
        isPublic: true
      },
      {
        question: "How long does it take to resolve a reported issue?",
        answer: "Emergency issues like major pipe bursts are prioritized and usually addressed within 24 hours. Minor leaks may take 2-3 business days depending on the maintenance queue.",
        category: "reports",
        isPublic: true
      },
      {
        question: "Where can I see the water supply schedule?",
        answer: "The 'Schedules' section provides a real-time list and calendar view of water distribution windows for different areas. You can search for your specific location.",
        category: "schedules",
        isPublic: true
      },
      {
        question: "What should I do during an unannounced water outage?",
        answer: "First, check the 'Announcements' section for any emergency alerts. If no information is listed, please file a 'Water Outage' report immediately.",
        category: "schedules",
        isPublic: true
      }
    ];

    await FAQ.insertMany(originalFaqs);
    console.log('Original FAQs seeded successfully');
  } catch (error) {
    console.error('Error seeding FAQs:', error);
  }
};