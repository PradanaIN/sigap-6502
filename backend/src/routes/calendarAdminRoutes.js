const express = require('express');
const {
  handleGetLocalCalendar,
  handleUpdateLocalCalendar,
} = require('../controllers/calendarAdminController');

const router = express.Router();

router.get('/', handleGetLocalCalendar);
router.put('/', handleUpdateLocalCalendar);

module.exports = router;
