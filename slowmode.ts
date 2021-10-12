discord.interactions.commands.register(
  {
    name: 'slowmode',
    description: 'Sets the slowmode.',
    ackBehavior: discord.interactions.commands.AckBehavior.AUTO_EPHEMERAL,
    options: (opts) => ({
      time_in_seconds: opts.integer({
        required: true,
        description: 'The time in seconds for the channel slowmode.'
      }),
      channel: opts.guildChannel({
        required: false,
        description: 'The channel to set the slowmode for.'
      })
    })
  },
  async (interaction, { time_in_seconds, channel }) => {
    if (!interaction.member.can(discord.Permissions.MANAGE_MESSAGES))
      return await interaction.respondEphemeral(
        ':x: `Permissions Error` You need the permission **Manage Messages** to use this command.'
      );

    if (time_in_seconds < 0 || time_in_seconds > 21600)
      return await interaction.respondEphemeral(
        ':x: `Argument Error` The argument **time_in_seconds** must be between 0 and 21600.'
      );
    const newChannel =
      (await discord.getGuildTextChannel(
        channel?.id || interaction.channelId
      )) ||
      (await discord.getGuildNewsChannel(channel?.id || interaction.channelId));
    if (
      newChannel?.type != discord.Channel.Type.GUILD_TEXT &&
      newChannel?.type != discord.Channel.Type.GUILD_NEWS
    )
      return await interaction.respondEphemeral(
        ':x: `Argument Error` Channel must be a text or announcement channel.'
      );
    if (!newChannel)
      return await interaction.respondEphemeral(
        ':x: `Internal Error` There was an error getting the current channel. Please contact <@765994339565699083>.'
      );

    await newChannel.edit({ rateLimitPerUser: time_in_seconds });
    if (time_in_seconds === 0) {
      await interaction.respondEphemeral(
        'The slowmode for the channel ' +
          newChannel.toMention() +
          ' has been disabled.'
      );
    } else if (time_in_seconds === 1) {
      await interaction.respondEphemeral(
        'The slowmode for the channel ' +
          newChannel.toMention() +
          ' has been set to `1` second.'
      );
    } else {
      await interaction.respondEphemeral(
        'The slowmode for the channel ' +
          newChannel.toMention() +
          ' has been set to `' +
          time_in_seconds.toString() +
          '` seconds.'
      );
    }
  }
);
