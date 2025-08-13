import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Trash } from "lucide-react";
import { NodeForm } from "./NodeForm";
import type { TreeNodeProps } from "../types";

export const TreeNode = ({
  node,
  allNodes,
  onCreateNode,
  onDeleteNode,
}: TreeNodeProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);

  const children = allNodes.filter((n) => n.parentId === node._id);

  const handleAddChild = (name: string) => {
    onCreateNode({ name, parentId: node._id });
    setShowAddChild(false);
    setIsExpanded(true);
  };

  return (
    <div className="ml-4 mt-2">
      <div className="flex items-center space-x-2">
        {children.length > 0 && (
          <button onClick={() => setIsExpanded((prev) => !prev)}>
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
        )}
        <span>{node.name}</span>
        <button onClick={() => setShowAddChild((prev) => !prev)}>
          <Plus size={14} className="text-green-600" />
        </button>
        <button onClick={() => onDeleteNode(node._id)}>
          <Trash size={14} className="text-red-600" />
        </button>
      </div>

      {showAddChild && (
        <div className="ml-6">
          <NodeForm
            onSubmit={handleAddChild}
            onCancel={() => setShowAddChild(false)}
            placeholder="Enter child node name..."
          />
        </div>
      )}

      {isExpanded && children.length > 0 && (
        <div className="ml-6 border-l pl-2">
          {children.map((child) => (
            <TreeNode
              key={child._id}
              node={child}
              allNodes={allNodes}
              onCreateNode={onCreateNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};
