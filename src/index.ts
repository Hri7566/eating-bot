import { addCommands } from "./commands";
import { startConsole } from "./console";
import { addLocations } from "./location";
import { startBots } from "./mpp";
import { loadConfig } from "./util/config";

const config = loadConfig("./config/services.yml", {
  mpp: {
    enabled: true,
  },
  console: {
    enabled: false,
  },
});

addCommands();
addLocations();

if (config.mpp.enabled) {
  startBots();
}

if (config.console.enabled) {
  startConsole();
}
