import { hasVoiceState } from '@/utils/has-voice-state';
import { SlashCommandBuilder, SlashCommandSubcommandBuilder } from 'discord.js';
import { AppCommand } from './command';

export const clear: AppCommand = {
  data: new SlashCommandBuilder()
    .addSubcommand(
      new SlashCommandSubcommandBuilder()
        .setName('effect')
        .setDescription('Clear the applied effects to the playing music.')
    )
    .addSubcommand(
      new SlashCommandSubcommandBuilder().setName('queue').setDescription('Clear the music queue.')
    )
    .setName('clear')
    .setDescription('Clear an existing applied setting.'),
  execute: async ({ magma }, interaction) => {
    if (!interaction.guild || !interaction.guildId) {
      await interaction.reply({
        content: `You are not in a guild.`,
        ephemeral: true
      });
      return;
    }
    if (!hasVoiceState(interaction.member)) {
      await interaction.reply({
        content: `Illegal attempt for a non gateway interaction request.`,
        ephemeral: true
      });
      return;
    }
    if (!interaction.member.voice.channel) {
      await interaction.reply({
        content: `You are not in a voice channel.`,
        ephemeral: true
      });
      return;
    }

    const player = magma.players.get(interaction.guildId);

    if (!player) {
      await interaction.reply({
        ephemeral: true,
        content: 'I am not playing anything.'
      });
      return;
    }

    const subcommand = interaction.options.getSubcommand(true);

    switch (subcommand) {
      case 'queue':
        player.queue.clear();
        await interaction.reply({
          ephemeral: true,
          content: 'Queue cleared.'
        });
        break;
      case 'effect':
        await player.filters.clearFilters();
        await interaction.reply({
          ephemeral: true,
          content: 'Effects cleared.'
        });
        break;
    }
  }
};
