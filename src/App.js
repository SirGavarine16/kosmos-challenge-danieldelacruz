import React, { useState, useEffect } from "react";

import { Component } from './components';

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);

  const [images, setImages] = useState([])

  const getImages = () => {
    fetch("https://jsonplaceholder.typicode.com/photos")
      .then((response) => response.json())
      .then((fetchedImages) => setImages(fetchedImages));
  }

  useEffect(() => {
    getImages();
  }, []);

  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    const COLORS = ["red", "blue", "yellow", "green", "purple"];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        updateEnd: true,
      },
    ]);
  };

  const deleteMoveable = () => {
    setMoveableComponents(moveableComponents.filter(c => c.id !== selected));
    setSelected(null);
  }

  const updateMoveable = (id, newComponent, updateEnd = false) => {
    let parent = document.getElementById("parent");
    let parentBounds = parent?.getBoundingClientRect();

    if (newComponent.top <= 0) {
      newComponent.top = 0;
    }
    if (newComponent.left <= 0) {
      newComponent.left = 0;
    }
    if ((newComponent.left + newComponent.width) >= parentBounds.width) {
      newComponent.left = parentBounds.width - newComponent.width;
    }
    if ((newComponent.top + newComponent.height) >= parentBounds.height) {
      newComponent.top = parentBounds.height - newComponent.height;
    }

    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main style={{ height: "100vh", width: "100vw", display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
      <div style={{ display: 'flex' }}>
        <button onClick={addMoveable} style={{ marginRight: '0.5rem' }}>
          Add Moveable
        </button>
        <button disabled={selected===null} style={{ marginLeft: '0.5rem' }} onClick={deleteMoveable}>
          Delete selected Moveable
        </button>
      </div>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "black",
          height: "80vh",
          width: "80vw",
          marginTop: '1rem'
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            img={images[index]}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={(e) => handleResizeStart(index, e)}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
    </main>
  );
};

export default App;