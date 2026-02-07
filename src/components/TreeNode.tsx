import { useState } from "react";
import type { TreeNodeType } from "../types/tree";

interface TreeNodeProps {
  explorer: TreeNodeType;
  handleInsertNode: (folderId: string, item: string, isFolder: boolean) => void;
  handleDeleteNode: (nodeId: string) => void;
  handleUpdateNode: (nodeId: string, newLabel: string) => void;
  handleLazyLoad: (nodeId: string) => void;
}

const TreeNode = ({
  explorer,
  handleInsertNode,
  handleDeleteNode,
  handleUpdateNode,
  handleLazyLoad,
}: TreeNodeProps) => {
  const [expand, setExpand] = useState<boolean>(false);
  const [showInput, setShowInput] = useState({
    visible: false,
    isFolder: false,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(explorer.label);
  const [isLoading, setIsLoading] = useState(false);

  const handleNewNode = (e: React.MouseEvent<HTMLButtonElement>, isFolder: boolean) => {
    e.stopPropagation();
    setExpand(true);
    setShowInput({
      visible: true,
      isFolder: isFolder,
    });
  };

  const onAddNode = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter" && e.currentTarget.value.trim()) {
      handleInsertNode(explorer.id, e.currentTarget.value, showInput.isFolder);
      setShowInput({ ...showInput, visible: false });
    }
  };

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${explorer.label}"?`)) {
      handleDeleteNode(explorer.id);
    }
  };

  const handleEdit = (e: React.MouseEvent<HTMLSpanElement>) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleEditSubmit = () => {
    if (editValue.trim() && editValue !== explorer.label) {
      handleUpdateNode(explorer.id, editValue);
    }
    setIsEditing(false);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleEditSubmit();
    } else if (e.key === "Escape") {
      setEditValue(explorer.label);
      setIsEditing(false);
    }
  };

  const handleExpand = async () => {
    if (!expand && explorer.isFolder && explorer.children === null) {
      setExpand(true);
      setIsLoading(true);
      await handleLazyLoad(explorer.id);
      setIsLoading(false);
    } else {
      setExpand(!expand);
    }
  };

  if (explorer.isFolder) {
    return (
      <div style={{ marginTop: "5px" }}>
        <div
          className="folder"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "4px",
            cursor: "pointer",
          }}
        >
          <span onClick={handleExpand} style={{ userSelect: "none" }}>
            {isLoading ? "⏳" : expand ? "📂" : "📁"}
          </span>
          
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={handleEditSubmit}
              onKeyDown={handleEditKeyDown}
              autoFocus
              style={{ padding: "2px 4px", fontSize: "14px" }}
            />
          ) : (
            <span onDoubleClick={handleEdit} style={{ flex: 1 }}>
              {explorer.label}
            </span>
          )}

          <div style={{ display: "flex", gap: "4px" }}>
            <button
              onClick={(e) => handleNewNode(e, true)}
              style={{ padding: "2px 6px", fontSize: "12px" }}
              title="Add Folder"
            >
              📁+
            </button>
            <button
              onClick={(e) => handleNewNode(e, false)}
              style={{ padding: "2px 6px", fontSize: "12px" }}
              title="Add File"
            >
              📄+
            </button>
            <button
              onClick={handleDelete}
              style={{ padding: "2px 6px", fontSize: "12px", color: "red" }}
              title="Delete"
            >
              🗑️
            </button>
          </div>
        </div>

        <div style={{ display: expand ? "block" : "none", paddingLeft: "20px" }}>
          {isLoading && (
            <div style={{ marginTop: "5px", color: "#666" }}>
              ⏳ Loading...
            </div>
          )}
          {showInput.visible && (
            <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "5px" }}>
              <span>{showInput.isFolder ? "📁" : "📄"}</span>
              <input
                type="text"
                autoFocus
                onBlur={() => setShowInput({ ...showInput, visible: false })}
                onKeyDown={onAddNode}
                placeholder="Enter name..."
                style={{ padding: "2px 4px", fontSize: "14px" }}
              />
            </div>
          )}
          {explorer.children?.map((exp) => (
            <TreeNode
              key={exp.id}
              explorer={exp}
              handleInsertNode={handleInsertNode}
              handleDeleteNode={handleDeleteNode}
              handleUpdateNode={handleUpdateNode}
              handleLazyLoad={handleLazyLoad}
            />
          ))}
        </div>
      </div>
    );
  } else {
    return (
      <div
        className="file"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "4px",
          marginTop: "5px",
        }}
      >
        <span>📄</span>
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={handleEditSubmit}
            onKeyDown={handleEditKeyDown}
            autoFocus
            style={{ padding: "2px 4px", fontSize: "14px" }}
          />
        ) : (
          <span onDoubleClick={handleEdit} style={{ flex: 1 }}>
            {explorer.label}
          </span>
        )}
        <button
          onClick={handleDelete}
          style={{ padding: "2px 6px", fontSize: "12px", color: "red" }}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    );
  }
};

export default TreeNode;
