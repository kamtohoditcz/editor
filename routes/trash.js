var trash = require('../model/trash');
//var category = require('../model/category');
const settings = require('../settings');

var express = require('express');
var router = express.Router();
var moment = require('moment');
// var sharp = require('sharp');
var fs = require('fs-extra');


var vyblejChybu = function (res) {
  return function (err) {
    // TODO adjust this for production
    res.status(500)
      .write(err)
      .end();
  }
}

// TODO do this automatically using pipes in views
var convertDates = function (odpadek) {
  odpadek.creation_date = moment(odpadek.creation_date).locale('cs').calendar();
  odpadek.last_edit_date = moment(odpadek.last_edit_date).locale('cs').fromNow();
  return odpadek;
}

// -----------------------------------------------------------------------------

// ideamaker
router.get('/napadovnik', function (req, res) {
  res.render('trash/ideamaker');
});

// list ideas
router.get('/napady', function (req, res) {
  var q = req.query.q;
  trash.listIdeas(q).then(function (napady) {
    res.json(napady);
  }).catch(vyblejChybu(res));
});

// create trash from idea
router.put('/napady', function (req, res) {
  trash.create(req.body)
    .then(function (id) {
      res.json({ id });
    })
    .catch(vyblejChybu(res));
});

// -----------------------------------------------------------------------------

// list categories
router.get('/kategorie', function (req, res) {
  var q = req.query.q;
  var t = req.query.t;
  trash.listCategories(q).then(function (kategorie) {
    res.json(kategorie);
  }).catch(vyblejChybu(res));
});

// ----------------------------------------------------------------------------

//TODO
//// upload-images - get
//router.get('/:id/nahraj-obrazky', function (req, res) {
//  trash
//    .listAll()
//    .then(function (odpadky) {
//      res.render('trash/upload-images', odpadky);
//    })
//    .catch(vyblejChybu(res));
//});

router.get('/bez-obrazku', function (req, res) {
  trash
    .sampleNoImage()
    .then(function (odpadky) {
      res.json(odpadky);
    })
    .catch(vyblejChybu(res));
});

// upload-image - get
router.get('/:id/nahraj-obrazek', function (req, res) {
  trash
    .read(req.params.id)
    .then(function (odpadek) {
      res.render('trash/upload-image', odpadek);
    })
    .catch(vyblejChybu(res));
});

const imageFieldName = 'image';

function uploadImage(req, res, next) {
  // No image to process
  if (!req.files || !req.files[imageFieldName])
    throw Error("No file found.");

  let fileObj = req.files[imageFieldName];

  if (!fileObj.mimetype in ['image/jpeg', 'image/png'])
    throw Error("Invalid file type: " + fileObj.mimetype);

  var randomName = fileObj.uuid;
  var resPath = `/uploads/trash/500x500-${randomName}.png`;
  var destPath = `${settings.PROJECT_DIR}/public${resPath}`;


  // Copy the original image - we don't care about errors here...
  fs.copy(fileObj.file, `${settings.PROJECT_DIR}/public/uploads/orig/${randomName}-${fileObj.filename}`, err => {
    if (err) return console.error('Failed to copy original file.', err);
  });

  // Store cropped
  // sharp(fileObj.file)
  //   .resize(500, 500)
  //   .crop(sharp.strategy.entropy)
  //   .on('error', function (err) {
  //     //console.log('ERROR: Failed to convert with err:', {err, fileObj});
  //     throw err;
  //   })
  //   .toFile(destPath)
  //   .then(() => {
  //     req.file = Object.assign({}, fileObj, {
  //       path: resPath,
  //     });
  //     next();
  //   })
  //   .catch((err) => {
  //     next(err);
  //   });
}

// upload-image - post
router.post('/:id/nahraj-obrazek', uploadImage, function (req, res) {
  if (req.file) {
    const id = req.params.id;
    const path = req.file.path;
    trash
      .read(id)
      .then((odpadek) => {
        odpadek.imagePath = path;
        return trash.update(id, odpadek)
      })
      .then(() => {
        res.json({ path });
      })
      .catch(vyblejChybu(res));
  } else {
    throw Error('Failed to upload image.');
  }
});

// ----------------------------------------------------------------------------

// list
router.get('/', function (req, res) {
  var q = req.query.q;
  var t = req.query.t;
  trash.listAll(q).then(function (odpadky) {
    if (t === 'json') {
      res.json(odpadky);
    } else {
      res.render('trash/list', {
        odpadky: odpadky
      });
    }
  }).catch(vyblejChybu(res));
});

// TODO neexistuje nejaky framework na CRUD? to je napicu si takle psat vsechno ruco.

// create - put
router.get('/novy', function (req, res) {
  res.render('trash/form');
});

// create - put
router.put('/', function (req, res) {
  trash.create(req.body)
    .then(function (id) {
      res.redirect(`/odpadky/${id}`);
    })
    .catch(vyblejChybu(res));
});

// read
router.get('/:id', function (req, res) {
  trash.read(req.params.id)
    .then((odpadek) => {
      if (!odpadek) {
        // TODO show some "do you want to create message?"
        res.redirect('/odpadky');
      } else {
        res.render('trash/show', convertDates(odpadek));
      }
    })
    .catch(vyblejChybu(res));
});

// update - get
router.get('/:id/upravit', function (req, res) {
  trash.read(req.params.id)
    .then(function (odpadek) {
      res.render('trash/form', odpadek);
    })
    .catch(vyblejChybu(res));
});

// update - post
router.post('/:id', function (req, res) {
  var id = req.params.id;
  trash.update(id, req.body)
    .then(function (odpadek) {
      res.redirect(`/odpadky/${id}`);
    })
    .catch(vyblejChybu(res));
});

// delete
router.delete('/:id', function (req, res) {
  trash
    .delete(req.params.id)
    .then(function (odpadek) {
      res.redirect('/odpadky');
    })
    .catch(vyblejChybu(res));
});


module.exports = router;
