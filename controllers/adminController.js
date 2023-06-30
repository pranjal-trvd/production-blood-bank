const userModel = require("../models/userModel");

//get donor list
const getDonorListController = async (req, res) => {
    try {
        const donorData = await userModel.find({ role: 'donor' }).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            totalCount: donorData.length,
            message: "Fetced Donor list",
            donorData,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in get donor list",
            error
        })
    }
}

//get hospital list
const getHospitalListController = async (req, res) => {
    try {
        const hospitalData = await userModel.find({ role: 'hospital' }).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            totalCount: hospitalData.length,
            message: "Fetced Hospital list",
            hospitalData,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in get Hospital list",
            error
        })
    }
}

//get org list
const getOrgListController = async (req, res) => {
    try {
        const orgData = await userModel.find({ role: 'organisation' }).sort({ createdAt: -1 });
        return res.status(200).send({
            success: true,
            totalCount: orgData.length,
            message: "Fetced Organisation list",
            orgData,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error in get Organisation list",
            error
        })
    }
}

//delete controller
const deleteDonorController = async (req, res) => {
    try {
        await userModel.findByIdAndDelete(req.params.id);
        return res.status(200).send({
            success: true,
            message: " Record Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Error while deleting ",
            error,
        });
    }
};

module.exports = { getDonorListController, getHospitalListController, getOrgListController, deleteDonorController, };