import Client from "mppclone-client";
import env from "../util/env";
import { Command, commands } from "../commands/commands";
import { prefixes } from "../commands";

export const bots: Bot[] = [];

export class Bot {
  public cl: Client;

  constructor(public config: { channelId: string }) {
    this.cl = new Client("wss://mppclone.com", env.MPPCLONE_TOKEN);
    bots.push(this);

    this.bindEventListeners();
    this.cl.start();
  }

  protected bindEventListeners() {
    this.cl.on("hi", (msg) => {
      this.cl.setChannel(this.config.channelId);
    });

    this.cl.on("a", async (msg) => {
      console.log(`${msg.p.name}: ${msg.a}`);

      let usedPrefix: string | undefined;
      let usedCommand: Command | undefined;

      let args = msg.a.split(" ");

      // find prefix
      for (const prefix of prefixes) {
        if (msg.a.startsWith(prefix)) {
          usedPrefix = prefix;
          break;
        }
      }

      if (!usedPrefix) return;

      let cmd = args[0].substring(usedPrefix.length);

      // find command;
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
            m: msg.m,
            a: msg.a,
            args: args,
            p: msg.p,
            t: msg.t,
            usedCommand,
            usedPrefix,
          },
          this
        );
        if (out)
          this.cl.sendArray([
            {
              m: "a",
              message: `\u034f${out}`,
            },
          ]);
      } catch (err) {
        this.cl.sendArray([
          {
            m: "a",
            message: `\u034fAn error has occurred.`,
          },
        ]);

        console.error(err);
      }
    });
  }

  public destroy() {
    bots.splice(bots.indexOf(this), 1);
  }
}
