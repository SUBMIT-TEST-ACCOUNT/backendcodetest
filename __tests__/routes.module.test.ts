import {
  getXlsxJsonDataByExactIdx,
  getXlsxJsonDataLength,
  initXlsxToJson,
} from "../src/utils/xlsx";
import { getRandomNumber } from "../src/utils/random";
import {
  fetchData,
  getFastestBusArray,
  mapToArray,
  pushStationsInfomation,
  sortArrayByCountAndEta,
} from "../src/api/routes/routes.module";
import { mockStationsMap, mockStationsArray } from "./constants";
import { IBus } from "../src/api/routes/routes.interface";
import { parser } from "../src/utils/parser";
import { FIVE_MINUTE_MILLISECOND } from "../src/constants";

beforeAll(() => {
  initXlsxToJson();
});
describe("ROUTES 모듈 테스트", () => {
  let data: string;
  test("fetchData", async () => {
    const randomNumber = getRandomNumber(getXlsxJsonDataLength());
    const { ROUTE_ID } = getXlsxJsonDataByExactIdx(randomNumber);
    data = await fetchData(ROUTE_ID);

    expect(data.indexOf("headerMsg")).not.toEqual(-1);
    expect(data.indexOf("msgBody")).not.toEqual(-1);
  });

  test("pushStationsInformation", () => {
    let stationsMap = {};
    const parseMsgBody = parser.parse(data).ServiceResult.msgBody.itemList;
    let now = Date.now();
    pushStationsInfomation(stationsMap, parseMsgBody, now);

    let keysArray = Object.keys(stationsMap);
    expect(keysArray.length).not.toEqual(0);
    const randomKeyIdx = getRandomNumber(keysArray.length);

    expect("buses" in stationsMap[keysArray[randomKeyIdx]]).toBe(true);
    expect("count" in stationsMap[keysArray[randomKeyIdx]]).toBe(true);

    // 오래된 데이터일 경우 비어있어야 함.
    stationsMap = {};
    now += FIVE_MINUTE_MILLISECOND;
    pushStationsInfomation(stationsMap, parseMsgBody, now);
    expect(Object.keys(stationsMap).length).toEqual(0);
  });

  test("mapToArray", () => {
    const result = mapToArray(mockStationsMap);

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).not.toEqual(undefined);
  });

  test("getFastestBusArray", () => {
    const length = mockStationsArray.length;
    const result: Array<IBus> = getFastestBusArray(mockStationsArray);

    expect(result[0].ETA).toBeLessThanOrEqual(result[1].ETA);
    expect(result[length - 1].ETA).toBeGreaterThanOrEqual(
      result[length - 2].ETA
    );
  });

  test("sortArrayByCountAndEta", () => {
    const length = mockStationsArray.length;
    sortArrayByCountAndEta(mockStationsArray);

    expect(mockStationsArray[0].count).toBeGreaterThanOrEqual(
      mockStationsArray[1].count
    );
    expect(mockStationsArray[0].buses[0].ETA).toBeLessThanOrEqual(
      mockStationsArray[1].buses[0].ETA
    );
    expect(mockStationsArray[length - 1].count).toBeLessThanOrEqual(
      mockStationsArray[length - 2].count
    );
  });
});
