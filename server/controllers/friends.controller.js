const User = require("../models/user.model");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select(
      "-password -refreshToken -activeSocket -updatedAt -createdAt -__v -chatRooms -friends -email"
    );
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    next(error);
  }
};
module.exports = { getAllUsers };
