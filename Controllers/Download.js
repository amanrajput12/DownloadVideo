const { spawn } = require('child_process');
const logger = require('../Utils/Logger.js');

exports.downloadVideo = async (req, res) => {
  const { url, quality } = req.query;

  try {
    logger.info(`Download started for: ${url} and quality: ${quality}`);

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    res.header('Content-Type', 'video/mp4');

    let format;

    switch (quality) {
      case "1080":
        format = 'bestvideo[height<=1080]+bestaudio/best';
        break;

      case "1440":
        format = 'bestvideo[height<=1440]+bestaudio/best';
        break;

      case "2160":
      case "4k":
        format = 'bestvideo[height<=2160]+bestaudio/best';
        break;

      case "best":
        format = 'bestvideo+bestaudio/best';
        break;

      default:
        format = 'bestvideo[height<=1080]+bestaudio/best';
    }

    const ytdlpArgs = ['-f', format, '-o', '-', '--no-playlist', url];

    logger.info(`Using format: ${format}`);

    // Spawn yt-dlp process
    const ytDlp = spawn('yt-dlp', ytdlpArgs);

    const ffmpegArgs = [
      '-i', 'pipe:0',
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-movflags', 'frag_keyframe+empty_moov',
      '-f', 'mp4',
      'pipe:1'
    ];

    // Spawn ffmpeg process (NOW FIXED)
    const ffmpeg = spawn('ffmpeg', ffmpegArgs);

    ytDlp.stdout.pipe(ffmpeg.stdin);
    ffmpeg.stdout.pipe(res);

    const killTimer = setTimeout(() => {
      logger.error("Process timeout, killing streams");
      ytDlp.kill();
      ffmpeg.kill();
    }, 15 * 60 * 1000);

    req.on('close', () => {
      logger.info("User closed connection");
      clearTimeout(killTimer);
      ytDlp.kill();
      ffmpeg.kill();
    });

    ytDlp.on('error', (err) => {
      logger.error(`yt-dlp error: ${err.message}`);
      if (!res.headersSent) res.status(500).send("yt-dlp failed");
      ffmpeg.kill();
    });

    ffmpeg.on('error', (err) => {
      logger.error(`ffmpeg error: ${err.message}`);
      if (!res.headersSent) res.status(500).send("ffmpeg failed");
      ytDlp.kill();
    });

    ffmpeg.on('close', () => {
      logger.info("Download completed successfully");
      clearTimeout(killTimer);
    });

  } catch (error) {
    logger.error(`Controller Error: ${error.message}`);
    if (!res.headersSent) res.status(500).send("Server Error");
  }
};
