const { MessageEmbed, MessageReaction } = require("discord.js");

module.exports = {
  name: "config",
  description: "แก้ไขการตั้งค่าบอท",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: ["ADMINISTRATOR"],
  },
  aliases: ["conf"],
  /**
   *
   * @param {import("../structures/DiscordMusicBot")} client
   * @param {import("discord.js").Message} message
   * @param {string[]} args
   * @param {*} param3
   */
  run: async (client, message, args, { GuildDB }) => {
    let Config = new MessageEmbed()
      .setAuthor("Server Config", client.config.IconURL)
      .setColor("RANDOM")
      .addField("Prefix", GuildDB.prefix, true)
      .addField("DJ Role", GuildDB.DJ ? `<@&${GuildDB.DJ}>` : "Not Set", true)
      .setDescription(`
อยากแก้ไขอะไร?

:one: - Server Prefix
:two: - DJ Role
`);

    let ConfigMessage = await message.channel.send(Config);
    await ConfigMessage.react("1️⃣");
    await ConfigMessage.react("2️⃣");
    let emoji = await ConfigMessage.awaitReactions(
      (reaction, user) =>
        user.id === message.author.id &&
        ["1️⃣", "2️⃣"].includes(reaction.emoji.name),
      { max: 1, errors: ["time"], time: 30000 }
    ).catch(() => {
      ConfigMessage.reactions.removeAll();
      client.sendTime(
        message.channel, "❌ | **คุณใช้เวลาในการตอบกลับนานเกินไป หากคุณต้องการแก้ไขการตั้งค่า ให้รันคำสั่งอีกครั้ง!**"
      );
      ConfigMessage.delete(Config);
    });
    let isOk = false;
    try {
      emoji = emoji.first();
    } catch {
      isOk = true;
    }
    if (isOk) return; //im idiot sry ;-;
    /**@type {MessageReaction} */
    let em = emoji;
    ConfigMessage.reactions.removeAll();
    if (em._emoji.name === "1️⃣") {
      await client.sendTime(message.channel, "คุณต้องการเปลี่ยน prefix เป็นอะไร?");
      let prefix = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!prefix.first())
        return client.sendTime(message.channel, "คุณใช้เวลาในการตอบกลับนานเกินไป.");
      prefix = prefix.first();
      prefix = prefix.content;

      await client.database.guild.set(message.guild.id, {
        prefix: prefix,
        DJ: GuildDB.DJ,
      });

      client.sendTime(
        message.channel, `สำเร็จบันทึก Prefix ใหม่เป็น \`${prefix}\``
      );
    } else {
      await client.sendTime(
        message.channel, "โปรดระบุ ยศที่ต้องการให้ `DJ's` มี."
      );
      let role = await message.channel.awaitMessages(
        (msg) => msg.author.id === message.author.id,
        { max: 1, time: 30000, errors: ["time"] }
      );
      if (!role.first())
        return client.sendTime(message.channel, "คุณใช้เวลาในการตอบกลับนานเกินไป.");
      role = role.first();
      if (!role.mentions.roles.first())
        return client.sendTime(
          message.channel, "โปรดระบุ ยศสำหรับ DJ's เท่านั้น."
        );
      role = role.mentions.roles.first();

      await client.database.guild.set(message.guild.id, {
        prefix: GuildDB.prefix,
        DJ: role.id,
      });

      client.sendTime(
        message.channel, "บันทึกยศ DJ เป็น <@&" + role.id + "> เรียบร้อยแล้ว"
      );
    }
  },

  SlashCommand: {
    options: [
      {
        name: "prefix",
        description: "ตรวจสอบ Prefix",
        type: 1,
        required: false,
        options: [
          {
            name: "symbol",
            description: "ตั้ง Prefix",
            type: 3,
            required: false,
          },
        ],
      },
      {
        name: "dj",
        description: "เช็คยศ DJ",
        type: 1,
        required: false,
        options: [
          {
            name: "role",
            description: "ตั้งยศสำหรับ DJ",
            type: 8,
            required: false,
          },
        ],
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
      let config = interaction.data.options[0].name;
      let member = await interaction.guild.members.fetch(interaction.user_id);
      //TODO: if no admin perms return...
      if (config === "prefix") {
        //prefix stuff
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          //has prefix
          let prefix = interaction.data.options[0].options[0].value;
          await client.database.guild.set(interaction.guild.id, {
            prefix: prefix,
            DJ: GuildDB.DJ,
          });
          client.sendTime(interaction, `ตั้ง Prefix เป็น \`${prefix}\` แล้ว`);
        } else {
          //has not prefix
          client.sendTime(interaction, `Prefix ของ Bot ตัวนี้คือ \`${GuildDB.prefix}\``);
        }
      } else if (config === "djrole") {
        //DJ role
        if (
          interaction.data.options[0].options &&
          interaction.data.options[0].options[0]
        ) {
          let role = interaction.guild.roles.cache.get(
            interaction.data.options[0].options[0].value
          );
          await client.database.guild.set(interaction.guild.id, {
            prefix: GuildDB.prefix,
            DJ: role.id,
          });
          client.sendTime(
            interaction, `ทำการเปลี่ยน ยศDJ ${role.name} เรียบร้อย`
          );
        } else {
          /**
           * @type {require("discord.js").Role}
           */
          let role = interaction.guild.roles.cache.get(GuildDB.DJ);
          client.sendTime(interaction, `ยศของ DJ คือ ${role.name}`);
        }
      }
    },
  },
};
