import { useState } from "react";
import { explorer } from "../data/folderData";
import TreeNode from "./TreeNode";
import type { TreeNodeType } from "../types/tree";

const TreeView = () => {
  const [explorerData, setExplorerData] = useState<TreeNodeType> (explorer);

  return (
    <>
      <TreeNode explorer = {explorerData}/>
    </>
  );
};

export default TreeView;
