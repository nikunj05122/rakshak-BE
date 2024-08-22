const User = require("./../models/User");
const { USER } = require("./../constant/types");
const catchAsync = require("./../utils/catchAsync");

exports.createOfficer = catchAsync(async (req, res, next) => {

  if (req.user.role === USER.SUPER_ADMIN) {
    const isRightRole = [USER.ADMIN, USER.OFFICER].includes(req.body.role)
    if (!isRightRole)
      return next(new AppError('You are not authority to create user.', 400));
  } else if (req.user.role === USER.ADMIN) {
    const isRightRole = [USER.OFFICER].includes(req.body.role)
    if (!isRightRole)
      return next(new AppError('You are not authority to create user.', 400));
  }

  const newOfficer = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    pin: req.body.pin,
    pinConfirm: req.body.pinConfirm,
    role: req.body.role,
    number: req.body.number,
    email: req.body.email,
    profileImg: req.body.profileImg,
  });

  res.status(201).json({
    status: "success",
    data: { officer: newOfficer },
  });
});
