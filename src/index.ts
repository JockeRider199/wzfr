import { config as envConfig } from "dotenv";

import { Client } from "./models/client";
import { init as initDB } from "./helpers/database";  

envConfig();
const client = new Client();

async function main(): Promise<void> {
  await client.loadEvents();
  await client.loadSlashCommands();
  await initDB();

  if (process.env.CACHE === "clear") {
    console.log("Resetting cache");
    await client.unSyncInteractions();
  }

  await client.syncInteractionsForGuild(client.getConfig().guildId, {
    slashCommands: true,
  });

  if (process.env.PRODUCTION == "TRUE") {
    await client.login(process.env.PROD_CLIENT_TOKEN);
  } else {
    await client.login(process.env.CLIENT_TOKEN);
  }
}

main();
