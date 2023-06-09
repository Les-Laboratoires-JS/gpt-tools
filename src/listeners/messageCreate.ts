import { Logger } from "@ghom/logger"
import { Listener } from "../app/listeners.js"
import { commands } from "../app/commands.js"
import * as guilds from "../utils/guilds.js"

const logger = new Logger({
  section: "Commands",
})

new Listener({
  event: "messageCreate",
  async run(message) {
    if (message.guildId) await guilds.addMessage(message.guildId)

    if (message.author.bot) return

    const app = await message.client.application.fetch()

    if (message.author.id !== app.owner?.id) return

    const contentParts = message.content.split(/\s+/)

    let commandName = contentParts[0].toLowerCase()
    let called = true

    if (process.env.PREFIX) {
      if (commandName.startsWith(process.env.PREFIX)) {
        commandName = commandName.replace(process.env.PREFIX, "")
      } else {
        commandName = "default"
        called = false
      }
    }

    let command = commands.find((command) => command.match(commandName))

    if (!command) {
      if (
        commandName !== "default" &&
        commands.has("default") &&
        message.mentions.users.has(message.client.user.id)
      ) {
        called = false
        command = commands.get("default")!
      } else {
        return
      }
    }

    if (message.guild && !command.options.inGuild) {
      await message.reply("This command can only be used in a DM.")
      return
    } else if (!message.guild && command.options.inGuild) {
      await message.reply("This command can only be used in a server.")
      return
    }

    try {
      await command.options.run(message, contentParts, called)
    } catch (error: any) {
      logger.error(error, error.message)

      await message.reply(
        "There was an error trying to execute that command! Please read the server console for more information."
      )
    }
  },
})
