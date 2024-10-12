import { createClient } from "redis";
import config from "../config";

const redisClient = createClient({
	url: config.redisUrl,
});

redisClient.on("error", (err) => { console.log("Redis Client Error", err); });

export default redisClient;
