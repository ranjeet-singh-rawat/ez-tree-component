import { useState } from "react";
import type { TreeNodeType } from "../types/tree";

interface TreeNodeProps {
  explorer: TreeNodeType;
}

const TreeNode = ({ explorer } :TreeNodeProps) => {
  console.log(explorer);

  const[expand,setExpand] = useState<boolean>(false);
  if(explorer.isFolder){

    return (
      <>
      <div className="folder cursor-pointer" onClick={()=>setExpand(!expand)}>
        <span>{expand?"📂":"📁"} {explorer.label}</span>
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
