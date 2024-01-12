import { expect, test } from "bun:test";
import {
  addLocation,
  findItemAtLocation,
  findItemAtLocationFuzzy,
  getLocationFromTable,
  removeItemAtLocation,
} from "../../src/location/locations";

test("get location from table", () => {
  addLocation({
    id: "test",
    displayName: "Test Room",
    items: [
      {
        id: "test",
        count: 8,
        displayName: "Test",
      },
    ],
    staticItems: [],
    nearby: [],
  });

  const location = getLocationFromTable("test");
  expect(location).toBeDefined();
  expect(location?.id).toBe("test");
  expect(location?.displayName).toBe("Test Room");
  expect(location?.items).toBeArray();
  expect(location?.staticItems).toBeArray();
});

test("find item at location", async () => {
  const [itemIsStatic, item] = findItemAtLocation("test", "test");
  expect(itemIsStatic).toBeFalsy();
  expect(item).toBeDefined();
  expect(item?.id).toBe("test");
  expect(item?.count).toBe(8);
  expect(item?.displayName).toBe("Test");
});

test("fuzzy find item at location", async () => {
  const [itemIsStatic, item] = findItemAtLocationFuzzy("test", "te");
  expect(itemIsStatic).toBeFalsy();
  expect(item).toBeDefined();
  expect(item?.id).toBe("test");
  expect(item?.count).toBe(8);
  expect(item?.displayName).toBe("Test");
});

test("remove item from location", async () => {
  const worked1 = removeItemAtLocation("test", "test", 5);
  expect(worked1).toBeTruthy();

  const [static1, item1] = findItemAtLocation("test", "test");
  expect(static1).toBeFalsy();
  expect(item1).toBeDefined();
  expect(item1?.count).toBe(3);

  const worked2 = removeItemAtLocation("test", "test", 4);
  expect(worked2).toBeTruthy();

  const [static2, item2] = findItemAtLocation("test", "test");
  expect(static2).toBeFalsy();
  expect(item2).toBeUndefined();
});
