const express = require('express');
const {
  handleGetSchedule,
  handleUpdateSchedule,
  handleAddOverride,
  handleRemoveOverride,
  handleNextRunPreview,
} = require('../controllers/scheduleController');

const router = express.Router();

router.get('/', handleGetSchedule);
router.put('/', handleUpdateSchedule);
router.get('/next-run', handleNextRunPreview);
router.post('/overrides', handleAddOverride);
router.delete('/overrides/:date', handleRemoveOverride);

module.exports = router;
