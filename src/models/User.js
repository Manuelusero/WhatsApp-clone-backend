import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    verificationToken: {
        type: String,
        default: null,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },

      //Agregar contacts con el type : mongoose.Schema.Types.ObjectId
      // y el ref: 'User'
  },
  {
    timestamps: true, 
  }
);

const User = mongoose.model('User', userSchema);

export default User;
