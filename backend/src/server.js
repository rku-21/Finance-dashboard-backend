import {app,PORT} from "./app.js";
import {connectDB} from "./config/db.js";

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






