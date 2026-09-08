/**
 * @type {{
 *   map: L.Map | null,
 *   imageOverlays: L.ImageOverlay[],
 *   baseLayers: {[floorName: string]: L.ImageOverlay},
 *   layerGroups: Map<string, L.LayerGroup>,
 *   roomLabelLayerGroups: Map<string, L.LayerGroup>,
 *   roomLabelBounds: Map<L.Marker, L.LatLngBounds>,
 *   nowBaseLayerName: string,
 * }}
 */
export const mapState = {
  map: null,
  imageOverlays: [],
  baseLayers: {},
  layerGroups: new Map(),
  roomLabelLayerGroups: new Map(),
  roomLabelBounds: new Map(),
  nowBaseLayerName: "",
};

export function requireMap() {
  if (!mapState.map) {
    throw new Error("map is not initialized");
  }
  return mapState.map;
}
