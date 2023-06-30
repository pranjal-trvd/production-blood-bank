const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createInventoryController, getInventoryController, getDonorsController, getHospitalController, getOrganisationController, getOrganisationForHospitalController, getInventoryHospitalController, getRecentInventoryController } = require('../controllers/inventoryController');
const router = express.Router();

//routes
//ADD INVENTORY || POST
router.post('/create-inventory', authMiddleware, createInventoryController);

//GET ALL RECORDS || GET
router.get('/get-inventory', authMiddleware, getInventoryController);

//GET RECENT BLOOD RECORDS || GET
router.get('/get-recent-inventory', authMiddleware, getRecentInventoryController);

//GET HOSPITAL BLOOD RECORDS
router.post('/get-inventory-hospital', authMiddleware, getInventoryHospitalController);

//GET ALL DONORS || GET
router.get('/get-donors', authMiddleware, getDonorsController);

//GET ALL HOSPITALS || GET
router.get('/get-hospitals', authMiddleware, getHospitalController);

//GET ALL ORGANISATION || GET
router.get('/get-organisation', authMiddleware, getOrganisationController);

//GET ALL  for hospital || GET
router.get('/get-organisation-for-hospital', authMiddleware, getOrganisationForHospitalController);

module.exports = router;