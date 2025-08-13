import { useState, useEffect } from "react";
import { Operations } from "./operations";
import { TreeIcon } from "./components/TreeIcons";
import { Plus } from "lucide-react";
import { NodeForm } from "./components/NodeForm";
import { TreeNode } from "./components/TreeNode";
import type { IOperations, NodeData, NodeWithChildNode } from "./types";
import { request } from "./utils/axiosUtil";
import { enqueueSnackbar } from "notistack";
import Notiflix from "notiflix";

const App = () => {
  const [fetchedData, setFetchedData] = useState<NodeData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddRoot, setShowAddRoot] = useState(false);

  const operation: IOperations = new Operations();

  const rootNodes: NodeWithChildNode[] = operation.getRootNodes(fetchedData);

  const loadNodes = async () => {
    try {
      setLoading(true);
      const result: { data: NodeData[] } = await request({
        url: "/api/fetch-nodes",
      });
      setFetchedData(result.data);
    } catch {
      enqueueSnackbar("Failed to load nodes", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNodes();
  }, []);

  const handleCreateNode = async (nodeData: Partial<NodeData>) => {
    try {
      const newNode = await operation.createNode(nodeData, fetchedData);
      setFetchedData((prev) => [...prev, newNode]);
    } catch (err) {
      enqueueSnackbar(
        err instanceof Error ? err.message : "Failed to create node",
        { variant: "error" }
      );
    }
  };

  const handleDeleteNode = async (id: string) => {
    Notiflix.Confirm.show(
      "Delete",
      "Are you sure deleting ?",
      "Yes",
      "No",
      () => deleteFunction()
    );
    async function deleteFunction() {
      try {
        const collectIds = (nodeId: string, all: NodeData[]): string[] => {
          const childIds = all
            .filter((n) => n.parentId === nodeId)
            .flatMap((n) => collectIds(n._id, all));
          return [nodeId, ...childIds];
        };
        const idsToRemove = collectIds(id, fetchedData);
        console.log(idsToRemove);
        await request({
          url: "/api/remove-nodes",
          method: "delete",
          data: idsToRemove,
        });
        setFetchedData((prev) =>
          prev.filter((n) => !idsToRemove.includes(n._id))
        );
      } catch (error) {
        if (error instanceof Error) {
          enqueueSnackbar(error.message, { variant: "error" });
        } else {
          enqueueSnackbar("internal server error");
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading tree structure...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Title & Icon */}
            <div className="flex items-center space-x-3">
              <TreeIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold">Recursive Node Tree</h1>
                <p className="text-gray-600 text-sm">
                  Infinite nesting with persistent storage
                </p>
              </div>
            </div>

            {/* Add Button */}
            <button
              onClick={() => setShowAddRoot(!showAddRoot)}
              className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg w-full sm:w-auto"
            >
              <Plus className="h-4 w-4" />
              <span>Add Root Node</span>
            </button>
          </div>

          {/* Add Root Node Form */}
          {showAddRoot && (
            <div className="mt-4 border-t pt-4">
              <NodeForm
                onSubmit={(name) => handleCreateNode({ name })}
                onCancel={() => setShowAddRoot(false)}
                placeholder="Enter root node name..."
              />
            </div>
          )}
        </div>

        {/* Nodes List */}
        <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
          {rootNodes.length === 0 ? (
            <div className="text-center py-12 text-gray-500 text-sm sm:text-base">
              No nodes yet
            </div>
          ) : (
            rootNodes.map((node) => (
              <TreeNode
                key={node._id}
                node={node}
                allNodes={fetchedData}
                onCreateNode={handleCreateNode}
                onDeleteNode={handleDeleteNode}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
