const express = require('express');
const { getDonorListController, getHospitalListController, getOrgListController, deleteDonorController } = require('../controllers/adminController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

//routes
//get donor list
router.get('/donor-list', authMiddleware, adminMiddleware, getDonorListController);

//get hospital list
router.get('/hospital-list', authMiddleware, adminMiddleware, getHospitalListController);

//get organisation list
router.get('/org-list', authMiddleware, adminMiddleware, getOrgListController);

//delete donor || delete
router.delete('/delete-donor/:id', authMiddleware, adminMiddleware, deleteDonorController)

module.exports = router;