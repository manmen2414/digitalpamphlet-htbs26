interface MapInfo {
  floors: FloorInfo[];
  attribution?: string;
}
interface FloorInfo {
  floorFile: string;
  floorName: string;
  rooms: RoomInfo[];
}
interface RoomInfo {
  /** "トイレ"だとトイレ表示に、"階段"だと階段表示になる。 */
  name: string;
  bounds: [[number, number], [number, number]];
  boothIds?: string[];
  eventIds?: string[];
}
