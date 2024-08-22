const factory = require('./handlerFactory');
const catchAsync = require('./../utils/catchAsync');
const Organization = require('./../models/Organization');
const giveResponse = require('./../middleware/response');

exports.getAllOrganization = factory.getAll(Organization);
exports.getOneOrganization = factory.getOne(Organization);
exports.updateOrganization = factory.updateOne(Organization);
exports.deleteOrganization = factory.deleteOne(Organization);

exports.createOrganization = catchAsync(async (req, res, next) => {
    req.body["head"] = req.user.id;

    const organization = await Organization.create(req.body);

    return giveResponse(res, 200, "Success", '', organization);
});

exports.searchOrganization = catchAsync(async (req, res, next) => {
    const { name } = req.query;

    const searchPattern = new RegExp(name, 'i');

    const organization = await Organization.find({
        slug: searchPattern
    }).select("img name slug").limit(20);

    return giveResponse(res, 200, "Success", '', organization);
});
