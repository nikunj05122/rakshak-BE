const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const giveResponse = require('./../middleware/response');

exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID.', 404));
    }

    return giveResponse(res, 204, "Success", 'Document was deleted.');
});

exports.updateOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    if (!doc) {
        return next(new AppError('No document found with that ID.', 404));
    }

    return giveResponse(res, 200, "Success", 'Document was updated.', doc);
});

exports.createOne = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body);

    return giveResponse(res, 201, "Success", 'Document was created.', doc);
});

exports.getOne = (Model, popOptions) => catchAsync(async (req, res, next) => {
    const doc = await Model.findById(req.params.id);

    if (!doc) {
        return next(new AppError('No document found with that ID.', 404));
    }

    return giveResponse(res, 200, "Success", 'Document list.', doc);
});

exports.getAll = Model => catchAsync(async (req, res, next) => {
    const doc = await Model.find();

    //  SEND RESPONSE
    return giveResponse(res, 200, "Success", 'Document list.', doc);
});