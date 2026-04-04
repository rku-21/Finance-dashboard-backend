import { Record } from "../models/record.model.js";

export const summaryData = async () => {
	const summary = await Record.aggregate([
		{
			$group: {
				_id: null,
				totalIncome: {
					$sum: {
						$cond: [{ $eq: ["$type", "income"] }, "$amount", 0],
					},
				},
				totalExpenses: {
					$sum: {
						$cond: [{ $eq: ["$type", "expense"] }, "$amount", 0],
					},
				},
			},
		},
		{
			$project: {
				_id: 0,
				totalIncome: 1,
				totalExpenses: 1,
				netBalance: { $subtract: ["$totalIncome", "$totalExpenses"] },
			},
		},
	]);

	if (!summary.length) {
		return {
			totalIncome: 0,
			totalExpenses: 0,
			netBalance: 0,
		};
	}

	return summary[0];
};

export const categoryWiseTotalsData = async () => {
	const result= await Record.aggregate([
		{
			$group: {
				_id: {
					category: "$category",
					type: "$type",
				},
				totalAmount: { $sum: "$amount" },
				count: { $sum: 1 },
			},
		},
		{
			$project: {
				_id: 0,
				category: "$_id.category",
				type: "$_id.type",
				totalAmount: 1,
				count: 1,
			},
		},
		{
			$sort: {
				totalAmount: -1,
			},
		},
	]);

	return result;
};

export const recentActivityData = async (limit = 5) => {
	limit = Number(limit) > 0 ? Number(limit) : 5;

	return await Record.aggregate([
		{
			$sort: {
				date: -1,
				createdAt: -1,
			},
		},
		{
			$limit:limit,
		},
		{
			$project: {
				_id: 1,
				amount: 1,
				type: 1,
				category: 1,
				date: 1,
				notes: 1,
				userId: 1,
			},
		},
	]);
};

export const trendsData = async (range = "monthly") => {
	const isWeekly = range === "weekly";
    return await Record.aggregate([
		{
			$group:{
			    _id:isWeekly?{
					year:{$isoWeekYear:"$date"},
					period:{$isoWeek:"$date"},
				} :{
					year:{$year:"$date"},
					period:{$month:"$date"}
				},
				income:{
					$sum:{
						$cond:[{$eq:["$type","income"]},"$amount",0]
					}

				},
				expenses:{
					$sum:{
						$cond:[{$eq:["$type","expense"]},"$amount",0]
					}
				}
			},
		},{
			$project:{
				_id:0,
				year:"$_id.year",
				period:"$_id.period",
				income:1,
				expenses:1,
				netBalance:{$subtract:["$income" ,"$expenses"]},
			}
		},
		{
			$sort:{
				year:1,
				period:1,
			}
		}
	]);
};
