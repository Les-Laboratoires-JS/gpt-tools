import * as discord from "discord.js"
import * as guilds from "../utils/guilds.js"
import * as arriveLeave from "../utils/arriveLeave.js"
import { Listener } from "../app/listeners.js"

new Listener({
  event: "guildMemberAdd",
  run: async (member) => {
    const guildConfig = await guilds.ensureGuild(member.guild.id)

    if (!guildConfig.arriveMessageChannel) return

    const channel = member.guild.channels.cache.get(
      guildConfig.arriveMessageChannel
    )

    if (channel?.type !== discord.ChannelType.GuildText) {
      await guilds.removeData(member.guild.id, "arriveMessageChannel")
      return
    }

    // WELCOME
    if (member.user.bot) {
      if (guildConfig.botArriveMessage) {
        await channel.send(
          arriveLeave.buildMessage(guildConfig.botArriveMessage, member)
        )
      }
    } else if (guildConfig.userArriveMessage) {
      await channel.send(
        arriveLeave.buildMessage(guildConfig.userArriveMessage, member)
      )
    }
  },
})
