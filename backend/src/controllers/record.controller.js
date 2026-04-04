import {createRecord,deleteRecordById,getRecordById, getRecords,updateRecordById,} from "../services/record.service.js";

export const createRecordController = async (req, res) => {
  try {
    const { amount, type, category, date } = req.body;

    if (!amount || !type || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required details to create record",
      });
    }

    const record = await createRecord({ ...req.body, userId: req.user._id });

    res.status(201).json({
      success: true,
      message: "record created",
      record,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    } 
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const getRecordsController = async (req, res) => {
  try {
    const filter=req.query;
    const records = await getRecords(filter);
    res.status(200).json({
      success: true,
      records,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};



export const getRecordByIdController = async (req, res) => {
  try {
    const recordId=req.params.id;
    if(!recordId) return res.status(400).json({message:"please provide record id"});
    const record = await getRecordById(recordId);
    res.status(200).json({
      success: true,
      record,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const updateRecordController = async (req, res) => {
  try {
     const recordId=req.params.id;
     if(!recordId)return res.status(400).json({message:"please provide record id"});
     
    const record = await updateRecordById(recordId, req.body);
    res.status(200).json({
      success: true,
      message: "record updated",
      record,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};

export const deleteRecordController = async (req, res) => {
  try {
    const recordId=req.params.id;
    if(!recordId)return res.status(400).json({message:"please provide record id"});

    const deletedRecord=await deleteRecordById(recordId);
    res.status(200).json({
      deletedRecord,
      success: true,
      message: "record deleted",
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
    }
    res.status(500).json({
      success: false,
      message: "internal server error",
    });
  }
};