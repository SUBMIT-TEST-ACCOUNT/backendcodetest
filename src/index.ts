import { initXlsxToJson } from "./utils/xlsx";
import * as dotenv from "dotenv";
import { getFastestRoutes } from "./api/routes";
import * as http from "http";
import {
  EMPTY_API_KEY,
  FASTEST_ROUTES_URL,
  GET_METHOD,
  HTTP_STATUS,
} from "./constants";

dotenv.config();

export const app = http.createServer(
  async (req: http.IncomingMessage, res: http.ServerResponse) => {
    const { url, method } = req;
    switch (url) {
      case FASTEST_ROUTES_URL: {
        if (method === GET_METHOD) {
          await getFastestRoutes(res);
          break;
        }
      }
      default: {
        res.statusCode = HTTP_STATUS.NOT_FOUND;
        res.end();
      }
    }
  }
);

const main = (): void => {
  if (!process.env.API_KEY) throw new Error(EMPTY_API_KEY);
  initXlsxToJson();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
  });
};

main();
