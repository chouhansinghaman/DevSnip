const express = require('express');
const auth = require('../middleware/auth');
const Snippet = require('../models/Snippet');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.find({ user: req.user.id });
    return res.json(snippets);
  } catch (error) {
    return res.status(500).json({ error: 'Unable to fetch snippets' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, code, language } = req.body;
    const snippet = await Snippet.create({
      title,
      code,
      language,
      user: req.user.id,
    });

    return res.status(201).json(snippet);
  } catch (error) {
    return res.status(400).json({ error: 'Unable to create snippet' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const snippet = await Snippet.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!snippet) {
      return res.status(404).json({ error: 'Snippet not found' });
    }

    await snippet.deleteOne();
    return res.json({ message: 'Snippet deleted' });
  } catch (error) {
    return res.status(400).json({ error: 'Unable to delete snippet' });
  }
});

module.exports = router;
