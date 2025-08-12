import  { useState, useEffect } from 'react';
import {  Operations } from './operations';
import { TreeIcon } from './components/TreeIcons';
import { Plus } from 'lucide-react';
import { NodeForm } from './components/NodeForm';
import { TreeNode } from './components/TreeNode';
import type { IOperations, NodeData, NodeWithChildNode } from './types';
import { request } from './utils/axiosUtil';

const App = () => {
  const [rootNodes, setRootNodes] = useState<NodeWithChildNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);
  const [showAddRoot, setShowAddRoot] = useState(false);
  const [fetchedData,setFetchData]=useState<NodeData[]>([])
  let operation:IOperations=new Operations()

  useEffect(()=>{
    const nodes = operation.getRootNodes(fetchedData);
      setRootNodes(nodes);
  },[fetchedData])

  const loadRootNodes = async () => {
    try {
      setLoading(true);

      const resultData:{data:NodeData[]}=await request({url:'/api/fetch-nodes'})
      setFetchData(resultData.data) 
      
    } catch (err) {
      
      setError('Failed to load nodes');
      console.error('Error loading nodes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRootNodes();
  }, []);

  const handleCreateRootNode = async (name:string) => {
    try {
     const nodeNode= await operation.createNode({ name },fetchedData);
     setRootNodes(prev=>[...prev,nodeNode]) 
     setShowAddRoot(false);
    } catch (err) {
      if(err instanceof Error){
        setError(err.message)
      }else{
        setError('Failed to create node');
        console.error('Error creating node:', err);
      }
    }
  };

  const handleNodeDeleted = (deletedNodeId:string) => {
    setRootNodes(prev => prev.filter(node => node._id !== deletedNodeId));
  };

  const refreshNodes = () => {
    loadRootNodes();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading tree structure...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-4xl">

        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <TreeIcon className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                  Recursive Node Tree
                </h1>
                <p className="text-gray-600 text-sm mt-1">
                  Create and manage hierarchical tree structures with infinite nesting
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAddRoot(!showAddRoot)}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="h-4 w-4" />
              <span>Add Root Node</span>
            </button>
          </div>


          {showAddRoot && (
            <div className="mt-4 pt-4 border-t">
              <NodeForm
                onSubmit={handleCreateRootNode}
                onCancel={() => setShowAddRoot(false)}
                placeholder="Enter root node name..."
                
              />
            </div>
          )}
        </div>

   
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center justify-between">
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="text-red-800 hover:text-red-900 font-bold"
            >
              ×
            </button>
          </div>
        )}


        


        <div className="bg-white rounded-lg shadow-sm border p-6">
          {rootNodes.length === 0 ? (
            <div className="text-center py-12">
              <TreeIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No nodes yet
              </h3>
              <p className="text-gray-600 mb-4">
                Create your first root node to get started building your tree
              </p>
              <button
                onClick={() => setShowAddRoot(true)}
                className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Root Node</span>
              </button>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-4 pb-2 border-b">
                <h3 className="font-medium text-gray-900">Tree Structure</h3>
                <button
                  onClick={refreshNodes}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Refresh
                </button>
              </div>
              {rootNodes.map((node) => (
                <TreeNode
                  key={node._id}
                  node={node}
                  onNodeDeleted={handleNodeDeleted}
                  level={0}
                  onRefresh={refreshNodes}
                  operation={operation}
                  nodes={fetchedData}
                  refetch={loadRootNodes}
                />
              ))}
            </div>
          )}
        </div>

        

  
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Recursive Node Tree App - Full Stack Implementation</p>
          <p className="mt-1">Features: Infinite nesting • Recursive deletion • Persistent storage</p>
        </div>
      </div>
    </div>

  );
};

export default App;