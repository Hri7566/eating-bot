import { InventoryItem } from "../data/inventory";

export const itemDescriptions = new Map<InventoryItem["id"], string>();

itemDescriptions.set("bench", "A nice place to sit outside");
itemDescriptions.set("tree_lemon", "A tree with lemons on it");
itemDescriptions.set("couch", "A comfy place to sit inside");
