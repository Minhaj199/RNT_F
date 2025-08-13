
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
    onSubmit:(name:string)=>void
    onCancel:()=>void
    placeholder:string
    loading?:boolean
   
}
export interface IOperations{
  getRootNodes:(nodes:NodeData[])=>NodeWithChildNode[]
  getNodeChildren:(nodeId:string,nodedata:NodeData[])=>NodeWithChildNode[]
  createNode:(nodedata:Partial<NodeData>,nodes:NodeData[])=>Promise<NodeData>

}
export interface TreeNodeProps {
  node: NodeWithChildNode|NodeData;
  allNodes: NodeData[];
  onCreateNode: (data: Partial<NodeData>) => void;
  onDeleteNode: (id: string) => void;
}