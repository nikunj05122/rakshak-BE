const AppError = require('./../utils/appError');
const catchAsync = require('./../utils/catchAsync');
const giveResponse = require('./../middleware/response');
const storageHelper = require('./../utils/storageHelper');

const storageHelperInstance = new storageHelper();

exports.uploadFile = catchAsync(async (req, res, next) => {
    if (!req.file)
        return next(new AppError('No files found.', 400));

    const file = await storageHelperInstance.uploadFile(req.file, "img")
    return giveResponse(res, 201, "Success", 'File was uploaded.', {
        ...file,
        type: req.file.mimetype
    });
});

exports.deleteFile = catchAsync(async (req, res, next) => {
    const { filePath } = req.query;
    await storageHelperInstance.deleteFile(filePath)
    return giveResponse(res, 201, "Success", 'File was deleted.');
});