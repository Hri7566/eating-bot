import { MPPChatMessage } from "../commands/commands";
import { InventoryItem, getShortItemDetail } from "../data/inventory";
import { Bot } from "../mpp/bot";

export interface LocationalItem extends InventoryItem {}

export interface Location {
  id: string;
  displayName: string;
  items: LocationalItem[]; // items you can pick up
  staticItems: LocationalItem[]; // items you can't pick up
  nearby: string[]; // nearby locations
}

const locations = new Map<string, Location>();

export function addLocation(location: Location) {
  locations.set(location.id, location);
}

export function getLocationFromTable(locationId: string) {
  return (
    locations.get(locationId) || {
      id: "nowhere",
      displayName: "Nowhere",
      items: [],
      staticItems: [
        {
          id: "nothingness",
          count: 1,
          displayName: "Nothingness",
        },
      ],
      nearby: [],
    }
  );
}

export function isNearby(locationId1: string, locationId2: string) {
  const loc1 = getLocationFromTable(locationId1);
  const loc2 = getLocationFromTable(locationId2);

  if (loc1.nearby.includes(locationId2) || loc2.nearby.includes(locationId1))
    return true;
  return false;
}

export function findNearby(locationId: string) {
  const nearby: string[] = [];

  const loc = getLocationFromTable(locationId);
  nearby.push(...loc.nearby);

  for (const loc of locations.values()) {
    if (loc.nearby.includes(locationId)) {
      nearby.push(loc.id);
    }
  }

  return nearby;
}

export function findLocationFuzzy(fuzzy: string) {
  for (const loc of locations.values()) {
    if (
      loc.displayName.toLowerCase().includes(fuzzy) ||
      loc.id.toLowerCase().includes(fuzzy)
    ) {
      return loc;
    }
  }
}

export function getLocationItemDetails(locationId: string) {
  const loc = getLocationFromTable(locationId);

  let itemDetails = [];

  for (const item of loc.staticItems) {
    itemDetails.push(getShortItemDetail(item));
  }

  for (const item of loc.items) {
    itemDetails.push(getShortItemDetail(item));
  }

  if (itemDetails.length <= 0) return "(nothing)";
  return itemDetails;
}
