import type { IOperations, NodeData, NodeWithChildNode } from "./types";


export class Operations implements IOperations {
  nodes:NodeData[]
 constructor(nodes:NodeData[]){
  this.nodes=nodes||[]
 }
  getRootNodes():NodeWithChildNode[] {
    const rootNodes = this.nodes.filter(node => !node.parentId);
    return rootNodes?.map(node => ({...node,children: this.getNodeChildren(node._id)}));
  }

  getNodeChildren(nodeId:string):NodeWithChildNode[] {
   
   const childIds:string[] = this.nodes.find(n => n._id === nodeId)?.children || [];

   return childIds?.map(childId => {
      const child = this.nodes.find(n => n._id === childId);

      return child ? {...child,children: this.getNodeChildren(childId)} : null}).filter((n):n is NodeWithChildNode =>n!==null);
  }

  createNode (nodeData:{name:string,parentId?:string}) {
    const newId = (Math.max(...this.nodes.map(n => parseInt(n._id))) + 1).toString();
    const newNode = {
      _id: newId,
      name: nodeData.name,
      parentId: nodeData.parentId || null,
      children: [],
      level: nodeData.parentId ? (this.nodes.find(n => n._id === nodeData.parentId)?.level||-1) + 1 : 0
    };
    /////////////////////////// post request to create new node
    '.create new doc'
    '.update Array'
    
    this.nodes.push(newNode);
    
    // Update parent's children array
    if (nodeData.parentId) {
      const parent = this.nodes.find(n => n._id === nodeData.parentId);
      if (parent) {
        parent.children.push(newId);
      }
    }
    return { ...newNode, children: [] };
  }

  deleteNode (nodeId:string) {
    const nodeToDelete = this.nodes.find(n => n._id === nodeId)
    if (!nodeToDelete) return false;

    // Recursively collect all descendant IDs
    const getAllDescendants = (id:string) => {
      const node = this.nodes.find(n => n._id === id);
      if (!node) return [];
      
      let descendants = [id];
      node.children.forEach(childId => {
        descendants = descendants.concat(getAllDescendants(childId));
      });
      return descendants;
    };

    const idsToDelete = getAllDescendants(nodeId);
    
    // Remove from parent's children array
    if (nodeToDelete.parentId) {
      const parent = this.nodes.find(n => n._id === nodeToDelete.parentId);
      if (parent) {
        parent.children = parent.children.filter(id => id !== nodeId);
      }
    }
    
    // Remove all descendants from nodes array
    this.nodes = this.nodes.filter(node => !idsToDelete.includes(node._id));
    
    return true;
  }
};