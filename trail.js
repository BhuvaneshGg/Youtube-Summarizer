

// async function downloadSubtitles(videoUrl) {
//     const { exec } = require('child_process');

//     // Get video title
//     exec(`yt-dlp --get-title "${videoUrl}"`, (err, stdout, stderr) => {
//       if (err) {
//         console.error('Error getting title:', stderr);
//       } else {
//         const videoTitle = stdout.trim();
//         console.log('Video Title:', videoTitle);

//         // Download subtitles after getting the title
//         exec(`yt-dlp --write-auto-sub --sub-lang en --sub-format json3 --skip-download --convert-subs srt "${videoUrl}"`, (err, stdout, stderr) => {
//           if (err) {
//             console.error('Error:', stderr);
//           } else {
//             console.log('Subtitles downloaded.');
//           }
//         });
//       }
//     });
// }

// downloadSubtitles('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

// const { exec } = require('child_process');
// const fs = require('fs');

// const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

// exec(`yt-dlp --write-auto-sub --sub-lang en --sub-format json3 --skip-download -o "subtitles.%(ext)s" "${videoUrl}"`, (err, stdout, stderr) => {
//   if (err) {
//     console.error('Error downloading subtitles:', stderr);
//   } else {
//     // Rename the file to subtitles.json
//     fs.rename('subtitles.en.json3', 'subtitles.json', (err) => {
//       if (err) {
//         console.error('Error renaming file:', err);
//       } else {
//         console.log('Subtitles saved as subtitles.json');
//       }
//     });
//   }
// });

// const data = require('./subtitles.json');
// console.log(data);

import { InferenceClient } from "@huggingface/inference";
import fs from "fs/promises";

// Read subtitles from JSON file (async)
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

async function ai(data) {
  const client = new InferenceClient("api key here");
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

// Main execution
const val = await readSubtitles();
console.log(await ai(val));

