import db from "./db";

export interface Inventory {
  _id: string;
  items: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  displayName: string;
  count: number;
}

let invdb = db.sublevel("inventories");

export function makeDefaultInventory(_id: string): Inventory {
  return { _id, items: [] };
}

export async function getInventory(_id: string) {
  // Get user inventory data
  let data: Inventory;

  try {
    let invJSON = await invdb.get(_id);

    try {
      // Data is intact
      data = JSON.parse(invJSON);
    } catch (err) {
      // Parsing error, make default again
      await deleteInventory(_id);
      data = makeDefaultInventory(_id);
      await setInventory(_id, data);
    }
  } catch (err) {
    // Inventory probably nonexistent
    data = makeDefaultInventory(_id);
    await setInventory(_id, data);
  }

  return data;
}

export async function setInventory(_id: string, inventory: Inventory) {
  // Set user inventory data
  try {
    await invdb.put(_id, JSON.stringify(inventory));
    return true;
  } catch (err) {
    return false;
  }
}

export async function deleteInventory(_id: string) {
  try {
    await invdb.del(_id);
    return true;
  } catch (err) {
    return false;
  }
}

export function addItem(inventory: Inventory, item: InventoryItem) {
  let foundItemIndex: number | undefined;

  for (let i = 0; i < inventory.items.length; i++) {
    if (inventory.items[i].id == item.id) {
      foundItemIndex = i;
      break;
    }
  }

  if (typeof foundItemIndex !== "undefined") {
    // Is future item count nothing?
    if (inventory.items[foundItemIndex].count + item.count <= 0) {
      // Remove item
      inventory.items.splice(foundItemIndex, 1);
    } else {
      // Add to existing count
      inventory.items[foundItemIndex].count += item.count;
    }
  } else {
    // Add new item
    inventory.items.push(item);
  }
}

export function removeItem(inventory: Inventory, itemId: string) {
  let foundItemIndex: number | undefined;

  for (let i = 0; i < inventory.items.length; i++) {
    if (inventory.items[i].id == itemId) {
      foundItemIndex = i;
      break;
    }
  }

  if (typeof foundItemIndex !== "undefined") {
    // Remove item
    inventory.items.splice(foundItemIndex, 1);
  }
}

export function getShortItemDetail(item: InventoryItem) {
  return item.count == 1
    ? item.displayName
    : `${item.displayName} (x${item.count})`;
}

export function getInventoryDetails(inventory: Inventory) {
  return (
    `Items: ` +
    (inventory.items.length > 0
      ? `${inventory.items.map(getShortItemDetail).join(" | ")}`
      : "(none)")
  );
}
