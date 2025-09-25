import mongoose from "mongoose";
import mainMongooseInstance from "../mongoConfig.js";
import jwt from "jsonwebtoken";
import uniqueValidator from "mongoose-unique-validator";
import * as dotenv from "dotenv";
if (!process.env.PORT) dotenv.config();

const secret = process.env.JWT_SECRET;

var ObjectId = mongoose.mongo.ObjectId;

let profile = new mongoose.Schema(
  {
    hashedPassword: String,
    changePasswordCode: String,
    emailConfirmed: { type: Boolean, default: false },
    emailConfirmationCode: { type: String },
    confirmationCode: { type: String }, //Used for account deletion and other stuff
    googleID: { type: String },
    storageUsage: { type: Number },
    email: { type: String },
    notificationsSeenAt: { type: Date, default: new Date() },
    //Banning
    isBanned: { type: Boolean, default: false },
    bannedAt: { type: Date },
    //

    name: { type: String },
    isSuperAdmin: { type: Boolean, default: false },
    accountDeleted: { type: Boolean, default: false },
    dateOfBirth: Date,
    gender: { type: String, default: "MALE" },

    username: { type: String, unique: true, required: true },
    profileImage: { type: Object },

    country: { type: String },
    state: { type: String },
    city: { type: String },
    totalMinutesUsed: { type: Number, default: 0 }, //Will use it to rank most important users

    //
    useCase: { type: String }, // What and how they are going to use the product
    awarenessSource: { type: String }, //Who told them about this product
    //

    currentBalance: { type: Number },

    profileImageOnboardingSkipped: { type: Boolean, default: false },

    dateOfBirthOnboardingSkipped: { type: Boolean, default: false },

    genderOnboardingSkipped: { type: Boolean, default: false },
  },
  { timestamps: true }
);

profile.index({
  createdAt: -1,
});

profile.index({
  searchableText: "text",
});

profile.index({ email: 1 });

profile.index({ username: 1 });

profile.methods.generateToken = function (aliasID) {
  let JWT_payload = {
    id: aliasID ? aliasID : this.id,
  };

  return jwt.sign(JWT_payload, secret, {
    expiresIn: "360 days",
  });
};

profile.plugin(uniqueValidator);

export default mainMongooseInstance.model("profile", profile);
