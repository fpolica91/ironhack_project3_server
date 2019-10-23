const express = require('express');
const router  = express.Router();
const Image = require('../models/Image')

// include CLOUDINARY:
const uploader = require('../configs/cloudinary-setup');

router.post('/upload', uploader.single("imageUrl"), async (req, res, next) => {

    if (!req.file) {
      next(new Error('No file uploaded!'));
      return;
    }
 try{
   await Image.create({
      name: req.file.secure_url,
      description: "An Image",
      imageUrl: req.file.secure_url
    })
    .then(data => res.json(data))
    .catch(err => res.json(err))
    // get secure_url from the file object and save it in the 
    // variable 'secure_url', but this can be any name, just make sure you remember to use the same in frontend
    //res.json({ secure_url: req.file.secure_url });
  }catch(err){
    res.json(err)
  }
 
})

module.exports = router;