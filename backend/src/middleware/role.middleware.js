export const autorizedRoles=(...allowedRoles)=>{
    return (req,res,next)=>{
        try{
            const userRole=req.user.roleId.name;

            if(!allowedRoles.includes(userRole)){
                return res.status(403).json({message:`access denied for ${userRole}`});
            }
            next();

        }catch(error){
            res.status(500).json({
                message:"internal server error",
                error:error.message,
            })

        }

    }
}