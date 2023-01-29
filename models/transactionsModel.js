import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema(
  {
    type: { type: Boolean },
    accountNumber: { type: String },
    amount: { type: Number },
    bankName: { type: String },
    accountNumber: { type: String },
    narration: { type: String },
  },
  {
    timestamps: true,
  }
)