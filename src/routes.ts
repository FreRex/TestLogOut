import express from 'express';
const controllerSelect = require('./controllerSelect');
const router = express.Router();

//Verso API di lettura (SELECT)
router.get('/select/:table/',controllerSelect.getSelect);
router.get('/select/:table/:id/',controllerSelect.getSelect);

module.exports = router;