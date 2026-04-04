import {app,PORT} from "./app.js";
import {connectDB} from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import userRoutes from "./routes/user.routes.js";


app.use("/auth",authRoutes);
app.use("/records",recordRoutes);
app.use("/dashboard",dashboardRoutes);
app.use("/users",userRoutes);

const startServer=async()=>{
    try {
        await connectDB();
        console.log("database connected");

        app.listen(PORT,()=>{
            console.log(`server is running on ${PORT}`);
        })
    }catch(error){
        console.error(`failed to start server ${error.message}`);
    }
}
startServer();






