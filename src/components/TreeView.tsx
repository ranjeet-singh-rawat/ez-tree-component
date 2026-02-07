import { useState } from "react";
import { explorer } from "../data/folderData";
import TreeNode from "./TreeNode";
import type { TreeNodeType } from "../types/tree";

const TreeView = () => {
  const [explorerData, setExplorerData] = useState<TreeNodeType>(explorer);

  const insertNode = (tree: TreeNodeType, folderId: string, item: string, isFolder: boolean): TreeNodeType => {
    if (tree.id === folderId && tree.isFolder) {
      const newNode: TreeNodeType = {
        id: new Date().getTime().toString(),
        label: item,
        isFolder,
        children: isFolder ? [] : null,
        parentId: folderId,
      };
      return {
        ...tree,
        children: tree.children ? [...tree.children, newNode] : [newNode],
      };
    }

    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map((child) => insertNode(child, folderId, item, isFolder)),
      };
    }

    return tree;
  };

  const deleteNode = (tree: TreeNodeType, nodeId: string): TreeNodeType | null => {
    if (tree.id === nodeId) {
      return null;
    }

    if (tree.children) {
      return {
        ...tree,
        children: tree.children
          .map((child) => deleteNode(child, nodeId))
          .filter((child): child is TreeNodeType => child !== null),
      };
    }

    return tree;
  };

  const updateNode = (tree: TreeNodeType, nodeId: string, newLabel: string): TreeNodeType => {
    if (tree.id === nodeId) {
      return { ...tree, label: newLabel };
    }

    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map((child) => updateNode(child, nodeId, newLabel)),
      };
    }

    return tree;
  };

  const loadChildren = async (nodeId: string): Promise<TreeNodeType[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Return different mock data based on folder
    if (nodeId === "1") {
      // Root folder gets main folders
      return [
        {
          id: "2",
          label: "Folder A",
          isFolder: true,
          children: [],
          parentId: "1",
        },
        {
          id: "3",
          label: "Folder B",
          isFolder: true,
          children: null,
          parentId: "1",
        },
        {
          id: "4",
          label: "Folder C",
          isFolder: true,
          children: null,
          parentId: "1",
        },
      ];
    } else if (nodeId === "3") {
      // Folder B gets files
      return [
        {
          id: "5",
          label: "file.txt",
          isFolder: false,
          children: null,
          parentId: nodeId,
        },
        {
          id: "6",
          label: "document.pdf",
          isFolder: false,
          children: null,
          parentId: nodeId,
        },
      ];
    } else if (nodeId === "4") {
      // Folder C gets a subfolder
      return [
        {
          id: "7",
          label: "Subfolder",
          isFolder: true,
          children: [],
          parentId: nodeId,
        },
        {
          id: "8",
          label: "image.png",
          isFolder: false,
          children: null,
          parentId: nodeId,
        },
      ];
    }
    
    // Default: return generic lazy loaded items
    return [
      {
        id: `${nodeId}-child-${Date.now()}`,
        label: "Lazy Loaded Item",
        isFolder: false,
        children: null,
        parentId: nodeId,
      },
    ];
  };

  const handleInsert = (folderId: string, item: string, isFolder: boolean) => {
    const updatedTree = insertNode(explorerData, folderId, item, isFolder);
    setExplorerData(updatedTree);
  };

  const handleDelete = (nodeId: string) => {
    const updatedTree = deleteNode(explorerData, nodeId);
    if (updatedTree) {
      setExplorerData(updatedTree);
    }
  };

  const handleUpdate = (nodeId: string, newLabel: string) => {
    const updatedTree = updateNode(explorerData, nodeId, newLabel);
    setExplorerData(updatedTree);
  };

  const handleLazyLoad = async (nodeId: string) => {
    const children = await loadChildren(nodeId);
    const updateTreeWithChildren = (tree: TreeNodeType): TreeNodeType => {
      if (tree.id === nodeId) {
        return {
          ...tree,
          children: children,
          isLoading: false,
        };
      }
      if (tree.children) {
        return {
          ...tree,
          children: tree.children.map(updateTreeWithChildren),
        };
      }
      return tree;
    };
    setExplorerData(updateTreeWithChildren(explorerData));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tree View Component</h2>
      <TreeNode
        explorer={explorerData}
        handleInsertNode={handleInsert}
        handleDeleteNode={handleDelete}
        handleUpdateNode={handleUpdate}
        handleLazyLoad={handleLazyLoad}
      />
    </div>
  );
};

export default TreeView;
