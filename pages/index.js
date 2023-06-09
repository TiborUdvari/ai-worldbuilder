// todo - find a way to select certain nodes and not others
// todo - create a new thing
// todo pass in the title
// save and load data
// save image

import React, { useCallback, useState, useRef, useEffect } from "react";

import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from "reactflow";
import { toPng } from 'html-to-image';

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
          console.log("found node");
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
    // {
    //   id: "1",
    //   type: "default",
    //   className: "annotation",
    //   data: {
    //     label: "Story",
    //   },
    //   // draggable: false,
    //   selectable: false,
    //   position: { x: 500, y: 500 },
    //   style: {
    //     width: 500,
    //     height: 500,
    //   },
    // },
    {
      id: "1",
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
      id: "2",
      type: "custom",
      data: {
        name: "Arthur Dent",
        part: "Character",
        onUpdate: handleUpdate,
        content:
          "Initially a bit of a wet blanket, Arthur becomes increasingly adventurous and quick-witted as he travels through space. He is loyal to his friends and has a dry sense of humor.",
      },
      position: { x: 0, y: 50 },
      onUpdate: handleUpdate,
    },
    {
      id: "3",
      type: "custom",
      data: {
        name: "Ford Prefect",
        part: "Character",
        onUpdate: handleUpdate,
        content:
          "Ford is clever and quick-witted, with a dry sense of humor. He is also adventurous and enjoys exploring the galaxy. He can sometimes come across as aloof or detached, but he is fiercely loyal to his friends.",
      },
      position: { x: 0, y: 50 },
      onUpdate: handleUpdate,
    },
    {
      id: "4",
      type: "custom",
      data: {
        name: "Magrathea",
        part: "Location",
        onUpdate: handleUpdate,
        content: `Name: Magrathea
        Type: Planet
        Inhabitants: The creators of custom-made luxury planets
        Appearance: Magrathea is a rocky, desolate planet that appears to be extinct on the surface. However, it is later revealed to be inhabited by the planet's creators, who live in underground cities and factories.
        
        Climate: The climate on Magrathea is unknown, as it is not described in detail in the story.
        
        Culture: The inhabitants of Magrathea are known for their ability to create custom-made luxury planets. They are incredibly wealthy and powerful, but are thought to be extinct by the rest of the galaxy.
        
        Significance: Magrathea plays a key role in the story, as it is the location where the Heart of Gold crew discovers the plans for Earth, which was created by the inhabitants of Magrathea as a giant computer to calculate the meaning of life. Magrathea also provides a setting for many of the novel's philosophical discussions about the nature of existence and the purpose of life.
        
        Features: Magrathea is known for its factories and underground cities, which are filled with advanced technology and machinery. The planet also has a network of artificial suns, which were created to power the planet's surface before it became extinct.
        
        Hazards: The main hazard on Magrathea is the planet's advanced security system, which is designed to prevent unauthorized visitors from accessing the planet's secrets. This security system includes robots, force fields, and other defensive measures.`,
      },
      position: { x: 0, y: 50 },
      onUpdate: handleUpdate,
    },
    {
      id: "5",
      type: "custom",
      data: {
        name: "Vogon construction ship",
        part: "Location",
        onUpdate: handleUpdate,
        content: `Description:

        The Vogon Constructor Ship B-789 is a massive vessel, measuring over 10 miles in length. The ship's exterior is constructed from heavy, gray metal, with large, blocky structures and harsh, angular lines. The ship's appearance is utilitarian, with no decorative or aesthetic features.
        
        The interior of the ship is notoriously unpleasant, featuring dimly-lit, grimy corridors and cramped, windowless compartments. The air inside the ship is stale and unpleasant, with a pervasive odor of rot and decay. The ship's main bridge is manned by a crew of Vogons, who oversee the ship's demolition activities and navigational systems.
        
        Features:
        
        The Vogon spaceship is powered by an Infinite Improbability Drive, a highly advanced piece of technology that allows it to travel through space and time with incredible speed and unpredictability.
        The ship is equipped with a variety of advanced weapons and defense systems, including laser cannons and shields, which are used to protect the ship during its demolition missions.
        The Vogon Constructor Ship is crewed by Vogons, a highly bureaucratic and sadistic alien race known for their love of poetry and torture.
        The ship's demolition activities are highly organized and systematic, with the Vogons using a variety of tools and methods to destroy planets and clear the way for new hyperspace bypasses.`,
      },
      position: { x: 0, y: 50 },
      onUpdate: handleUpdate,
    },

    // {
    //   id: "4",
    //   type: "default",
    //   className: "annotation",
    //   data: {
    //     label: (
    //       <>
    //         Hi! Welcome to AI Storybuilder. Click on the generate button to
    //         generate a story. 🥳
    //       </>
    //     ),
    //   },
    //   draggable: true,
    //   selectable: false,
    //   position: { x: 10, y: 10 },
    // },
  ];
  const initialEdges = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedValue, setSelectedValue] = useState("Character"); // initialize state with an empty string
  const [rfInstance, setRfInstance] = useState(null);
  const fileInputRef = useRef(null);
  const saveButtonRef = useRef(null);

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const handleFileInput = (event) => {
    // setSelectedFile(event.target.files[0]);
    console.log(event.target.files[0]);
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        console.log("onload finished");
        const json = JSON.parse(e.target.result);

        if (json) {
          const { x = 0, y = 0, zoom = 1 } = json.viewport;
          // onUpdate: handleUpdate,
          // foreach json.nodes add onUpdate: handleUpdate

          // map json.nodes to add onUpdate: handleUpdate
          // map json.edges to add onUpdate: handleUpdate
          console.log("json before")
          console.log(json.nodes)
          json.nodes.forEach((element) => {
            element.onUpdate = handleUpdate;
            element.data.onUpdate = handleUpdate;
          });
          console.log("after")
          console.log(json.nodes);
          setNodes(json.nodes || []);
          setEdges(json.edges || []);
          // setViewport({ x, y, zoom });
        }
      } catch (error) {
        console.error(error);
      }
    };
    reader.readAsText(file);
  };

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const [gptText, setGPTText] = useState(
    initialNodes[initialNodes.length - 1].data.content
  );

  function downloadImage(dataUrl) {
    const a = document.createElement('a');
  
    a.setAttribute('download', 'reactflow.png');
    a.setAttribute('href', dataUrl);
    a.click();
  }

  useEffect(() => {
    setNodes((nds) =>
      nds.map((node, i) => {
        if (i == nodes.length - 1) {
          node.data = {
            ...node.data,
            content: gptText,
          };
        }

        // if (node.id === nodes.length.toString()) {
        //   // it's important that you create a new object here
        //   // in order to notify react flow about the change
        //   node.data = {
        //     ...node.data,
        //     label: gptText,
        //   };
        // }
        return node;
      })
    );
  }, [gptText, setGPTText]);

  const generate = () => {
    console.log("Selected value");
    console.log(selectedValue);
    let part = selectedValue;
    const nodeId = (nodes.length + 1).toString();

    // Find the rightest custom node to the right of the screen

// Find the rightest custom node to the right of the screen
let targetX = 0;

// Filter selected custom nodes and all custom nodes
const selectedCustomNodes = nodes.filter(
  (node) => node.type === "custom" && node.selected === true
);
const allCustomNodes = nodes.filter((node) => node.type === "custom");

// Find the rightest custom node among the selected ones or all custom nodes
const targetNodes = selectedCustomNodes.length > 0 ? selectedCustomNodes : allCustomNodes;
if (targetNodes.length > 0) {
  const rightestNode = targetNodes.reduce((rightest, node) =>
    node.position.x > rightest.position.x ? node : rightest
  );
  targetX = rightestNode.position.x + 450;
}

    const newNode = {
      id: nodeId,
      type: "custom",
      data: {
        name: `New ${part}`,
        part: part,
        onUpdate: handleUpdate,
        content: "--- Empty content",
      },
      position: { x: targetX , y: 50 },
      onUpdate: handleUpdate,
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);
    generateStory(part);
  };

  const generateStory = (part) => {
    // find the selected custom nodes and order them by their x position
    const customNodes = nodes.filter(
      (node) => node.type === "custom" && node.selected === true
    );
    const orderedCustomNodes = customNodes.sort(
      (a, b) => a.position.x - b.position.x
    );

    const customContentString = orderedCustomNodes.reduce((acc, cur) => {
      console.log("current is " + JSON.stringify(cur));
      let prefacingText = "";

      if (cur.data.part !== "Global") {
        prefacingText = `Inspire yourself from ${cur.data.part.toLowerCase()}: ${
          cur.data.name
        }, `;
      }
      return acc + " " + prefacingText + cur.data.content;
    }, "");

    // filter the nodes array to get the nodes that have a part of "Global"
    // const globalNodes = nodes.filter((node) => node.data.part === "Global");

    // // get the content of the global nodes
    // const globalContent = globalNodes.map((node) => node.data.content);

    // // reduce the globalcontent array to a single string
    // const globalContentString = globalContent.reduce((acc, cur) => {
    //   return acc + " " + cur;
    // });

    prompt = customContentString;
    if (prompt.length > 0) {
      prompt =
        `You are in a worldbuilding context. Write a new ${part}.` + prompt;
      prompt =
        prompt +
        " Output only the results and no commentary. Be brief, no more than 3 sentences.";
      console.log("The prompt is " + prompt);
      askChatGPT(prompt);
    }
    /*
    prompt = globalContentString;
    prompt = "What is 2 + 2?";
    askChatGPT(prompt);*/
  };

  function askChatGPT(question) {
    var id = "eangjmcicbgopnnccclhhafapkckfjlk";
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

  function downloadJsonFile(jsonData) {
    const jsonString = JSON.stringify(jsonData);
    const dataUri = `data:text/json;charset=utf-8,${encodeURIComponent(
      jsonString
    )}`;
    const downloadLink = document.createElement("a");
    downloadLink.setAttribute("href", dataUri);
    downloadLink.setAttribute("download", "data.json");
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  }

  const onSave = useCallback(() => {
    console.log("Saving the flow");
    if (rfInstance) {
      const flow = rfInstance.toObject();
      downloadJsonFile(flow);
      // localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  // create the function to add a node
  const addNode = useCallback(() => {
    // it has to be a custom node

    const nodeId = (nodes.length + 1).toString();
    const newNode = {
      id: nodeId,
      position: { x: 100, y: 100 },
      data: { label: `Node ${nodeId}` },
    };
    setNodes((prevNodes) => [...prevNodes, newNode]);
  }, [nodes, setNodes]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      console.log("The event keycode is");
      console.log(event.keyCode);
      // q and w save and load
      // 81 -
      // 87 -
      if (event.keyCode == 222) {
        // onSave();
        saveButtonRef.current.click();
      } else if (event.keyCode == 187) {

        toPng(document.querySelector('.react-flow'), {
          filter: (node) => {
            // we don't want to add the minimap and the controls to the image
            if (
              node?.classList?.contains('react-flow__minimap') ||
              node?.classList?.contains('react-flow__controls')
            ) {
              return false;
            }
    
            return true;
          },
        }).then(downloadImage);

      }
      else if (event.keyCode == 220) {
        fileInputRef.current.click();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        onInit={setRfInstance}
      >
        <Controls />
        <MiniMap />
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>

      <div
        style={{
          position: "absolute",
          right: "10px",
          top: "10px",
          width: "200px",
          gap: "0.5em",
        }}
        className="flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-md p-4"
      >
        {/* <label
          for="parts"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Select an option
        </label> */}
        <select
          id="parts"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={selectedValue}
          onChange={handleChange}
        >
          <option value="Character">Character</option>
          <option value="Global">Global</option>
          <option value="Plot">Plot</option>
          <option value="Location">Location</option>
        </select>

        <button
          id="generateBtn"
          className="bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow-xl"
          onClick={() => generate()}
        >
          Generate
        </button>

        <button
          id="saveBtn"
          ref={saveButtonRef}
          className="hidden bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 focus:ring-opacity-50 text-white font-bold py-2 px-4 rounded-lg shadow-xl"
          onClick={() => onSave()}
        >
          Save
        </button>

        <input
          id="fileInput"
          type="file"
          ref={fileInputRef}
          onChange={handleFileInput}
          className="hidden py-2 px-4 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:border-blue-500 focus:ring-blue-500 focus:ring-offset-2 focus:ring-2"
        />
      </div>
    </div>
  );
}
