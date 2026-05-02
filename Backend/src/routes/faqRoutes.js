import express from 'express';
import FAQ from '../models/FAQ.js';
import { authenticateUser, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all public FAQs
// @route   GET /api/faqs
router.get('/', async (req, res) => {
  try {
    const faqs = await FAQ.find({ isPublic: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching FAQs' });
  }
});

// @desc    Get user's own asked questions
// @route   GET /api/faqs/my-questions
router.get('/my-questions', authenticateUser, async (req, res) => {
  try {
    const faqs = await FAQ.find({ askedBy: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching your questions' });
  }
});

// @desc    Ask a new question
// @route   POST /api/faqs/ask
router.post('/ask', authenticateUser, async (req, res) => {
  try {
    const { question, category } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    const faq = await FAQ.create({
      question,
      category: category || 'general',
      askedBy: req.user.id
    });

    res.status(201).json({ success: true, message: 'Question submitted. Our team will answer soon.', faq });
  } catch (error) {
    res.status(500).json({ message: 'Server error submitting question' });
  }
});

// @desc    Answer a question (Admin only)
// @route   PATCH /api/faqs/:id/answer
router.patch('/:id/answer', authenticateUser, adminOnly, async (req, res) => {
  try {
    const { answer, isPublic, category } = req.body;
    const faq = await FAQ.findById(req.params.id);

    if (!faq) return res.status(404).json({ message: 'FAQ not found' });

    if (answer !== undefined) faq.answer = answer;
    if (isPublic !== undefined) faq.isPublic = isPublic;
    if (category !== undefined) faq.category = category;

    await faq.save();
    res.status(200).json({ success: true, faq });
  } catch (error) {
    res.status(500).json({ message: 'Server error updating FAQ' });
  }
});

// @desc    Get all FAQs for admin management
// @route   GET /api/faqs/admin
router.get('/admin', authenticateUser, adminOnly, async (req, res) => {
  try {
    const faqs = await FAQ.find().populate('askedBy', 'name email').sort({ createdAt: -1 });
    res.status(200).json({ success: true, faqs });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching admin FAQs' });
  }
});

export default router;