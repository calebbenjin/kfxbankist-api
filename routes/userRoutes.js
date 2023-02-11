const express = require('express')
const multer = require('multer');
const  path = require('path');

const {
  getAllUsers,
  deleteUser,
  getUser,
  updateUser,
  checkPaymentStatus,
  createAccount,
  loginUser,
} = require('./../controllers/userController')


const router = express.Router()

// const storage = multer.diskStorage({
//   destination(req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename(req, file, cb) {
//     cb(
//       null,
//       `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
//     )
//   },
// })

// function checkFileType(file, cb) {
//   const filetypes = /jpg|jpeg|png/
//   const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//   console.log(file)
//   const mimetype = filetypes.test(file.mimetype)

//   if (extname && mimetype) {
//     return cb(null, true)
//   } else {
//     cb('Images only!')
//   }
// }

// const upload = multer({
//   storage,
//   fileFilter: function (req, file, cb) {
//     checkFileType(file, cb)
//   },
// })

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
//   }
// });

// const upload = multer({ storage });

router.route('/').get(getAllUsers)
router.route('/status').post(checkPaymentStatus)
router.route('/signup').post(createAccount)
router.route('/authenticate').post(loginUser)

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser)

module.exports = router
