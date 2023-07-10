import { GatewayIntentBits } from "discord.js";
import type Config from "../models/config";

const config: Config = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  guildId: "1105785511622213634",
  embedsColor: "#00B700",

};

export default config;
