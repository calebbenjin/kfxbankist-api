const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'Firstname is missing'],
    },
    lastName: {
      type: String,
      required: [true, 'Lastname is missing'],
    },
    title: {
      type: String,
    },
    gender: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
      required: [true, 'Email must be inserted'],
    },
    amount: {
      type: Number,
    },
    dob: {
      type: String,
    },
    address: {
      type: String,
    },
    phone: {
      type: String,
    },
    accountType: {
      type: String,
    },
    accountNumber: {
      type: String,
    },
    idType: {
      type: String,
    },
    currency: {
      type: String,
    },
    nationality: {
      type: String,
    },
    voulcherNum: {
      type: String,
    },
    validID: {
      type: String,
    },
    userImage: {
      type: String,
    },
    taskCode: {
      type: String,
    },
    referenceNum: {
      type: String,
    },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction'
      },
    ],
    password: {
      type: String,
      required: true
    },
    role: { type: String, required: true, default: 'user' },
  },
  {
    timestamps: true,
  }
)

userSchema.methods.matchPassword = function () {
  return this.password
}

const User = mongoose.model('User', userSchema)

module.exports = User
