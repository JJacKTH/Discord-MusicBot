const { MessageEmbed } = require("discord.js");
const { TrackUtils } = require("erela.js");

module.exports = {
    name: "volume",
    description: "เช็คระดับเสียงปัจจุบัน หรือ เปลี่ยนระดับเสียงของเพลง",
    usage: "<volume>",
    permissions: {
        channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
        member: [],
    },
    aliases: ["vol", "v"],
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
        if (!args[0]) return client.sendTime(message.channel, `🔉 | ความดังปัจจุบัน \`${player.volume}\`.`);
        if (!message.member.voice.channel) return client.sendTime(message.channel, "❌ | **คุณต้องอยู่ในช่องเสียงเพื่อใช้คำสั่งนี้!**");
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) return client.sendTime(message.channel, ":x: | **คุณต้องอยู่ในช่องเสียงเดียวกับฉันจึงจะใช้คำสั่งนี้ได้!**");
        if (!parseInt(args[0])) return client.sendTime(message.channel, `**โปรดเลือกตัวเลขระหว่าง** \`1 - 100\``);
        let vol = parseInt(args[0]);
        player.setVolume(vol);
        client.sendTime(message.channel, `🔉 | **ตั้งระดับเสียงเป็น** \`${player.volume}\``);
    },
    SlashCommand: {
        options: [
            {
                name: "amount",
                value: "amount",
                type: 4,
                required: false,
                description: "โปรดเลือกตัวเลขระหว่าง 1-100. ค่าดั้งเดิมคือ 100.",
            },
        ],
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

            if (!member.voice.channel) return client.sendTime(interaction, "❌ | คุณต้องอยู่ในช่องเสียงเพื่อใช้คำสั่งนี้.");
            if (guild.me.voice.channel && !guild.me.voice.channel.equals(member.voice.channel)) return client.sendTime(interaction, ":x: | **คุณต้องอยู่ในช่องเสียงเดียวกับฉันจึงจะใช้คำสั่งนี้ได้!**");
            let player = await client.Manager.get(interaction.guild_id);
            if (!player) return client.sendTime(interaction, "❌ | **Nothing is playing right now...**");
            if (!args[0].value) return client.sendTime(interaction, `🔉 | ระดับเสียงปัจจุบัน \`${player.volume}\`.`);
            let vol = parseInt(args[0].value);
            if (!vol || vol < 1 || vol > 100) return client.sendTime(interaction, `**โปรดเลือกตัวเลขระหว่าง** \`1 - 100\``);
            player.setVolume(vol);
            client.sendTime(interaction, `🔉 | ตั้งระดับเสียงเป็น \`${player.volume}\``);
        },
    },
};
