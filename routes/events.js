/*
  Rutas de usuarios / Auth
  host + /api/events
*/
const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');
const { isDateCorrect } = require('../helpers/isDate');
const { fieldsValidator } = require('../middlewares/fields-validator');
const { validateJWT } = require('../middlewares/validate-jwt');

//Validate all routers for middleware validateJWT
router.use(validateJWT);
//Router events
router.get('/', getEvents);
router.post(
  '/',
  [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Debe haber una fecha de inicio').custom(isDateCorrect),
    check('end', 'Debe haber una fecha de finalización').custom(isDateCorrect),
    fieldsValidator
  ],
  createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

module.exports = router;