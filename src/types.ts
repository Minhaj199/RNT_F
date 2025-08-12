
export interface NodeData{
    _id:string
    name:string,
    parentId:string|null
    children:string[]
    level:number
}
export interface NodeWithChildNode{
     _id:string
    name:string,
    parentId:string|null
    children:NodeWithChildNode[]
    level:number
}
export type NodeFormProb={
    onSubmit:(name:string)=>Promise<void>
    onCancel:()=>void
    placeholder:string
    loading?:boolean
}
export interface IOperations{
  getRootNodes:(nodes:NodeData[])=>NodeWithChildNode[]
  getNodeChildren:(nodeId:string,nodedata:NodeData[])=>NodeWithChildNode[]
  createNode:(nodedata:{name:string,parentId?:string},nodes:NodeData[])=>Promise<NodeWithChildNode>
  deleteNode(nodeId: string,nodes:NodeData[]):Promise< boolean>
}
export type TreeNodeProp={
    node:NodeWithChildNode
    onNodeDeleted:(deletedNodeId:string)=>void
    level:number,
    onRefresh: () => void
    operation:IOperations
    nodes:NodeData[]
    refetch:()=>void
}