import {
  ColorResolvable,
  EmbedBuilder,
  Message,
  TextChannel,
  MessageType
} from "discord.js";
import { Event } from "../models/event";

const event: Event = {
  settings: {
    enabled: true,
  },

  exec: async (_, msg: Message) => {
    if (!msg.guild || msg.author.bot) return;

    if (msg.type === MessageType.ChannelPinnedMessage) {
      await msg.delete();
		}

    if (
      msg.content.startsWith("!embed") &&
      msg.member!.permissions.has("ManageMessages")
    ) {
      const channel = msg.mentions.channels.first();
      const args = msg.content.trim().split(" ").slice(2);

      if (!channel) {
        return msg.reply({
          content: "Format: `!embed #salon #color texte`",
        });
      }

      const color = args[0];
      const text = args.slice(1).join(" ");

      if (!color || !color.startsWith("#") || !text || text.length <= 0) {
        return msg.reply({
          content: "Format: `!embed #salon #color texte`",
        });
      }

      if (channel instanceof TextChannel) {
        channel.send({
          embeds: [
            new EmbedBuilder()
              .setColor(color as ColorResolvable)
              .setDescription(text),
          ],
        });
      }

      msg.delete();
    }
  },
};

export default event;
