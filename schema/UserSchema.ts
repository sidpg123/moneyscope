import mongoose, { Schema, Document, Model } from "mongoose";

interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

console.log("Existing models:", mongoose.models);
const User = mongoose.models.User || mongoose.model("User", userSchema);


export default User;
