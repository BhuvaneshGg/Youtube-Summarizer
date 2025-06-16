const { exec } = require('child_process');

const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

exec(`yt-dlp --write-auto-sub --sub-lang en --skip-download --convert-subs srt "${videoUrl}"`, (err, stdout, stderr) => {
  if (err) {
    console.error('Error:', stderr);
  } else {
    console.log('Subtitles downloaded.');
  }
});
