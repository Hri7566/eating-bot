import { expect, test } from "bun:test";
import {
  addLocation,
  getLocationFromTable,
} from "../../src/location/locations";

test("get location from table", () => {
  addLocation({
    id: "test",
    displayName: "Test Room",
    items: [],
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
