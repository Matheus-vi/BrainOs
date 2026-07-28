import AgentManager from "../manager/AgentManager";

import CommandRegistry from "../commands/CommandRegistry";

class DecisionEngine {
  async dispatch(event: string) {
    console.log(`🧠 DecisionEngine recebeu: ${event}`);

    await CommandRegistry.execute(event);
  }

  showAgents() {
    AgentManager.listAgents();
  }
}

export default new DecisionEngine();