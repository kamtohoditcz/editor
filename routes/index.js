var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.redirect('/odpadky');
	res.render('test');
});

//-----------------------------------------------------------------------

var sharp = require('sharp');
var Chance = require('chance');
var chance = new Chance();
var Promise = require('bluebird');

function handleFile(req, res, next) {
	// No image to process
	if (!req.files || !req.files.image)
		return next("No file found.");

  if (!req.files.image.mimetype in ['image/jpeg', 'image/png'])
    return next("Invalid file type: " + req.files.image.mimetype);

  var randomName = chance.guid(); //chance.word({length: 10});
  var resPath500 = `/uploads/trash/500x500-${randomName}.png`;
  var destPath500 = `public${resPath500}`;

  // Store cropped
  sharp(req.files.image.file)
    .resize(500, 500)
    .crop(sharp.strategy.entropy)
    .on('error', function(err) {
      console.log('failed 500 with err:', err);
    })
    .toFile(destPath500)
    .then(() => {
      req.file = Object.assign({}, req.files.image, {
        path: resPath500,
      });
      next();
    })
    .catch((err) => {
      next(err);
    });
}


router.post('/test/upload', handleFile, function(req, res, next) {
  if (!req.file) {
    res.json({ error: 'Obrázek se nepodařilo načíst.' });
  } else {
    return res.send({path: req.file.path});
  }
});

//-----------------------------------------------------------------------

module.exports = router;
