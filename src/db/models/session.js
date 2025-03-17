import { model, Schema } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      require: true,
    },
    accessToken: { type: String, require: true },
    refreshToken: { type: String, require: true },
    accessTokenValidUntil: { type: Date, required: true },
    refreshTokenValidUntil: { type: Date, required: true },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);

export const SessionsCollection = model('Session', sessionSchema);
