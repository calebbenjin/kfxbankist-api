const User = require('../models/userModel')
const jwtDecode = require('jwt-decode')

const {
  createToken,
  hashPassword,
  verifyPassword,
  randomNumberGenerator,
  sendWelcomeEmail,
} = require('../util')

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json({
      status: 'success',
      data: {
        users,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    })
  }
}

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    })
  } catch (error) {
    res.status(400).json({
      status: 'fail',
      message: error,
    })
  }
}

exports.checkPaymentStatus = async (req, res) => {
  try {
    const { email, referenceNum } = req.body

    const user = await User.findOne({ email })

    res.status(200).json({
      status: 'success',
      message: 'Transaction Identified',
      data: user,
    })
  } catch (error) {
    res.status(401).json({
      status: 'fail',
      message: 'Invalid email or referenceNum',
    })
  }
}

exports.createTransaction = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    const trans = await Transaction.create(req.body)

    user.transactions.push(trans)
    user.save()

    res.json(user)
  } catch (error) {
    res.status(404).json({
      status: 'fail',
      message: 'Transactions not found',
    })
  }
}

exports.createAccount = async (req, res) => {
  try {
    const {
      email,
      firstName,
      lastName,
      password,
      address,
      gender,
      currency,
      nationality,
      idType,
      dob,
      phone,
      title,
      // validID,
      accountType,
    } = req.body

    // sendWelcomeEmail(email, firstName, password)

    const hashedPassword = await hashPassword(req.body.password)

    const baseNum = 9988737

    const userData = {
      email: email.toLowerCase(),
      firstName,
      lastName,
      address,
      gender,
      currency,
      nationality,
      idType,
      dob,
      phone,
      title,
      // validID,
      accountType,
      password: hashedPassword,
      role: 'user',
      referenceNum: randomNumberGenerator(baseNum),
      voulcherNum: randomNumberGenerator(baseNum),
      taskCode: randomNumberGenerator(baseNum),
      accountNumber: randomNumberGenerator(baseNum),
    }

    const existingEmail = await User.findOne({
      email: userData.email,
    }).lean()

    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' })
    }

    const newUser = new User(userData)
    const savedUser = await newUser.save()

    if (savedUser) {
      const token = createToken(savedUser)
      const decodedToken = jwtDecode(token)
      const expiresAt = decodedToken.exp

      const {
        firstName,
        lastName,
        email,
        address,
        gender,
        currency,
        nationality,
        idType,
        dob,
        phone,
        title,
        accountType,
        role,
        referenceNum,
        voulcherNum,
        taskCode,
      } = savedUser

      const userInfo = {
        firstName,
        lastName,
        email,
        address,
        gender,
        currency,
        nationality,
        idType,
        dob,
        phone,
        title,
        accountType,
        role,
        referenceNum,
        voulcherNum,
        taskCode,
      }

      return res.json({
        message: 'User created!',
        token,
        userInfo,
        expiresAt,
      })
    } else {
      return res.status(400).json({
        message: 'There was a problem creating your account',
      })
    }
  } catch (err) {
    return res.status(400).json({
      message: 'There was problem creating your account',
    })
  }
}

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      email,
    }).lean()

    if (!user) {
      return res.status(403).json({
        message: 'Wrong email or password.',
      })
    }

    const passwordValid = await verifyPassword(password, user.password)

    if (passwordValid) {
      const { password, bio, ...rest } = user
      const userInfo = Object.assign({}, { ...rest })

      const token = createToken(userInfo)

      const decodedToken = jwtDecode(token)
      const expiresAt = decodedToken.exp

      res.json({
        message: 'Authentication successful!',
        token,
        userInfo,
        expiresAt,
      })
    } else {
      res.status(403).json({
        message: 'Wrong email or password.',
      })
    }
  } catch (err) {
    return res.status(400).json({ message: 'Something went wrong.' })
  }
}

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (user) {
      ;(user.sendCurrency = req.body.sendCurrency || user.sendCurrency),
        (user.recieveCurrency =
          req.body.recieveCurrency || user.recieveCurrency),
        (user.reciever = req.body.reciever || user.reciever),
        (user.sendAmount = req.body.sendAmount || user.sendAmount),
        (user.amount = req.body.amount || user.amount),
        (user.recieveMethod = req.body.recieveMethod || user.recieveMethod),
        (user.recieveAmount = req.body.recieveAmount || user.recieveAmount),
        (user.pickupDate = req.body.pickupDate || user.pickupDate),
        (user.isPaid = req.body.isPaid || user.isPaid)
    }

    const updateUser = await user.save()

    res.status(200).json({
      status: 'Bio Updated!!',
      userInfo: updateUser,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'There was a problem updating your bio',
    })
  }
}

exports.deleteUser = async (req, res) => {
  try {
    const deleteUser = await User.findOneAndDelete(req.params.id)

    res.status(200).json({
      status: 'User Deleted!!',
      deleteUser,
    })
  } catch (error) {
    return res.status(400).json({
      message: 'There was a problem deleting the user.',
    })
  }
}
