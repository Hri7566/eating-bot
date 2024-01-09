import { addLocation } from "./locations";

export function addLocations() {
  addLocation({
    id: "home",
    displayName: "Home",
    items: [],
    staticItems: [],
    nearby: [],
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
    nearby: ["home"],
  });
}
