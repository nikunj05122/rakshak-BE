const factory = require('./handlerFactory');
const Designation = require('./../models/Designation');

exports.getDesignation = factory.getOne(Designation);
exports.getAllDesignations = factory.getAll(Designation);
exports.createDesignation = factory.createOne(Designation);
exports.updateDesignation = factory.updateOne(Designation);
exports.deleteDesignation = factory.deleteOne(Designation);