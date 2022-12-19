import axios from "axios";
import {
  FIVE_MINUTE_MILLISECOND,
  FIVE_MINUTE_SECOND,
} from "../../constants/index";
import { getTimestampByDate } from "../../utils/time";
import { getRouteUriByRouteId } from "../../utils/uri";
import { IAnyObject, IBus, IStation, IStationsMap } from "./routes.interface";

export function pushStationsInfomation(
  originMap: IStationsMap,
  parseMsgBody: IAnyObject,
  now: number
) {
  parseMsgBody.forEach((data: IAnyObject) => {
    const { mkTm, plainNo1, plainNo2, stId, traTime1, traTime2, rtNm } = data;

    const dataDeliveryTime: number = getTimestampByDate(mkTm);

    const stationBusDataArray: Array<IBus> = [];

    // 오래된 데이터라면 배제시킴.
    if (now - dataDeliveryTime > FIVE_MINUTE_MILLISECOND) return;

    if (traTime1 > 0 && traTime1 <= FIVE_MINUTE_SECOND) {
      pushBusInfomation(plainNo1, traTime1);
    }

    if (traTime2 > 0 && traTime2 <= FIVE_MINUTE_SECOND) {
      pushBusInfomation(plainNo2, traTime2);
    }
    const dataCount = stationBusDataArray.length;

    if (!dataCount) return;

    if (originMap[stId]) {
      const { buses, count } = originMap[stId];

      originMap[stId] = {
        buses: [...buses, ...stationBusDataArray],
        count: count + dataCount,
      };

      return;
    }
    originMap[stId] = { buses: stationBusDataArray, count: dataCount };

    function pushBusInfomation(plateNumber: string, traTime: number) {
      const ETA = now + traTime * 1000;
      stationBusDataArray.push({
        busNumber: rtNm,
        plateNumber,
        ETA,
        relativeTime: new Intl.RelativeTimeFormat("ko-KR").format(
          (ETA - now) / 1000,
          "seconds"
        ),
        stationId: stId,
      });
    }
  });
}

export function mapToArray(map: IStationsMap) {
  return Array.from(Object.values(map));
}

export function sortArrayByCountAndEta(arr: Array<IStation>) {
  arr.sort((a, b) => {
    if (a.count > b.count) {
      return -1;
    }
    if (a.count < b.count) {
      return 1;
    }
    if (a.count === b.count) {
      return a.buses[0].ETA - b.buses[0].ETA;
    }
  });
}

export async function fetchData(routeID: number) {
  const { data } = await axios.get(getRouteUriByRouteId(routeID));

  if (!data) throw new Error("fetch Error");

  return data;
}

function sortByETA(arr: Array<IBus>) {
  arr.sort((a, b) => a.ETA - b.ETA);
}

export function getFastestBusArray(arr: Array<IStation>) {
  let result = [];
  arr.forEach((el) => result.push(...el.buses));

  sortByETA(result);
  return result;
}
