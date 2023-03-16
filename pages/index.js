// todo - find a way to select certain nodes and not others

// to

import React, { useCallback, useState, useRef, useEffect } from "react";

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";

import "reactflow/dist/style.css";

import CustomNode from "../components/CustomNode";

const nodeTypes = {
  custom: CustomNode,
};

import "reactflow/dist/style.css";

export default function Home() {
  const handleUpdate = (id, key, value) => {
    console.log("handle update " + id + " " + key + " " + value);
    setNodes((nds) =>
      nds.map((node) => {

        if (node.id === id) {
          console.log("found node")
          node.data = {
            ...node.data,
            [key]: value,
          };
        }
        return node;
      })
    );

    /*
    const newElements = elements.map((el) =>
      el.id === id.toString()
        ? { ...el, data: { ...el.data, [key]: value } }
        : el
    );
    setElements(newElements);*/
  };

  const initialNodes = [
    {
      id: "4",
      type: "default",
      className: "annotation",
      data: {
        label: "Story",
      },
      // draggable: false,
      selectable: false,
      position: { x: 500, y: 500 },
      style: {
        width: 500,
        height: 500,
      },
    },
    {
      id: "5",
      type: "custom",
      data: {
        name: "Simple prompt",
        part: "Global",
        onUpdate: handleUpdate,
        content:
          "I want you to act as a storyteller. You will come up with entertaining stories that are engaging, imaginative and captivating for the audience. It can be fairy tales, educational stories or any other type of stories which has the potential to capture people's attention and imagination. Depending on the target audience, you may choose specific themes or topics for your storytelling session e.g., if it’s children then you can talk about animals; If it’s adults then history-based tales might engage them better etc. My first request is",
      },
      position: { x: 0, y: 50 },
    },

    {
      id: "1000",
      type: "custom",
      data: {
        name: "Jane Doe",
        part: "Character",
        onUpdate: handleUpdate,
        content: "this is some content about the character",
      },
      position: { x: 0, y: 50 },
      onUpdate: handleUpdate,
    },
    {
      id: "1001",
      type: "custom",
      data: {
        name: "The haunted house",
        part: "Location",
        onUpdate: handleUpdate,
        content: "this is some content about the haunted house",
      },
      position: { x: 0, y: 50 },
      onUpdate: handleUpdate,
    },
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "This is a test prompt" },
    },
    { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
    {
      id: "3",
      type: "default",
      className: "annotation",
      data: {
        label: (
          <>
            Hi! Welcome to AI Storybuilder. Click on the generate button to
            generate a story. 🥳
          </>
        ),
      },
      draggable: true,
      selectable: false,
      position: { x: 10, y: 10 },
    },
  ];
  const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const [gptText, setGPTText] = useState("GPT Text");

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === "1") {
          // it's important that you create a new object here
          // in order to notify react flow about the change
          node.data = {
            ...node.data,
            label: gptText,
          };
        }
        return node;
      })
    );
  }, [gptText, setGPTText]);

  function askChatGPT(question) {
    var id = "oilfjaabefbjoagnomallidmlpkbfcfm";
    const port = chrome.runtime.connect(id);

    port.onMessage.addListener(function (msg) {
      // console.log("message received from the extension");
      // console.log(msg);
      if (msg.answer) {
        setGPTText(msg.answer);
      }
      // should update
      // keep updating the content
    });

    port.postMessage({ question });
  }

  // create the function to add a node
  const addNode = useCallback(() => {
    // Call chatgpt generation with default prompt

    // update the text of the last added node
    // just get the reference of a node and update it

    const nodeId = (nodes.length + 1).toString();
    const newNode = {
      id: nodeId,
      position: { x: 100, y: 100 },
      data: { label: `Node ${nodeId}` },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  }, [nodes, setNodes]);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      <button
        id="generateBtn"
        onClick={() => askChatGPT("What is your favorite story?")}
      >
        Generate
      </button>

      {/* <button id="generateBtn" onClick={addNode}>Generate</button> */}
    </div>
  );
}