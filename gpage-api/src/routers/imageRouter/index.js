const multer = require('multer');
const { Image } = require('../../models');

const { authentication } = require('../../middlewares');

const upload = require('./upload');
// const { authentication } = require('../../middlewares');

const imageRouter = app => {
  // get all image
  app.get('/api/image/images', authentication, (req, res) => {
    const { _id } = req;

    Image.find({}).exec((error, images) => {
      if (error) {
        return res.status(500).json({ status: false });
      }

      console.log(images, images);

      return res.json({ images });
    });
  });

  // upload image
  app.post(
    '/api/image/upload',
    [authentication, upload.array('file')],
    async (req, res) => {
      const { files, _id } = req;

      const images = [];
      let i = 0;

      for (let index = 0; index < files.length; index += 1) {
        const newImage = new Image({
          idUser: _id,
          name: files[index].filename,
          size: files[index].size,
          url: files[index].path
        });

        images.push(newImage.save());
        i = index;
      }

      if (i === files.length - 1) {
        res.json(await Promise.all(images));
      }
    }
  );
};

module.exports = imageRouter;
