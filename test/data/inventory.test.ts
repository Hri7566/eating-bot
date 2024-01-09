import { expect, test } from "bun:test";
import {
  Inventory,
  addItem,
  deleteInventory,
  getInventory,
  getInventoryDetails,
  getShortItemDetail,
  removeItem,
  setInventory,
} from "../../src/data/inventory";

test("inventory creation", async () => {
  const key = "test";
  const inv = await getInventory(key);

  expect(inv).toBeDefined();

  expect(inv._id).toBe(key);
  expect(inv.items).toBeArray();
});

test("inventory saving and loading", async () => {
  const key = "test";

  const inv1 = await getInventory(key);
  const worked1 = await setInventory(key, inv1);
  expect(worked1).toBeTruthy();

  const inv2 = await getInventory(key);

  expect(inv2).toBeDefined();

  expect(inv2._id).toBe(key);
  expect(inv2.items).toBeArray();

  let itemId = "stick";
  let itemCount = 1;
  let itemName = "Stick";

  addItem(inv2, {
    id: itemId,
    count: itemCount,
    displayName: itemName,
  });

  const worked2 = await setInventory(key, inv2);
  expect(worked2).toBeTruthy();

  const inv3 = await getInventory(key);
  expect(inv3.items).toBeArrayOfSize(1);
  expect(inv3.items[0]).toBeDefined();
  expect(inv3.items[0].id).toBe(itemId);
  expect(inv3.items[0].count).toBe(itemCount);
  expect(inv3.items[0].displayName).toBe(itemName);
});

test("inventory deletion", async () => {
  const key = "test";

  const inv1 = await getInventory(key);

  let itemId = "potato";
  let itemCount = 1;
  let itemName = "Potato";

  addItem(inv1, {
    id: itemId,
    count: itemCount,
    displayName: itemName,
  });

  await setInventory(key, inv1);
  const worked = await deleteInventory(key);
  expect(worked).toBeTruthy();

  const inv2 = await getInventory(key);
  expect(inv2.items).toBeArray();
  expect(inv2.items).toBeArrayOfSize(0);
});

test("item adding", async () => {
  const inv: Inventory = {
    _id: "test",
    items: [
      {
        id: "bicycle",
        count: 1,
        displayName: "Bicycle",
      },
      {
        id: "cranberry",
        count: 3,
        displayName: "Cranberry",
      },
    ],
  };

  addItem(inv, {
    id: "bicycle",
    count: 1,
    displayName: "Bicycle",
  });

  expect(inv.items[0].id).toBe("bicycle");
  expect(inv.items[0].count).toBe(2);

  addItem(inv, {
    id: "cranberry",
    count: 5,
    displayName: "Cranberry",
  });

  expect(inv.items[1].id).toBe("cranberry");
  expect(inv.items[1].count).toBe(8);

  addItem(inv, {
    id: "bicycle",
    count: -2,
    displayName: "Bicycle",
  });

  expect(inv.items[0].id).toBe("cranberry");
  expect(inv.items[0].count).toBe(8);
});

test("item removing", () => {
  const inv: Inventory = {
    _id: "test",
    items: [
      {
        id: "bicycle",
        count: 1,
        displayName: "Bicycle",
      },
      {
        id: "cranberry",
        count: 3,
        displayName: "Cranberry",
      },
    ],
  };
  expect(inv.items[1].id).toBe("cranberry");
  expect(inv.items[1].count).toBe(3);

  removeItem(inv, "bicycle");

  expect(inv.items[0].id).toBe("cranberry");
  expect(inv.items[0].count).toBe(3);
});

test("item short detail matches format", () => {
  const detail1 = getShortItemDetail({
    id: "hamburger",
    displayName: "Hamburger",
    count: 2,
  });

  expect(detail1).toBe("Hamburger (x2)");

  const detail2 = getShortItemDetail({
    id: "cheeseburger",
    displayName: "Cheeseburger",
    count: 1,
  });

  expect(detail2).toBe("Cheeseburger");
});

test("inventory details matches format", () => {
  const details1 = getInventoryDetails({
    _id: "test",
    items: [
      {
        id: "strawberry",
        count: 1,
        displayName: "Strawberry",
      },
      {
        id: "apple",
        count: 2,
        displayName: "Apple",
      },
    ],
  });

  expect(details1).toBe("Items: Strawberry | Apple (x2)");

  const details2 = getInventoryDetails({
    _id: "test",
    items: [],
  });

  expect(details2).toBe("Items: (none)");
});
