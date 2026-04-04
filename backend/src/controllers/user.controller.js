import { getAllUsers, createUser, getUserById, updateUserById, deleteUserById, updateUserStatusById } from "../services/user.service.js";

export const getAllusersController = async (req, res) => {
    try {
        const users = await getAllUsers({ role: req.query.role });
        res.status(200).json({
            success: true,
            users,
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
}

export const createUserController = async (req, res) => {
    try {
        const { name, email, role } = req.body;

        if (!name || !email || !role) {
            return res.status(400).json({
                success: false,
                message: "Please provide name, email and role",
            });
        }
        const user = await createUser(req.body);

        res.status(201).json({
            success: true,
            message: "user created successfully",
            user,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            })
        }
        res.status(500).json({
            success: false,
            message: "internal server error",
        });


    }
}

export const getUserbyIdController = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) return res.status(400).json({ success: false, message: "no userId provided" });

        const user = await getUserById(userId);
        res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            })

        }
        res.status(500).json({
            success: false,
            message: "internal server error",
        })
    }
}

export const updateUserController = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ success: false, message: "please provide userId" });
        }
        const user = await updateUserById(userId, req.body, req.user._id);
        res.status(200).json({
            success: true,
            message: "user updated",
            user: user,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            })

        }
        res.status(500).json({
            success: false,
            message: "internal server error",
        })

    };
}

export const updateUserStatusController = async (req, res) => {
    try {
        const userId = req.params.id;
        const { status } = req.body;

        if (!userId || !status) {
            return res.status(400).json({ success: false, message: "please provide userId and status" });
        }

        const user = await updateUserStatusById(userId, status, req.user._id);

        res.status(200).json({
            success: true,
            message: "user status updated",
            user,
        });
    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            })
        }
        res.status(500).json({
            success: false,
            message: "internal server error",
        });
    }
}

export const deleteUserController = async (req, res) => {
    try {
        const userId = req.params.id;
        if (!userId) return res.status(400).json({ success: false, message: "no userId provided" });
        const user = await deleteUserById(userId, req.user._id);

        res.status(200).json({
            success: true,
            message: "user deleted",
            deletedUser: user,
        });

    } catch (error) {
        if (error.statusCode) {
            return res.status(error.statusCode).json({
                success: false,
                message: error.message,
            })

        }
        res.status(500).json({
            success: false,
            message: "internal server error",
        })
    }
}
