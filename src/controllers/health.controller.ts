import { Request,Response } from "express";

const healthCheck = (req:Request,res:Response) => {
    res.json({status:"OK"});
}

export{healthCheck}