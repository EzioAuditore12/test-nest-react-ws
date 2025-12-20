import "dotenv/config";
import arkenv from "arkenv";

const env = arkenv({
  PORT: "number.port",
});

export default env;
