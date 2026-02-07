# Tree View Component Assignment

## Overview
A fully functional Tree View component built with React + TypeScript, featuring expand/collapse, CRUD operations, full drag & drop, lazy loading, inline editing, and data persistence.

## Features Implemented ✅

1. **Expand/Collapse Nodes** - Toggle folders with visual feedback (📁/📂)
2. **Add New Node** - Create files and folders dynamically
3. **Remove Node** - Delete nodes with confirmation dialog
4. **Drag & Drop Support** - Full implementation with visual feedback and validation
5. **Lazy Loading** - Load children on-demand with loading indicator
6. **Edit Node Name** - Double-click to edit inline
7. **Data Persistence** - Auto-save to localStorage with reset option
8. **Clean Architecture** - TypeScript, component decomposition, state management

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Usage Guide

### Basic Operations
- **Expand/Collapse**: Click folder icon (📁/📂)
- **Add Folder**: Click "📁+" → type name → Enter
- **Add File**: Click "📄+" → type name → Enter
- **Delete**: Click "🗑️" → confirm
- **Edit**: Double-click name → edit → Enter (or Escape to cancel)
- **Lazy Load**: Expand empty folders (children load automatically with ⏳ indicator)

### Drag & Drop
- **Start Drag**: Click and hold on any file or folder
- **Visual Feedback**: 
  - Dragged item becomes semi-transparent
  - Valid drop zones show green dashed border
  - Cursor changes to grabbing hand while dragging
- **Drop**: Release over a folder to move the item
- **Validation**: 
  - Can only drop into folders (not files)
  - Cannot drop folder into itself or its descendants
  - Invalid operations show alert message

### Data Persistence
- **Auto-save**: All changes automatically saved to browser localStorage
- **Persistent**: Data survives page refresh and browser restart
- **Reset**: Click "🔄 Reset Data" button to restore defaults (with confirmation)

## Project Structure

```
src/
├── components/
│   ├── TreeView.tsx    # Main container with state management & persistence
│   └── TreeNode.tsx    # Recursive node component with drag & drop
├── types/
│   └── tree.ts         # TypeScript interfaces
├── data/
│   └── folderData.ts   # Mock data for lazy loading
└── App.tsx             # Root component
```

## Technical Details

- **Framework**: React 18 + TypeScript
- **State Management**: React hooks (useState, useEffect)
- **Data Persistence**: localStorage API
- **Drag & Drop**: Native HTML5 Drag and Drop API
- **Styling**: Inline styles + CSS
- **No external libraries** for core functionality

## Key Features Explained

### Lazy Loading
- Folders with `children: null` trigger lazy loading
- Shows ⏳ loading indicator during 1-second simulated API call
- Different mock data loaded based on folder ID
- Empty folders (`children: []`) stay empty

### Drag & Drop Implementation
- **Smart Validation**: Prevents invalid moves (folder into itself/descendants)
- **Visual States**: Opacity changes, border highlights, cursor feedback
- **Hierarchy Preservation**: Maintains parent-child relationships
- **Cross-level Moves**: Move nodes between different parent folders

### Data Persistence
- **localStorage Key**: `"treeViewData"`
- **Auto-save Triggers**: Add, delete, edit, move operations
- **Reset Functionality**: Clears localStorage and restores defaults

## Data Structure

```typescript
interface TreeNodeType {
  id: string;              // Unique identifier
  label: string;           // Display name
  isFolder: boolean;       // File or folder
  children: TreeNodeType[] | null;  // null = lazy load, [] = empty
  parentId: string | null; // Parent reference
  isLoading?: boolean;
}
```


## Assignment Requirements Met

✅ Expand/Collapse nodes with icon changes  
✅ Add new nodes (files & folders) with input prompt  
✅ Remove nodes with confirmation  
✅ Full drag & drop with hierarchy validation  
✅ Lazy loading with async simulation  
✅ Edit node names inline  
✅ React + TypeScript implementation  
✅ Clean component decomposition  
✅ Minimal external dependencies  
✅ Reusable `<TreeView />` component  
✅ Mock data with lazy loading simulation  
✅ Clean UI with styling  
✅ **BONUS**: Data persistence with localStorage
