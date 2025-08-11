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
    children:(NodeWithChildNode)[]
    level:number
}
export type NodeFormProb={
    onSubmit:(name:string)=>Promise<void>
    onCancel:()=>void
    placeholder:string
    loading?:boolean
}
export interface IOperations{
  nodes:NodeData[]
  getRootNodes:()=>NodeWithChildNode[]
  getNodeChildren:(nodeId:string)=>NodeWithChildNode[]
  createNode:(nodedata:{name:string,parentId?:string})=>NodeData
  deleteNode(nodeId: string): boolean
}
export type TreeNodeProp={
    node:NodeWithChildNode|NodeData
    onNodeDeleted:(deletedNodeId:string)=>void
    level:number,
    onRefresh: () => void
    operation:IOperations

}