import { createInterface } from "readline";
import { Command, commands } from "../commands/commands";

export function startConsole() {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("line", async (text) => {
    await (async () => {
      let usedCommand: Command | undefined;

      let args = text.split(" ");
      let cmd = args[0];

      // Find command
      for (const command of commands) {
        for (const alias of command.aliases) {
          if (cmd == alias) {
            usedCommand = command;
            break;
          }
        }
      }

      if (!usedCommand) return;

      try {
        const out = await usedCommand.callback(
          {
            m: "a",
            a: text,
            p: {
              name: "Console",
              _id: "1",
              id: "1",
              color: "#8d3f50",
            },
            t: Date.now(),
            args,
            usedCommand,
            usedPrefix: "",
          },
          false
        );

        console.log(out);
      } catch (err) {
        console.log("An error has occurred.");
        console.error(err);
      }
    })();

    rl.prompt();
  });

  rl.prompt();
}
