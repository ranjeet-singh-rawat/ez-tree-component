import { useState } from "react";
import type { TreeNodeType } from "../types/tree";

interface TreeNodeProps {
  explorer: TreeNodeType;
}

const TreeNode = ({ explorer } :TreeNodeProps) => {

  const[expand,setExpand] = useState<boolean>(false);
  const handleNewFolder = (e: React.MouseEvent<HTMLButtonElement>) => (
    e.stopPropagation()
  )

  if(explorer.isFolder){

    return (
      <>
      <div className="folder cursor-pointer flex justify-center items-center gap-5" onClick={()=>setExpand(!expand)}>
        <span>{expand?"📂":"📁"} {explorer.label}</span>
        <div>
          <button onClick={(e)=>(handleNewFolder(e))}>Folder ➕</button>
          <button onClick={(e)=>(handleNewFolder(e))}>File ➕</button>
        </div>
      </div>

      <div style={{display:expand?"block":"none"}} className="pl-14">
        {explorer.children?.map((exp)=>{
          return(
            <TreeNode explorer={exp}/>
          )
        })}
      </div>
    </>
  );
}else{
  return <span className="file flex">🗃️ {explorer.label}</span>
}
};

export default TreeNode;
