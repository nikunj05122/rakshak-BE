const factory = require('./handlerFactory');
const Organization = require('./../models/Organization');
const catchAsync = require('./../utils/catchAsync');

exports.getAllOrganization = factory.getAll(Organization);
exports.getOneOrganization = factory.getOne(Organization);
exports.createOrganization = factory.createOne(Organization);
exports.updateOrganization = factory.updateOne(Organization);
exports.deleteOrganization = factory.deleteOne(Organization);

exports.searchOrganization = catchAsync(async (req, res, next) => {
    const { name } = req.query;

    const organization = await Organization.find({
        slug: {
            $in: [name.toLowerCase()]
        }
    });

    return giveResponse(res, 200, "Success", '', organization);
});
