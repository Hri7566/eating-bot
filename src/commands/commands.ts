import { Bot } from "../mpp/bot";

export const commands: Command[] = [];

export interface MPPChatMessage {
  m: "a";
  a: string;
  args: string[];
  usedPrefix: string;
  usedCommand: Command;
  p: {
    name: string;
    _id: string;
    id: string;
    color: string;
  };
  t: number;
}

export class Command {
  constructor(
    public aliases: string[],
    public description: string,
    public usage: string,
    public callback: (
      msg: MPPChatMessage,
      bot: Bot
    ) => Promise<string | void> | string | void
  ) {
    commands.push(this);
  }
}
