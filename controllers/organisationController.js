const factory = require('./handlerFactory');
const Organization = require('./../models/Organization');
const catchAsync = require('./../utils/catchAsync');

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

    const organization = await Organization.find({
        slug: {
            $in: [name.toLowerCase()]
        }
    }).limit(20);

    return giveResponse(res, 200, "Success", '', organization);
});
