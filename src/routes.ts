import express from 'express';
const Controller = require('./controller');
const router = express.Router();

router.get('/room/',Controller.getRoom);
router.get('/progetti/',Controller.getProgetti);
router.get('/utenti/',Controller.getUtenti);
router.get('/utenti/:id/',Controller.getUtenti);

module.exports = router;