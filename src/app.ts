import Express from "express";
import { getConfig , loadConfig } from "./utils/config";
import { establishConnection } from "./utils/db";
import { router as ApiRoutes } from "./routes";
import logger from "./utils/logger";
import cors from "cors";

const main = async ():Promise<void> =>{
    try{
        await loadConfig();
        await establishConnection();
        let app = Express();
        app.use(Express.json());
        app.use(cors(
            {
                origin:"*"
            }
        ))

        app.use("/api",ApiRoutes);

        app.listen(getConfig().port || 8000,()=>{
            logger.info("App started on port "+ (getConfig().port || 8000));
        })


    }catch(e){
        logger.error(e);
    }
}


main().then(()=>{
    logger.info("Server is up and Running")
});