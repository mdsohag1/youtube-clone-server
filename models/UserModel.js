import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
   {
      name: {
         type: String,
         required: true,
      },
      email: {
         type: String,
         required: true,
         unique: true,
      },
      password: {
         type: String,
      },
      img: {
         type: String,
         default: "",
      },
      coverImg: {
         type: String,
         default: "",
      },
      subscriber: {
         type: Number,
         default: 0,
      },
      subscribedUsers: {
         type: [String],
         default: [],
      },
      fromGoogle: {
         type: Boolean,
         default: false,
      },
   },
   { timestamps: true }
);

export default mongoose.model("USer", UserSchema);
