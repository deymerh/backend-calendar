const { response } = require('express');
const Event = require('../models/Event');

//getAllEvents
const getEvents = async (req, res = response) => {
  const events = await Event.find().populate('user', 'name');
  try {
    res.status(200).json({
      ok: true,
      events,
      msg: 'getEvents'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'Error en los eventos'
    })
  }
}
//Create new event
const createEvent = async (req, res = response) => {
  const event = new Event(req.body);
  try {
    if (!event) {
      res.status(400).json({
        ok: false,
        msg: 'Por favor envíe un evento'
      })
    }
    event.user = req.uid;
    const eventSaved = await event.save();
    console.log(event);
    res.status(200).json({
      ok: true,
      event: eventSaved,
      msg: 'evento gurdadado!'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'No se puedo guadar el evento'
    })
  }
}

const updateEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento con ese id no existe'
      })
    }
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tienes permiso para editar este evento'
      })
    }
    const newEvent = { ...req.body, user: uid };
    const eventUpdate = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });
    res.status(200).json({
      ok: true,
      event: eventUpdate,
      msg: 'Evento actualizado exitosamente!'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'No se puedo actualizar el evento'
    })
  }
}

const deleteEvent = async (req, res = response) => {
  const eventId = req.params.id;
  const uid = req.uid;
  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        ok: false,
        msg: 'El evento con ese id no existe'
      })
    }
    if (event.user.toString() !== uid) {
      return res.status(401).json({
        ok: false,
        msg: 'No tienes permiso para eliminar este evento'
      })
    }
    const eventDeleted = await Event.findByIdAndDelete(eventId);
    res.status(200).json({
      ok: true,
      event: eventDeleted,
      msg: 'Evento eliminado exitosamente!'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      ok: false,
      msg: 'No se pudo eliminar el evento'
    })
  }
}
module.exports = {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent
}