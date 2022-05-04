import brain from "brain.js";
import fs from "fs";


const network = new brain.recurrent.LSTM();
const rawData = fs.readFileSync("./src/rawData.json");

const data = JSON.parse(rawData).map((qna) => ({
  input: qna.question,
  output: qna.answer,
}));

console.log("Training started....");

network.train(data, {
  iterations: 100,
});

fs.writeFileSync(
  "./src/trainedData.json",
  JSON.stringify(network.toJSON())
);

console.log("Training finished!")
