
import { AgentCard } from "@/components/agents/AgentCard";
import type { AgentConfig } from "@/hooks/useAgents";
import { useMemo } from "react";

interface AgentListProps {
  agents: AgentConfig[];
  searchQuery: string;
  sortField: "name" | "model";
  sortDirection: "asc" | "desc";
  activeFilter: boolean | null;
  onEdit: (agent: AgentConfig) => void;
  onToggle: (agentId: string) => void;
  onDelete: (agentId: string) => void;
  onTest: (agent: AgentConfig) => void;
}

export const AgentList = ({
  agents,
  searchQuery,
  sortField,
  sortDirection,
  activeFilter,
  onEdit,
  onToggle,
  onDelete,
  onTest
}: AgentListProps) => {
  const filteredAndSortedAgents = useMemo(() => {
    return agents
      .filter(agent => {
        const matchesSearch = agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            agent.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesActiveFilter = activeFilter === null || agent.active === activeFilter;
        return matchesSearch && matchesActiveFilter;
      })
      .sort((a, b) => {
        const direction = sortDirection === "asc" ? 1 : -1;
        if (sortField === "name") {
          return direction * a.name.localeCompare(b.name);
        }
        return direction * a.model.localeCompare(b.model);
      });
  }, [agents, searchQuery, sortField, sortDirection, activeFilter]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredAndSortedAgents.map(agent => (
        <AgentCard
          key={agent.id}
          agent={agent}
          onEdit={() => onEdit(agent)}
          onToggle={() => onToggle(agent.id)}
          onDelete={() => onDelete(agent.id)}
          onTest={() => onTest(agent)}
        />
      ))}
    </div>
  );
};
