import { addLocation } from "./locations";

export function addLocations() {
  addLocation({
    id: "home",
    displayName: "Home",
    items: [],
    staticItems: [],
    nearby: ["sidewalk"],
  });

  addLocation({
    id: "sidewalk",
    displayName: "Sidewalk",
    items: [],
    staticItems: [
      {
        id: "bench",
        count: 1,
        displayName: "Bench",
      },
    ],
    nearby: [],
  });

  addLocation({
    id: "neighbor",
    displayName: "Neighbor's house",
    items: [
      {
        id: "lemon",
        displayName: "Lemon",
        count: 1,
        hide: true,
      },
    ],
    staticItems: [
      {
        id: "tree_lemon",
        displayName: "Lemon Tree",
        count: 1,
      },
      {
        id: "couch",
        displayName: "Couch",
        count: 1,
      },
    ],
    nearby: ["sidewalk"],
  });
}
