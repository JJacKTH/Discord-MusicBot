const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "loop",
    description: "เล่นเพลง ปัจจุบัน ซ้ำ",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["l", "repeat"],
    /**
      *
      * @param {import("../structures/DiscordMusicBot")} client
      * @param {import("discord.js").Message} message
      * @param {string[]} args
      * @param {*} param3
      */
    run: async (client, message, args, { GuildDB }) => {
      let player = await client.Manager.get(message.guild.id);
      if (!player) return client.sendTime(message.channel, "❌ | **ไม่มีเพลงเล่นในขณะนี้...**");
      if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **คุณต้องอยู่ในช่องเสียงเพื่อใช้คำสั่งนี้!**");
      if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **คุณต้องอยู่ในช่องเสียงเดียวกับฉันจึงจะใช้คำสั่งนี้ได้!**");

        if (player.trackRepeat) {
          player.setTrackRepeat(false)
          client.sendTime(message.channel, `🔂  \`Disabled\``);
        } else {
          player.setTrackRepeat(true)
          client.sendTime(message.channel, `🔂 \`Enabled\``);
        }
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
          const voiceChannel = member.voice.channel;
          let player = await client.Manager.get(interaction.guild_id);
          if (!player) return client.sendTime(interaction, "❌ | **ไม่มีเพลงเล่นในขณะนี้...**"); 
          if (!member.voice.channel) return client.sendTime(interaction, "❌ | คุณต้องอยู่ในช่องเสียงเพื่อใช้คำสั่งนี้.");
          if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **คุณต้องอยู่ในช่องเสียงเดียวกับฉันจึงจะใช้คำสั่งนี้ได้!**");

            if(player.trackRepeat){
                  player.setTrackRepeat(false)
                  client.sendTime(interaction, `🔂 \`Disabled\``);
              }else{
                  player.setTrackRepeat(true)
                  client.sendTime(interaction, `🔂 \`Enabled\``);
              }
          console.log(interaction.data)
        }
      }    
};