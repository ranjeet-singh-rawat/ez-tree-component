import { useState, useEffect } from "react";
import { explorer } from "../data/folderData";
import TreeNode from "./TreeNode";
import type { TreeNodeType } from "../types/tree";

const STORAGE_KEY = "treeViewData";

const TreeView = () => {
  // Load from localStorage or use default data
  const [explorerData, setExplorerData] = useState<TreeNodeType>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : explorer;
  });

  const [draggedNode, setDraggedNode] = useState<TreeNodeType | null>(null);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(explorerData));
  }, [explorerData]);

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

  const moveNode = (
    tree: TreeNodeType,
    draggedNodeId: string,
    targetNodeId: string,
    draggedNodeData: TreeNodeType
  ): TreeNodeType => {
    // First, remove the dragged node from its current location
    const treeWithoutDragged = removeNodeById(tree, draggedNodeId);
    
    // Then, add it to the target location
    return addNodeToTarget(treeWithoutDragged, targetNodeId, draggedNodeData);
  };

  const removeNodeById = (tree: TreeNodeType, nodeId: string): TreeNodeType => {
    if (tree.children) {
      return {
        ...tree,
        children: tree.children
          .filter((child) => child.id !== nodeId)
          .map((child) => removeNodeById(child, nodeId)),
      };
    }
    return tree;
  };

  const addNodeToTarget = (
    tree: TreeNodeType,
    targetId: string,
    nodeToAdd: TreeNodeType
  ): TreeNodeType => {
    if (tree.id === targetId && tree.isFolder) {
      // Add to target folder
      const updatedNode = { ...nodeToAdd, parentId: targetId };
      return {
        ...tree,
        children: tree.children ? [...tree.children, updatedNode] : [updatedNode],
      };
    }

    if (tree.children) {
      return {
        ...tree,
        children: tree.children.map((child) => addNodeToTarget(child, targetId, nodeToAdd)),
      };
    }

    return tree;
  };

  const findNodeById = (tree: TreeNodeType, nodeId: string): TreeNodeType | null => {
    if (tree.id === nodeId) return tree;
    
    if (tree.children) {
      for (const child of tree.children) {
        const found = findNodeById(child, nodeId);
        if (found) return found;
      }
    }
    
    return null;
  };

  const isDescendant = (parentId: string, childId: string, tree: TreeNodeType): boolean => {
    const parent = findNodeById(tree, parentId);
    if (!parent || !parent.children) return false;
    
    for (const child of parent.children) {
      if (child.id === childId) return true;
      if (isDescendant(child.id, childId, tree)) return true;
    }
    
    return false;
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

  const handleDragStart = (node: TreeNodeType) => {
    setDraggedNode(node);
  };

  const handleDrop = (targetNodeId: string) => {
    if (!draggedNode || draggedNode.id === targetNodeId) {
      setDraggedNode(null);
      return;
    }

    // Prevent dropping a folder into itself or its descendants
    if (isDescendant(draggedNode.id, targetNodeId, explorerData)) {
      alert("Cannot move a folder into itself or its descendants!");
      setDraggedNode(null);
      return;
    }

    const targetNode = findNodeById(explorerData, targetNodeId);
    
    // Only allow dropping into folders
    if (targetNode && targetNode.isFolder) {
      const updatedTree = moveNode(explorerData, draggedNode.id, targetNodeId, draggedNode);
      setExplorerData(updatedTree);
    }

    setDraggedNode(null);
  };

  const handleDragEnd = () => {
    setDraggedNode(null);
  };

  const resetData = () => {
    if (window.confirm("Reset to default data? This will clear all changes.")) {
      localStorage.removeItem(STORAGE_KEY);
      setExplorerData(explorer);
    }
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

  const handleUpdate = (nodeId: string, newLabel: string) => {
    const updatedTree = updateNode(explorerData, nodeId, newLabel);
    setExplorerData(updatedTree);
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
        <h2 style={{ margin: 0 }}>Tree View Component</h2>
        <button
          onClick={resetData}
          style={{
            padding: "6px 12px",
            backgroundColor: "#ff5722",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          🔄 Reset Data
        </button>
      </div>
      <TreeNode
        explorer={explorerData}
        handleInsertNode={handleInsert}
        handleDeleteNode={handleDelete}
        handleUpdateNode={handleUpdate}
        handleLazyLoad={handleLazyLoad}
        handleDragStart={handleDragStart}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        draggedNodeId={draggedNode?.id || null}
      />
    </div>
  );
};

export default TreeView;
