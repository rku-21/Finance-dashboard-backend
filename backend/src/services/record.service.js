import mongoose from "mongoose";
import { Record } from "../models/record.model.js";

export const createRecord = async (data) => {
	const record = await Record.create(data);
	return record;
};

export const getRecords = async (filter) => {
	const query = { isDeleted: false };

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
	if (filter.search) {
        query.$or = [
            { type: { $regex: filter.search, $options: "i" } },
            { category: { $regex: filter.search, $options: "i" } }
        ];
    }

	const page = parseInt(filter.page) || 1;
    const limit = parseInt(filter.limit) || 10;
    const skip = (page - 1) * limit;

    const records = await Record.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);


     return records;
};

export const getRecordById = async (id) => {
	if (!mongoose.Types.ObjectId.isValid(id)) {
		const error = new Error("invalid record id");
		error.statusCode = 400;
		throw error;
	}

	const record = await Record.findById(id);
	if (record && record.isDeleted) {
		const error = new Error("record not found");
		error.statusCode = 404;
		throw error;
	}
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

	const updatedRecord = await Record.findOneAndUpdate({ _id: id, isDeleted: false }, data, {
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

	const deletedRecord = await Record.findOneAndUpdate(
		{ _id: id, isDeleted: false },
		{ isDeleted: true },
		{ new: true }
	);
	if (!deletedRecord) {
		const error = new Error("record not found");
		error.statusCode = 404;
		throw error;
	}
	return deletedRecord;
};
