import { MPPChatMessage } from "../commands/commands";
import { InventoryItem, getShortItemDetail } from "../data/inventory";
import { Bot } from "../mpp/bot";

export interface LocationalItem extends InventoryItem {
  hide?: true;
}

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
    if (!item.hide) itemDetails.push(getShortItemDetail(item));
  }

  for (const item of loc.items) {
    if (!item.hide) itemDetails.push(getShortItemDetail(item));
  }

  if (itemDetails.length <= 0) return "(nothing)";
  return itemDetails.join(", ");
}

export function findItemAtLocation(
  locationId: string,
  itemId: string
): [boolean, LocationalItem | undefined] {
  const loc = getLocationFromTable(locationId);

  for (const item of loc.items) {
    if (item.id == itemId) return [false, item];
  }

  for (const item of loc.staticItems) {
    if (item.id == itemId) return [true, item];
  }

  return [false, undefined];
}

export function findItemAtLocationFuzzy(
  locationId: string,
  fuzzy: string
): [boolean, LocationalItem | undefined] {
  const loc = getLocationFromTable(locationId);

  for (const item of loc.items) {
    if (
      item.id.toLowerCase().includes(fuzzy.toLowerCase()) ||
      item.displayName.toLowerCase().includes(fuzzy.toLowerCase())
    )
      return [false, item];
  }

  for (const item of loc.staticItems) {
    if (
      item.id.toLowerCase().includes(fuzzy.toLowerCase()) ||
      item.displayName.toLowerCase().includes(fuzzy.toLowerCase())
    )
      return [true, item];
  }

  return [false, undefined];
}

export function removeItemAtLocation(
  locationId: string,
  itemId: string,
  count: number
) {
  const loc = getLocationFromTable(locationId);
  if (!loc) return false;

  const [isStatic, item] = findItemAtLocation(locationId, itemId);
  if (isStatic) return false;
  if (!item) return false;

  if (count >= item.count) {
    // Remove item entirely
    loc.items.splice(loc.items.indexOf(item), 1);
  } else {
    // Just decrement
    loc.items[loc.items.indexOf(item)].count -= count;
  }

  // TODO "Save" here? I haven't written the code for items to be persistent yet... maybe save JSON somewhere, and load that after locations are already loaded?

  return true;
}
