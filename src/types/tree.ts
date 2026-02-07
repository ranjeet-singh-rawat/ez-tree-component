export interface TreeNodeType {
  id: string;
  label: string;
  isFolder: boolean;
  children: TreeNodeType[] | null;
  parentId: string | null;
}
