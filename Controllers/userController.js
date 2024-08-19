const User = require("./../models/User");
const { USER } = require("./../constant/types");
const catchAsync = require("./../utils/catchAsync");

exports.createOfficer = catchAsync(async (req, res, next) => {
  const newOfficer = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    pin: req.body.pin,
    pinConfirm: req.body.pinConfirm,
    role: USER.OFFICER,
    number: req.body.number,
    email: req.body.email,
    profileImg: req.body.profileImg,
  });

  res.status(201).json({
    status: "success",
    data: { officer: newOfficer },
  });
});
