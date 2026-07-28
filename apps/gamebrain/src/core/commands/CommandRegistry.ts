import TaskQueue from "../task/TaskQueue";

type Command = {
  execute: () => void | Promise<void>;
};

class CommandRegistry {
  private commands = new Map<string, Command>();

  register(event: string, command: Command) {
    this.commands.set(event, command);

    console.log(`📦 Command registrado: ${event}`);
  }

  async execute(event: string) {
    const command = this.commands.get(event);

    if (!command) {
      console.warn(`⚠️ Nenhum comando registrado para: ${event}`);
      return;
    }

    TaskQueue.add(() => command.execute());

    await TaskQueue.run();
  }

  list() {
    console.table(
      [...this.commands.keys()].map((event) => ({
        event,
      }))
    );
  }
}

export default new CommandRegistry();