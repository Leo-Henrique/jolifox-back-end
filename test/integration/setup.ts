import { delay } from "test/delay";
import { beforeAll } from "vitest";

beforeAll(async () => {
  // O Notion suporta apenas 3 solicitações por segundo (https://developers.notion.com/reference/request-limits)
  await delay(1000);
});
