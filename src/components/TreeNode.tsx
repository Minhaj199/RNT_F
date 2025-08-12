import { ChevronDown, ChevronRight, Circle, Folder, FolderOpen, Plus, Trash2 } from "lucide-react";
import { NodeForm } from "./NodeForm";
import { useEffect, useState } from "react";
import type { NodeWithChildNode, TreeNodeProp } from "../types";

export const TreeNode = ({ node, onNodeDeleted, level = 0, onRefresh,operation,nodes,refetch }:TreeNodeProp) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [children, setChildren] = useState<(NodeWithChildNode[])>(node?.children||[]);
  const [loading, setLoading] = useState(false);
  const hasChildren = children?.length > 0;
  const indentLevel = level * 24;
  const toggleExpanded = () => {
    if (hasChildren) {
      setIsExpanded(!isExpanded);
    }
  };
useEffect(() => {
  setChildren(node?.children || []);
}, [node?.children]);
  const handleCreateChild = async (name:string) => {
    try {
      setLoading(true);   
       await operation.createNode({ name, parentId: node._id },nodes); 
      refetch()
      setShowAddChild(false);
      if (!isExpanded) {
        setIsExpanded(true);
      }
    } catch (err) {
      if(err instanceof Error){
        alert(err.message);

      }
      console.error('Error creating child node:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNode = async () => {
    if (!confirm(`Are you sure you want to delete "${node?.name}" and all its children?`)) {
      return;
    }

    try {
      setLoading(true);
      const success =await operation.deleteNode(node?._id,nodes);
      if (success) {
        onNodeDeleted(node._id);
        onRefresh?.();
      }
    } catch (err) {
      console.error('Error deleting node:', err);
      alert('Failed to delete node');
    } finally {
      setLoading(false);
    }
  };

  const handleChildDeleted = (deletedChildId:string) => {
    setChildren(prev => prev.filter(child => child._id !== deletedChildId));
  };

  const getNodeIcon = () => {
    if (!hasChildren) {
      return <Circle className="h-4 w-4 text-blue-500" />;
    }
    return isExpanded ? (
      <FolderOpen className="h-4 w-4 text-blue-600" />
    ) : (
      <Folder className="h-4 w-4 text-blue-500" />
    );
  };

  const getExpandIcon = () => {
    if (!hasChildren) return null;
    return isExpanded ? (
      <ChevronDown className="h-4 w-4 text-gray-500" />
    ) : (
      <ChevronRight className="h-4 w-4 text-gray-500" />
    );
  };

  return (
    <div className="select-none">
  
      <div
        className={`group flex items-center py-2 px-3 rounded-md hover:bg-gray-50 transition-colors ${
          loading ? 'opacity-50' : ''
        }`}
        style={{ marginLeft: `${indentLevel}px` }}
      >
    
        <button
          onClick={toggleExpanded}
          className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded hover:bg-gray-200 transition-colors"
          disabled={!hasChildren}
        >
          {getExpandIcon()}
        </button>


        <div className="flex-shrink-0 ml-1 mr-3">
          {getNodeIcon()}
        </div>

        <span
          className="flex-grow text-gray-900 font-medium cursor-pointer text-sm"
          onClick={toggleExpanded}
        >
          {node?.name}
        </span>

   
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setShowAddChild(!showAddChild)}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Add child node"
            disabled={loading}
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={handleDeleteNode}
            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete node"
            disabled={loading}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add Child Form */}
      {showAddChild && (
        <div
          className="mt-2 mb-3 bg-gray-50 rounded-md p-3"
          style={{ marginLeft: `${indentLevel + 24}px` }}
        >
          <NodeForm
            onSubmit={handleCreateChild}
            onCancel={() => setShowAddChild(false)}
            placeholder={`Add child to "${node.name}"...`}
            loading={loading}
          />
        </div>
      )}


      {isExpanded && hasChildren && (
        <div className="mt-1">
          {children.map((child) => (
            <TreeNode
              key={child?._id}
              node={child}
              onNodeDeleted={handleChildDeleted}
              level={level + 1}
              onRefresh={onRefresh}
              operation={operation}
              nodes={nodes}
              refetch={refetch}
            />
          ))}
        </div>
      )}
    </div>
  );
};
