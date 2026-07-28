class AgentManager {
  private agents: Map<string, unknown> = new Map();

  register(name: string, agent: unknown) {
    this.agents.set(name, agent);

    console.log(`✅ Agent registrado: ${name}`);
  }

  get(name: string) {
    return this.agents.get(name);
  }

  getAll() {
    return this.agents;
  }

  listAgents() {
    console.table(
      [...this.agents.keys()].map((name) => ({
        Agent: name,
      }))
    );
  }
}

export default new AgentManager();