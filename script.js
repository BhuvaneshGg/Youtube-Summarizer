import { InferenceClient } from "@huggingface/inference";
import { exec } from "child_process";
import fs from "fs/promises";

const apiKey = "your api key herer";

async function Summary(data) {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/facebook/bart-large-cnn",
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: data,
      }),
    }
  );
  const result = await response.json();
  return result[0].summary_text;
}

async function ai(data) {
  const client = new InferenceClient(apiKey);
  const chatCompletion = await client.chatCompletion({
    provider: "together",
    model: "deepseek-ai/DeepSeek-R1-0528",
    messages: [
      {
        role: "user",
        content: data + " summarise this ",
      },
    ],
  });
  return chatCompletion.choices[0].message.content;
}

async function askQuestion(question, context) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/deepset/roberta-base-squad2",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          question: question,
          context: context,
        },
      }),
    }
  );

  const result = await response.json();
  return result.answer;
}

async function downloadSubtitles(videoUrl) {
  return new Promise((resolve, reject) => {
    exec(
      `yt-dlp --write-auto-sub --sub-lang en --sub-format json3 --skip-download -o "subtitles.%(ext)s" "${videoUrl}"`,
      (err, stdout, stderr) => {
        if (err) {
          console.error("Error downloading subtitles:", stderr);
          reject(err);
        } else {
          // Rename the file to subtitles.json
          fs.rename("subtitles.en.json3", "subtitles.json")
            .then(() => {
              console.log("Subtitles saved as subtitles.json");
              resolve();
            })
            .catch((err) => {
              console.error("Error renaming file:", err);
              reject(err);
            });
        }
      }
    );
  });
}

async function readSubtitles(fileName) {
  const file = fileName || "./subtitles.json";
  const data = await fs.readFile(file, "utf8");
  const json = JSON.parse(data);
  const transcript = [];
  json.events.forEach((event) => {
    if (event.segs) {
      event.segs.forEach((seg) => {
        if (seg.utf8) {
          transcript.push(seg.utf8);
        }
      });
    }
  });
  return transcript.join("");
}

async function main() {
  var input =
    "The tower is 324 metres (1,063 ft) tall, about the same height as an 81-storey building, and the tallest structure in Paris. Its base is square, measuring 125 metres (410 ft) on each side. During its construction, the Eiffel Tower surpassed the Washington Monument to become the tallest man-made structure in the world, a title it held for 41 years until the Chrysler Building in New York City was finished in 1930. It was the first structure to reach a height of 300 metres. Due to the addition of a broadcasting aerial at the top of the tower in 1957, it is now taller than the Chrysler Building by 5.2 metres (17 ft). Excluding transmitters, the Eiffel Tower is the second tallest free-standing structure in France after the Millau Viaduct";
  var question = "who Wrote this ?";
  var videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
  // subtitles
  await downloadSubtitles(videoUrl);
  var subtitles = await readSubtitles();
  console.log("Subtitles:", subtitles);

  // summarise
  var summary = await Summary(subtitles);
  console.log("\nSummary", summary);

  // answer
  var answer = await askQuestion(question, subtitles);
  console.log("\nquestion:", question);
  console.log("answer:", answer);

  var aiSummary = await ai(subtitles);
  console.log("\nAI Summary:", aiSummary);
}
main();
