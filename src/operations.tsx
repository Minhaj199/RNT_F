import { request } from "./utils/axiosUtil";
import type { IOperations, NodeData, NodeWithChildNode } from "./types";

export class Operations implements IOperations {
  getRootNodes(nodes: NodeData[]): NodeWithChildNode[] {
    const rootNodes = nodes.filter((node) => !node.parentId);
    const data = rootNodes?.map((node) => ({
      ...node,
      children: this.getNodeChildren(node._id, nodes),
    }));
    return data;
  }

  getNodeChildren(nodeId: string, nodes: NodeData[]): NodeWithChildNode[] {
    const childIds: string[] =
      nodes.find((n) => n._id === nodeId)?.children || [];
    return childIds
      ?.map((childId) => {
        const child = nodes.find((n) => n._id === childId);
        return child
          ? { ...child, children: this.getNodeChildren(childId, nodes) }
          : null;
      })
      .filter((n): n is NodeWithChildNode => n !== null);
  }

  async createNode(nodeData: Partial<NodeData>, nodes: NodeData[]) {
    try {
      const newNode = {
        name: nodeData.name,
        parentId: nodeData.parentId || null,
        children: [],
        level: nodeData.parentId
          ? (nodes.find((n) => n._id === nodeData.parentId)?.level ?? -1) + 1
          : 0,
      };
      /////////////////////////// post request to create new node
      const result: { success: boolean; newData: NodeData } = await request({
        url: "/api/add-node",
        method: "post",
        data: { ...newNode, level: newNode.level },
        headers: { "Content-Type": "application/json" },
      });
      return result.newData;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("internal error");
      }
    }
  }
}
