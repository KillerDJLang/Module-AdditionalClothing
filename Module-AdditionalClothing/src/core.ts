import { DependencyContainer }  from "tsyringe";
import { IPostDBLoadMod }       from "@spt-aki/models/external/IPostDBLoadMod";
import { LogTextColor }         from "@spt-aki/models/spt/logging/LogTextColor";
import { ILogger }              from "@spt-aki/models/spt/utils/ILogger";
import { DatabaseServer }       from "@spt-aki/servers/DatabaseServer";
import { JsonUtil }             from "@spt-aki/utils/JsonUtil";
import { API }                  from "../../DJCore/src/api";

import * as moduleItems         from "../ModuleItems/Clothing.json";

const fs = require('fs');
const modName = "Additional Clothing Module";

class ModuleClothing implements IPostDBLoadMod
{
    private static apiDepCheck(): boolean 
    {
        const coreMod = "api.js";

        try { const coreApiPath = fs.readdirSync("./user/mods/DJCore/src").map(api => api.toLowerCase()); return coreApiPath.includes(coreMod)}
        catch { return false; }
    }
    
    /**
    * @param container
    */
    public postDBLoad(container: DependencyContainer): void 
    {
        const logger = container.resolve<ILogger>("WinstonLogger");
        const tables = container.resolve<DatabaseServer>("DatabaseServer").getTables();
        const jsonUtil = container.resolve<JsonUtil>("JsonUtil");
                
        if (!ModuleClothing.apiDepCheck()) { return logger.error(`[${modName}] Error, DJCore API is missing from the user/mods folder.\nPlease install correctly.`) }

		const coreAPI = container.resolve<API>("API");

        for (const topID in moduleItems.AdditionalClothingTops)
        {
            const topConfig = moduleItems.AdditionalClothingTops[topID]

            coreAPI.createClothingTop(topConfig, tables, jsonUtil);
        }

        for (const bottomID in moduleItems.AdditionalClothingBottoms)
        {
            const bottomConfig = moduleItems.AdditionalClothingBottoms[bottomID]

            coreAPI.createClothingBottom(bottomConfig, tables, jsonUtil);
        }

        this.loadModuleBanner(logger);
    }

    private loadModuleBanner(logger: ILogger)
    {
        logger.log(
            `[DJCore] ----------------------------------------------------------------`,
            LogTextColor.CYAN
        );
        logger.log(
            `[DJCore]               ${modName} Loaded`,
            LogTextColor.CYAN
        );
        logger.log(
            `[DJCore] ----------------------------------------------------------------`,
            LogTextColor.CYAN
        );
    }
}

module.exports = { mod: new ModuleClothing() };