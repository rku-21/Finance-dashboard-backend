import mongoose from "mongoose";
import { Record } from "../models/record.model.js";

export const createRecord = async (data) => {
	const record = await Record.create(data);
	return record;
};

export const getRecords = async (filter) => {
    const query={};

    if(filter.type) query.type=filter.type;
    if(filter.category) query.category=filter.category;

    if(filter.startDate || filter.endDate){
        query.date={};

        if(filter.startDate){
            query.date.$gte=new Date(filter.startDate);
        }
        if(filter.endDate){
            query.date.$lte=new Date(filter.endDate);
        }
    }
     return await Record.find(query).sort({ createdAt: -1 });
};

export const getRecordById = async (id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		const error = new Error("invalid record id");
		error.statusCode = 400;
		throw error;
	}

	const record = await Record.findById(id);
	if (!record) {
		const error = new Error("record not found");
		error.statusCode = 404;
		throw error;
	}
	return record;
};

export const updateRecordById = async (id, data) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		const error = new Error("invalid record id");
		error.statusCode = 400;
		throw error;
	}

	const updatedRecord = await Record.findByIdAndUpdate(id, data, {
		new: true,
		runValidators: true,
	});

	if (!updatedRecord) {
		const error = new Error("record not found");
		error.statusCode = 404;
		throw error;
	}
	return updatedRecord;
};

export const deleteRecordById = async (id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		const error = new Error("invalid record id");
		error.statusCode = 400;
		throw error;
	}

	const deletedRecord = await Record.findByIdAndDelete(id);
	if (!deletedRecord) {
		const error = new Error("record not found");
		error.statusCode = 404;
		throw error;
	}
    return deletedRecord;
};
