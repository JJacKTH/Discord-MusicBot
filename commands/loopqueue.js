const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "loopqueue",
    description: "เล่นเพลง ในคิวทั้งหมด ซ้ำเรื่อยๆ",
    usage: "",
    permissions: {
      channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
      member: [],
    },
    aliases: ["lq", "repeatqueue", "rq"],
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

        if (player.queueRepeat) {
          player.setQueueRepeat(false)
          client.sendTime(message.channel, `:repeat: Queue Loop \`disabled\``);
        } else {
          player.setQueueRepeat(true)
          client.sendTime(message.channel, `:repeat: Queue Loop \`enabled\``);
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
          let player = await client.Manager.get(interaction.guild_id);
          const guild = client.guilds.cache.get(interaction.guild_id);
          const member = guild.members.cache.get(interaction.member.user.id);
          const voiceChannel = member.voice.channel;
          let awaitchannel = client.channels.cache.get(interaction.channel_id); /// thanks Reyansh for this idea ;-;
            if (!player) return client.sendTime(interaction, "❌ | **ไม่มีเพลงเล่นในขณะนี้...**"); 
            if (!member.voice.channel) return client.sendTime(interaction, "❌ | **คุณต้องอยู่ในช่องเสียงเพื่อใช้คำสั่งนี้.**");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(voiceChannel)) return client.sendTime(interaction, ":x: | **คุณต้องอยู่ในช่องเสียงเดียวกับฉันจึงจะใช้คำสั่งนี้ได้!**");

            if(player.queueRepeat){
                  player.setQueueRepeat(false)
                  client.sendTime(interaction, `:repeat: **เล่นเพลงในคิวซ้ำ** \`disabled\``);
              }else{
                  player.setQueueRepeat(true)
                  client.sendTime(interaction, `:repeat: **เล่นเพลงในคิวซ้ำ** \`enabled\``);
              }
          console.log(interaction.data)
        }
      }    
};
