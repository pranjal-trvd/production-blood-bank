const inventoryModel = require("../models/inventoryModel");
const userModel = require("../models/userModel");
const mongoose = require('mongoose');

//CREATE INVENTORY
const createInventoryController = async (req, res) => {
  try {
    const { email } = req.body;
    //validation
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new Error("User Not Found");
    }
    // if (req.body.inventoryType === "in" && user.role !== "donor") {
    //   throw new Error("Not a donor account");
    // }
    // if (req.body.inventoryType === "out" && user.role !== "hospital") {
    //   throw new Error("Not a hospital");
    // }

    if (req.body.inventoryType == "out") {
      const requestedBloodGroup = req.body.bloodGroup;
      const requestedQuantityOfBlood = req.body.quantity;
      const organisation = new mongoose.Types.ObjectId(req.body.userId);
      //calculate Blood Quanitity
      const totalInOfRequestedBlood = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "in",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      // console.log("Total In", totalInOfRequestedBlood);
      const totalIn = totalInOfRequestedBlood[0]?.total || 0;
      //calculate OUT Blood Quanitity

      const totalOutOfRequestedBloodGroup = await inventoryModel.aggregate([
        {
          $match: {
            organisation,
            inventoryType: "out",
            bloodGroup: requestedBloodGroup,
          },
        },
        {
          $group: {
            _id: "$bloodGroup",
            total: { $sum: "$quantity" },
          },
        },
      ]);
      const totalOut = totalOutOfRequestedBloodGroup[0]?.total || 0;

      //in & Out Calc
      const availableQuanityOfBloodGroup = totalIn - totalOut;
      //quantity validation
      if (availableQuanityOfBloodGroup < requestedQuantityOfBlood) {
        return res.status(500).send({
          success: false,
          message: `Only ${availableQuanityOfBloodGroup}ML of ${requestedBloodGroup.toUpperCase()} is available`,
        });
      }
      req.body.hospital = user?._id;
    } else {
      req.body.donor = user?._id;
    }

    //save record
    const inventory = new inventoryModel(req.body);
    await inventory.save();
    return res.status(201).send({
      success: true,
      message: "New Blood Reocrd Added",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error In Create Inventory API",
      error,
    });
  }
};

//Get all records
const getInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel.find({ organisation: req.body.userId }).populate("donor").populate("hospital").sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Got all records",
      inventory,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get all inventory",
      error,
    })
  }
}

//get blood records of three
const getRecentInventoryController = async (req, res) => {
  try {
    const inventory = await inventoryModel.find({organisation: req.body.userId}).limit(3).sort({createdAt: -1});
    return res.status(200).send({
      success: true,
      message: "Recent inventory data",
      inventory,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in recent inventory API",
      error,
    })
  }
}

//get donor record
const getDonorsController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //find donors
    const donorId = await inventoryModel.distinct('donor', {
      organisation
    });
    // console.log(donorId);
    const donors = await userModel.find({ _id: { $in: donorId } });
    return res.status(200).send({
      success: true,
      message: "Donor records fetched successfully",
      donors,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in donor records",
      error,
    })
  }
}

//get hospital record
const getHospitalController = async (req, res) => {
  try {
    const organisation = req.body.userId;
    //Get hospital id
    const hospitalId = await inventoryModel.distinct('hospital', { organisation })
    //find hospital
    const hospitals = await userModel.find({ _id: { $in: hospitalId } });
    return res.status(200).send({
      success: true,
      message: "Hospital data fetched successfully",
      hospitals,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in hospital records",
      error,
    })
  }
}

//get organisations
const getOrganisationController = async (req, res) => {
  try {
    const donor = req.body.userId;
    const orgId = await inventoryModel.distinct('organisation', { donor });
    //find organisation
    const organisations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "Org data fetched successfully",
      organisations
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in organisation records",
      error
    })
  }
}

//get org for hospital
const getOrganisationForHospitalController = async (req, res) => {
  try {
    const hospital = req.body.userId;
    const orgId = await inventoryModel.distinct('organisation', { hospital });
    //find organisation
    const organisations = await userModel.find({ _id: { $in: orgId } });
    return res.status(200).send({
      success: true,
      message: "Hospital Org data fetched successfully",
      organisations
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in hospital-organisation records",
      error
    })
  }
}


//get hospital blood records
const getInventoryHospitalController = async (req, res) => {
  try {
    const inventory = await inventoryModel.find(req.body.filters).populate("donor").populate("hospital").populate("organisation").sort({ createdAt: -1 });
    return res.status(200).send({
      success: true,
      message: "Got hospital consumer records",
      inventory,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error in get consumer inventory",
      error,
    })
  }
}

module.exports = { createInventoryController, getInventoryController, getDonorsController, getHospitalController, getOrganisationController, getOrganisationForHospitalController, getInventoryHospitalController,getRecentInventoryController };