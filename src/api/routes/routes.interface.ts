export interface IAnyObject {
  [key: string]: any;
}

export interface IBus {
  busNumber: string | number;
  plateNumber: string;
  ETA: number;
  relativeTime: string;
  stationId: number;
}

export interface IStation {
  buses: Array<IBus>;
  count: number;
}
export interface IStationsMap {
  [stationId: string]: IStation;
}
