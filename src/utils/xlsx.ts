import * as xlsx from "xlsx";
import { IAnyObject } from "../api/routes/routes.interface";

/**
 * http://data.seoul.go.kr/dataList/OA-15262/F/1/datasetView.do 서울시 버스노선ID 정보(20220822).xlsx
 */
const XLSX_PATH = "src/assets/SeoulRouteInfo.xlsx";

let xlsxJsonData = [];
export function initXlsxToJson(): void {
  const excelFile = xlsx.readFile(XLSX_PATH);

  const sheetName = excelFile.SheetNames[0];

  const firstSheet = excelFile.Sheets[sheetName];

  xlsxJsonData = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });

  if (!xlsxJsonData.length) {
    throw new Error(`Failed to load ${XLSX_PATH} data`);
  }
}

export function getXlsxJsonDataByExactIdx(idx: number): IAnyObject {
  return xlsxJsonData[idx];
}

export function getXlsxJsonDataLength(): number {
  return xlsxJsonData.length;
}
