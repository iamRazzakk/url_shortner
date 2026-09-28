import { Worker } from "bullmq";
import { connectionBullMQ } from "../config/bullMQ.config";
import { urlModel } from "../app/modules/url/url.model";
import { Types } from "mongoose";
import config from "../config";
import { redisService } from "../app/redis/redis.service";

const clickWorker = new Worker(
  "clickQueue",
  async (job) => {
    const sUrl = job.data as string;
    try {
      console.log(`📧 Clicking on url ${sUrl}`);
      const count = await redisService.hget("count-click", sUrl);
      if (count === null) {
        return;
      }
      await urlModel.updateOne(
        { shortUrl: `${config.domain}/${sUrl}` },
        { $set: { totalClicks: Number(count) } },
      );
      console.log(`✅ Click updated successfully for url ${sUrl}: ${count}`);
    } catch (error) {
      console.error(`❌ Failed to click on url ${sUrl}:`, error);
      throw error;
    }
  },
  {
    connection: connectionBullMQ,
    concurrency: 5,
  },
);

clickWorker.on("ready", () => {
  console.log("✅ Click worker is ready to process jobs");
});

clickWorker.on("error", (err) => {
  console.error("❌ Click worker error:", err);
});

clickWorker.on("completed", (job) => {
  console.log(
    `🎉 Job ${job.id} has been completed ${new Date().toLocaleString()}`,
  );
});

export default clickWorker;
