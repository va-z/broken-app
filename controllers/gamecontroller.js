const { OK, INTERNAL_SERVER_ERROR } = require('http-status-codes');
const router = require('express').Router();
//
const Game = require('../db').import('../models/game');
const createErrorHandler = require('./../utils/createResponseErrorHandler');

router.get('/all', (req, res) => {
  const { user: { id } } = req;

  Game.findAll({
    where: { owner_id: id },
  })
    .then(
      (games) => res.status(OK).json({
        games,
        message: 'Data fetched.',
      }),
      createErrorHandler(res, INTERNAL_SERVER_ERROR),
    );
});

router.get('/:id', (req, res) => {
  const {
    params: { id },
    user: { id: ownerId },
  } = req;

  Game.findOne({
    where: {
      id: id,
      owner_id: ownerId,
    },
  })
    .then(
      (game) => res.status(OK).json({
        game,
        message: 'Data fetched',
      }),
      createErrorHandler(res, INTERNAL_SERVER_ERROR),
    );
});

router.post('/create', (req, res) => {
  const {
    body: {
      game: {
        title,
        studio,
        esrb_rating: esrbRating,
        user_rating: userRating,
        have_played: havePlayed,
      },
      user: { id: ownerId },
    },
  } = req;
  Game.create({
    title,
    owner_id: ownerId,
    studio,
    esrb_rating: esrbRating,
    user_rating: userRating,
    have_played: havePlayed,
  })
    .then(
      (game) => res.status(OK).json({
        game,
        message: 'Game created.',
      }),
      createErrorHandler(res, INTERNAL_SERVER_ERROR),
    );
});

router.put('/update/:id', (req, res) => {
  const {
    params: { id },
    body: {
      game: {
        title,
        studio,
        esrb_rating: esrbRating,
        user_rating: userRating,
        have_played: havePlayed,
      },
      user: { id: ownerId },
    },
  } = req;

  Game.update({
    title,
    studio,
    esrb_rating: esrbRating,
    user_rating: userRating,
    have_played: havePlayed,
  },
  {
    where: {
      id,
      owner_id: ownerId,
    },
  })
    .then(
      (game) => res.status(OK).json({
        game,
        message: 'Successfully updated.',
      }),
      createErrorHandler(res, INTERNAL_SERVER_ERROR),
    );
});

router.delete('/remove/:id', (req, res) => {
  const {
    params: { id },
    user: { id: ownerId },
  } = req;

  Game.destroy({
    where: {
      id,
      owner_id: ownerId,
    },
  })
    .then(
      (game) => res.status(OK).json({
        game,
        message: 'Successfully deleted',
      }),
      createErrorHandler(res, INTERNAL_SERVER_ERROR),
    );
});

module.exports = router;
