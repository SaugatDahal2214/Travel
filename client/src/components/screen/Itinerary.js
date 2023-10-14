import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const Itinerary = () => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [reloadPage, setReloadPage] = useState(false); // New state variable

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      Navigate("/username")(); // Corrected navigation
    }

    // Fetch the list of items from the backend when the component mounts
    fetch("http://localhost:8080/api/items", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => setItems(data));
  }, [reloadPage]); // Trigger effect when reloadPage state changes

  const addItem = () => {
    if (newItem.trim() !== "") {
      // Send a POST request to add a new item
      fetch("http://localhost:8080/api/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ newItem }),
      })
        .then((response) => response.json())
        .then(() => {
          // Set the reloadPage state to true to trigger a page reload
          setReloadPage(true);
          setNewItem("");
        })
        .catch((error) => {
          console.error("Error adding item:", error);
        });
    }
  };

  const deleteItem = (itemId) => {
    // Send a DELETE request to delete an item
    fetch("http://localhost:8080/api/deleteItem", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({ checkbox: itemId }),
    }).then(() => {
      // Set the reloadPage state to true to trigger a page reload
      setReloadPage(true);
    });
  };

  useEffect(() => {
    if (reloadPage) {
      // Reload the page when reloadPage state changes
      window.location.reload();
    }
  }, [reloadPage]);

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Plan your Trip
      </h1>
      <div className="flex mb-4">
        <input
          type="text"
          placeholder="Add new item"
          className="flex-grow px-4 py-2 rounded-l-lg border border-gray-300 focus:outline-none"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <button
          onClick={addItem}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-r-lg focus:outline-none"
        >
          Add
        </button>
      </div>
      {items && items.length > 0 ? (
        <ul>
          {items.map((item) => (
            <li
              key={item._id}
              className="flex items-center justify-between border-b border-gray-300 py-2"
            >
              <span className="text-lg">{item.name}</span>
              <button
                onClick={() => deleteItem(item._id)}
                className="text-red-600 hover:text-red-800 focus:outline-none"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 mt-4">No items to display.</p>
      )}
    </div>
  );
};

export default Itinerary;
