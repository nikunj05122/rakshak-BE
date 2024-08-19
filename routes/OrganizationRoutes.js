const express = require('express');
const { ADMIN, SUPER_ADMIN } = require('./../constant/types').USER;

const authController = require('./../controllers/authController');
const organisationController = require('./../controllers/organisationController');

const router = express.Router();

router
    .route('/')
    .get(organisationController.getAllOrganization)
    .post(authController.protect, authController.restrictTo(SUPER_ADMIN), organisationController.createOrganization);

router
    .route("/:id")
    .get(organisationController.getOneOrganization)
    .delete(authController.protect, authController.restrictTo(SUPER_ADMIN), organisationController.deleteOrganization)
    .patch(authController.protect, authController.restrictTo(ADMIN, SUPER_ADMIN), organisationController.updateOrganization);

module.exports = router;