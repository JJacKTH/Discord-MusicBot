const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  description: "ล้างคิวเพลงทั้งหมด (ทั้งDiscord)",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["cl", "cls"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let player = await client.Manager.get(message.guild.id);
    if (!player)
      return client.sendTime(
        message.channel,
        "❌ | **ไม่มีเพลงเล่นอยู่ในคณะนี้...**"
      );

    if (!player.queue || !player.queue.length || player.queue.length === 0)
      return client.sendTime(message.channel, "❌ | **ไม่มีเพลงเล่นอยู่ในคณะนี้...**");
      if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **คุณต้องอยู่ในช่องเสียงเพื่อเล่นอะไรบางอย่าง!**");
      if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **คุณต้องอยู่ในช่องเสียงเดียวกับฉันจึงจะใช้คำสั่งนี้ได้!**");
    player.queue.clear();
    await client.sendTime(message.channel, "✅ | **เคียร์คิวเพลง!**");
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
      if (!member.voice.channel) return client.sendTime(interaction, "❌ | คุณต้องอยู่ในช่องเสียงเพื่อเล่นอะไรบางอย่าง.");
      if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **คุณต้องอยู่ในช่องเสียงเดียวกับฉันจึงจะใช้คำสั่งนี้ได้!**");
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(interaction, "❌ | **ไม่มีเพลงเล่นอยู่ในคณะนี้...**");

      if (!player.queue || !player.queue.length || player.queue.length === 0)
        return client.sendTime(interaction, "❌ | **ไม่มีเพลงเล่นอยู่ในคณะนี้...**");
      player.queue.clear();
      await client.sendTime(interaction, "✅ | **เคียร์คิวเพลง!**");
    },
  },
};
