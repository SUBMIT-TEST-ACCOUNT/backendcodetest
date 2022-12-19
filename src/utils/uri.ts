export function getRouteUriByRouteId(routeId: number): string {
  return `http://ws.bus.go.kr/api/rest/arrive/getArrInfoByRouteAll?serviceKey=${process.env.API_KEY}&busRouteId=${routeId}`;
}
