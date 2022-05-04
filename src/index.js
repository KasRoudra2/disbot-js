import { Client, Intents } from "discord.js";
import brain from "brain.js";
import "dotenv/config";
import fs from "fs";


const network = new brain.recurrent.LSTM();
const token = process.env.BOT_TOKEN;

// const rawData = fs.readFileSync("./src/rawData.json");
// const data = JSON.parse(rawData).map((qna) => ({
//   input: qna.question,
//   output: qna.answer,
// }));
// network.train(data, {
//   iterations: 100,
// });
// fs.writeFileSync(
//   "./src/trainedData.json",
//   JSON.stringify(network.toJSON())
// );
const trainedData = fs.readFileSync("./src/trainedData.json");
network.fromJSON(JSON.parse(trainedData));

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, "GUILD_MESSAGES"],
  //partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.login(token);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.username}`);
});


client.on("messageCreate", async (msg) => {
  if (msg.author.bot) return;
  if (msg.content.includes(" ") && msg.content.startsWith("$db")) {
    const question = msg.content.replace("$db ", "");
    const answer = network.run(question);
    await msg.channel.send(answer || "Not recognized");
  }
});
