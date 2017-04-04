var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	//res.redirect('/odpadky');
	res.render('test');
});

//-----------------------------------------------------------------------

var gm = require('gm').subClass({imageMagick: true});
var multer = require('multer')
var upload = multer({ dest: 'public/test', fileFilter }).single('image');
function fileFilter (req, file, cb) {
  switch (file.mimetype) {
    case 'image/jpeg':
    case 'image/png':
      cb(null, true);
      return;

    default:
      cb(null, false);
      return;
  }
}

router.post('/test/upload', upload, function(req, res, next) {
  if (!req.file) {
    res.json({ error: 'Obrázek se nepodařilo načíst.' });
  } else {

    // resize and remove EXIF profile data
    let oldPath = req.file.path;
    let newPath = req.file.path + '.' + req.file.mimetype.replace('image/', '');
    gm(oldPath)
    .resize(800, 800)
    .noProfile()
    .write(newPath, function (err) {
      if (!err) console.log('done');
      else console.log(err);

      res.json({path: newPath.replace('public', '')});

    });
  }
});

//-----------------------------------------------------------------------

module.exports = router;
