const { findIndex } = require('lodash');
const multer = require('multer');

const fileTypes = ['image/jpeg', 'image/png'];

const checkfileType = fileType => {
  const index = findIndex(fileTypes, file => file === fileType);
  if (index === -1) return false;
  return true;
};

const fileFilter = (req, file, cb) => {
  // reject a file
  if (checkfileType(file.mimetype)) return cb(null, true);

  return cb(null, false);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileSize = 1024 * 1024 * 5;

const upload = multer({
  storage,
  limits: { fileSize },
  fileFilter
});

// const upload = multer({ storage });

module.exports = upload;
