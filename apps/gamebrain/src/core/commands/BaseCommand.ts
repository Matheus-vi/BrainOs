abstract class BaseCommand {
  abstract execute(): void | Promise<void>;
}

export default BaseCommand;