require('dotenv').config();

const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.TOKEN);

const MARKETPLACE_CHANNEL_ID = '336895311081373707';
const MARKETPLACE_JSON_PATH = `${__dirname}/json/market.json`;

client.on('ready', async () => {
  console.log(`connected as "${client.user.tag}"`);

  await updateMarketplaceJson(client);

  console.log('done, disconnecting')
  client.destroy();
})

const updateMarketplaceJson = async (client) => {
  console.log('updating market.json');

  const mpChannel = await client.channels.fetch(MARKETPLACE_CHANNEL_ID);
  const pinnedMessages = await mpChannel.messages.fetchPinned();
  const output = pinnedMessages.map((pin) => {
    return {
      user: `${pin.author.username}#${pin.author.discriminator}`,
      message: pin.content,
      created: pin.createdTimestamp,
      avatar_url: pin.author.avatarURL(),
      message_id: pin.id,
      embeds: pin.embeds.map(embed => embed.url),
      attachments: pin.attachments.map(attachment => attachment.url),
    };
  });

  await fs.promises.writeFile(
    MARKETPLACE_JSON_PATH,
    JSON.stringify(output)
  );
};
