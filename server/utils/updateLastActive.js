import User from "../models/user.model.js";

const updateLastActive = async (userId) => {
  await User.findByIdAndUpdate(userId, {
    lastActiveAt: new Date(),
  });
};

export default updateLastActive;
