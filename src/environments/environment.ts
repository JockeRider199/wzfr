import { GatewayIntentBits } from "discord.js";
import type Config from "../models/config";

const config: Config = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
  guildId: "704412119847796856",
  embedsColor: "#00B700",
};

export default config;
