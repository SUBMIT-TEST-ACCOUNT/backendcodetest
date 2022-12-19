import { getRandomNumber, getRandomNumberArray } from "../src/utils/random";
import {
  initXlsxToJson,
  getXlsxJsonDataLength,
  getXlsxJsonDataByExactIdx,
} from "../src/utils/xlsx";

describe("Utils Test", () => {
  describe("Test random util", () => {
    const MAX_NUMBER = 100;
    test("getRandomNumber 함수를 10번 실행 한 후 결과 체크", () => {
      let result = 0;
      for (let i = 0; i < 10; i++) {
        result += getRandomNumber(MAX_NUMBER);
      }

      expect(result).toBeLessThan(MAX_NUMBER * 10);
    });

    test("getRandomNumberArray 함수 실행 후 결과 체크", () => {
      const result = getRandomNumberArray(MAX_NUMBER);
      const ROUTE_VALUE = Number(process.env.ROUTE_VALUE);

      expect(result.length).toBe(ROUTE_VALUE);
      expect(result.reduce((pre, cur) => pre + cur, 0)).toBeLessThan(
        MAX_NUMBER * ROUTE_VALUE
      );
    });
  });

  describe("Test xlsx parse", () => {
    beforeAll(() => {
      initXlsxToJson();
    });
    test("xlsx 파서 테스트", () => {
      const length = getXlsxJsonDataLength();
      const randomIdx = getRandomNumber(length);
      const result = getXlsxJsonDataByExactIdx(randomIdx);

      expect(Object.keys(result).length).toBe(2);
      expect("ROUTE_ID" in result).toBe(true);
      expect(result.ROUTE_ID.length).toBe(9);
    });
  });
});
