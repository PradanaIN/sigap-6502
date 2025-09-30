const express = require('express');
const {
  handleGetSchedulePublic,
  handleNextRunPreviewPublic,
} = require('../controllers/scheduleController');

const router = express.Router();

router.get('/', handleGetSchedulePublic);
router.get('/next-run', handleNextRunPreviewPublic);

module.exports = router;
