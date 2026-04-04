import {categoryWiseTotalsData,recentActivityData,summaryData,trendsData,} from "../services/dashboard.service.js";

export const dashboardSummaryController = async (req, res) => {
	try {
		const summary = await summaryData();

		res.status(200).json({
			success: true,
			summary,
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


export const categoryWiseTotalsController = async (req, res) => {
	try {
		const categoryWiseTotals = await categoryWiseTotalsData();

		res.status(200).json({
			success: true,
			categoryWiseTotals,
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

export const recentActivityController = async (req, res) => {
	try {
		const { limit } = req.query;
		const recentActivity = await recentActivityData(limit);

		res.status(200).json({
			success: true,
			recentActivity,
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

export const trendsController = async (req, res) => {
	try {
		const range = req.query.range || "monthly";

		if (range !== "monthly" && range !== "weekly") {
			return res.status(400).json({
				success: false,
				message: "Trend range must be monthly or weekly",
			});
		}

		const trends = await trendsData(range);

		res.status(200).json({
			success: true,
			range,
			trends,
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
