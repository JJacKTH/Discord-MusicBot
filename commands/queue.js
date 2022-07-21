const { MessageEmbed } = require("discord.js");
const _ = require("lodash");
const prettyMilliseconds = require("pretty-ms");

module.exports = {
  name: "queue",
  description: "แสดงเพลงที่อยู่ในคิวทั้งหมดในปัจจุบัน",
  usage: "",
  permissions: {
    channel: ["VIEW_CHANNEL", "SEND_MESSAGES", "EMBED_LINKS"],
    member: [],
  },
  aliases: ["q"],
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
        "❌ | **ไม่มีเพลงเล่นในขณะนี้...**"
      );

    if (!player.queue || !player.queue.length || player.queue === 0) {
      let QueueEmbed = new MessageEmbed()
        .setAuthor("กำลังเล่น", client.config.IconURL)
        .setColor("RANDOM")
        .setDescription(
          `[${player.queue.current.title}](${player.queue.current.uri})`
        )
        .addField("จาก ", `${player.queue.current.requester}`, true)
        .addField(
          "ความยาว",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`[${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}]\``
        )
        .setThumbnail(player.queue.current.displayThumbnail());
      return message.channel.send(QueueEmbed);
    }

    let Songs = player.queue.map((t, index) => {
      t.index = index;
      return t;
    });

    let ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

    let Pages = ChunkedSongs.map((Tracks) => {
      let SongsDescription = Tracks.map(
        (t) =>
          `\`${t.index + 1}.\` [${t.title}](${t.uri}) \n\`${prettyMilliseconds(
            t.duration,
            {
              colonNotation: true,
            }
          )}\` **|** จาก: ${t.requester}\n`
      ).join("\n");

      let Embed = new MessageEmbed()
        .setAuthor("Queue", client.config.IconURL)
        .setColor("RANDOM")
        .setDescription(
          `**กำลังเล่น:** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**ต่อไป:** \n${SongsDescription}\n\n`
        )
        .addField("รวมเพลง: \n", `\`${player.queue.totalSize - 1}\``, true)
        .addField(
          "ความยาวรวม: \n",
          `\`${prettyMilliseconds(player.queue.duration, {
            colonNotation: true,
          })}\``,
          true
        )
        .addField("จาก:", `${player.queue.current.requester}`, true)
        .addField(
          "ระยะเวลาเพลงปัจจุบัน:",
          `${
            client.ProgressBar(
              player.position,
              player.queue.current.duration,
              15
            ).Bar
          } \`${prettyMilliseconds(player.position, {
            colonNotation: true,
          })} / ${prettyMilliseconds(player.queue.current.duration, {
            colonNotation: true,
          })}\``
        )
        .setThumbnail(player.queue.current.displayThumbnail());

      return Embed;
    });

    if (!Pages.length || Pages.length === 1)
      return message.channel.send(Pages[0]);
    else client.Pagination(message, Pages);
  },
  SlashCommand: {
    /*
    options: [
      {
          name: "page",
          value: "[page]",
          type: 4,
          required: false,
          description: "Enter the page of the queue you would like to view",
      },
  ],
  */
    /**
     *
     * @param {import("../structures/DiscordMusicBot")} client
     * @param {import("discord.js").Message} message
     * @param {string[]} args
     * @param {*} param3
     */
    run: async (client, interaction, args, { GuildDB }) => {
      let player = await client.Manager.get(interaction.guild_id);
      if (!player)
        return client.sendTime(interaction, "❌ | **ไม่มีเพลงเล่นในขณะนี้...**");

      if (!player.queue || !player.queue.length || player.queue === 0) {
        let QueueEmbed = new MessageEmbed()
          .setAuthor("Currently playing", client.config.IconURL)
          .setColor("RANDOM")
          .setDescription(
            `[${player.queue.current.title}](${player.queue.current.uri})`
          )
          .addField("จาก ", `${player.queue.current.requester}`, true)
          .addField(
            "ความยาว",
            `${
              client.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`[${prettyMilliseconds(player.position, {
              colonNotation: true,
            })} / ${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}]\``
          )
          .setThumbnail(player.queue.current.displayThumbnail());
        return interaction.send(QueueEmbed);
      }

      let Songs = player.queue.map((t, index) => {
        t.index = index;
        return t;
      });

      let ChunkedSongs = _.chunk(Songs, 10); //How many songs to show per-page

      let Pages = ChunkedSongs.map((Tracks) => {
        let SongsDescription = Tracks.map(
          (t) =>
            `\`${t.index + 1}.\` [${t.title}](${
              t.uri
            }) \n\`${prettyMilliseconds(t.duration, {
              colonNotation: true,
            })}\` **|** จาก: ${t.requester}\n`
        ).join("\n");

        let Embed = new MessageEmbed()
          .setAuthor("Queue", client.config.IconURL)
          .setColor("RANDOM")
          .setDescription(
            `**กำลังเล่นเพลง :** \n[${player.queue.current.title}](${player.queue.current.uri}) \n\n**ต่อไป:** \n${SongsDescription}\n\n`
          )
          .addField(
            "รวมเพลง: \n",
            `\`${player.queue.totalSize - 1}\``,
            true
          )
          .addField(
            "ความยาวรวม: \n",
            `\`${prettyMilliseconds(player.queue.duration, {
              colonNotation: true,
            })}\``,
            true
          )
          .addField("จาก:", `${player.queue.current.requester}`, true)
          .addField(
            "ระยะเวลาเพลงปัจจุบัน:",
            `${
              client.ProgressBar(
                player.position,
                player.queue.current.duration,
                15
              ).Bar
            } \`[${prettyMilliseconds(player.position, {
              colonNotation: true,
            })} / ${prettyMilliseconds(player.queue.current.duration, {
              colonNotation: true,
            })}]\``
          )
          .setThumbnail(player.queue.current.displayThumbnail());

        return Embed;
      });

      if (!Pages.length || Pages.length === 1)
        return interaction.send(Pages[0]);
      else client.Pagination(interaction, Pages);
    },
  },
};
