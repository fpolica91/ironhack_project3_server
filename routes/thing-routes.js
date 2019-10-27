const express = require('express');
const router  = express.Router();

// include the model:
const Image = require('../models/Image');

router.get('/things', (req, res, next) => {
    Image.find()
    .then(imagesFromDB => {
        res.status(200).json(imagesFromDB)
    })
    .catch(err => next(err))
})

router.post('/things/create', (req, res, next) => {
    Image.create(req.body)
    .then( aNewThing => {
        // console.log('Created new thing: ', aNewThing);
        res.status(200).json(aNewThing);
    })
    .catch( err => next(err) )
})

module.exports = router;
