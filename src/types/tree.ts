export interface TreeNodeType {
  id: string;
  label: string;
  isFolder: boolean;
  children: TreeNodeType[] | null;
  isExpanded: boolean;
  isLoading: boolean;
  parentId: string | null;
}
