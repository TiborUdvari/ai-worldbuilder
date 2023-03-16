import React, { memo } from "react";
import { Handle, Position } from "reactflow";
import ContentEditable from "react-contenteditable";
import sanitizeHtml from "sanitize-html";

// Should update the master from here

function CustomNode({ id, data, selected }) {
  let emoji;

  if (data.part === "Character") {
    emoji = "🚶";
  } else if (data.part === "Global") {
    emoji = "🌎";
  } else if (data.part === "Plot") {
    emoji = "📜";
  } else if (data.part === "Location") {
    emoji = "🏠";
  } else {
    emoji = "🧙‍♂️";
  }

  const handleDataChange = (key, value) => {
    data.onUpdate(id, key, value);
  };

  // const handleDataChange = React.useCallback((evt) => {
  //   // const sanitizeConf = {
  //   //   allowedTags: ["b", "i", "a", "p"],
  //   //   allowedAttributes: { a: ["href"] },
  //   // };
  //   // setContent(sanitizeHtml(evt.currentTarget.innerHTML, sanitizeConf));
  //   // // this should go up to the parent
  // }, []);

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md bg-white border-4  max-w-md box-sizing-border-box ${
        selected ? "border-gray-900 border-4" : "border-gray-50 border-4"
      }`}
    >
      <div className="flex">
        <div className="rounded-full w-12 h-12 flex justify-center items-center bg-gray-100">
          {emoji}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">
            <ContentEditable
              className="nodrag"
              // onChange={(e) => handleDataChange('content', e.currentTarget.innerHTML)}
              onBlur={(e) =>
                handleDataChange("name", e.currentTarget.innerHTML)
              }
              html={data.name}
            />
          </div>
          <div className="text-gray-500">{data.part}</div>
          {/* <div className="text-gray-500">{"selected val " + JSON.stringify(selected)}</div> */}
        </div>
      </div>
      <div className="nodrag">
        <ContentEditable
          className="nodrag"
          // onChange={(e) => handleDataChange('content', e.currentTarget.innerHTML)}
          onBlur={(e) => handleDataChange("content", e.currentTarget.innerHTML)}
          html={data.content}
        />
      </div>

      {/*       
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-teal-500" /> 
      */}
    </div>
  );
}

export default memo(CustomNode);
