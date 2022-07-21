const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "disconnect",
  description: "หยุดเพลงแล้วออกจากช่องเสียง",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["leave", "exit", "quit", "dc", "stop"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **คุณต้องอยู่ในช่องเสียงให้ใช้คำสั่งนี้**");
    if (!player) return client.sendTime(message.channel,"❌ | **ไม่มีเพลงเล่นในขณะนี้...**");
    await client.sendTime(message.channel,":notes: | **Disconnected!**");
    await message.react("✅");
    player.destroy();
  },

  SlashCommand: {
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      const guild = client.guilds.cache.get(interaction.guild_id);
      const member = guild.members.cache.get(interaction.member.user.id);

      if (!member.voice.channel)
        return client.sendTime(
          interaction,
          "❌ | **คุณต้องอยู่ในช่องเสียงเพื่อใช้คำสั่งนี้.**"
        );
      if (
        guild.me.voice.channel &&
        !guild.me.voice.channel.equals(member.voice.channel)
      )
        return client.sendTime(
          interaction,
          `❌ | **คุณต้องอยู่ใน ${guild.me.voice.channel} เพื่อใช้คำสั่งนี้.**`
        );

      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(
          interaction,
          "❌ | **ไม่มีเพลงเล่นในขณะนี้...**"
        );
      player.destroy();
      client.sendTime(
        interaction,
        ":notes: | **Disconnected!**"
      );
    },
  },
};
