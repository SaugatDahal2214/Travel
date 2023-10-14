import Item from '../model/Itineraray.model.js'
// Get items
export async function getItem(req, res) {
    try {
      const foundItems = await Item.find({});
      if (foundItems.length === 0) {
        // Define an array of default items
        const defaultItems = [
          { name: "Get you essentials ready" },
          // Add more default items as needed
        ];
  
        // Insert default items into the database
        await Item.insertMany(defaultItems);
  
        // Respond with the default items
        res.json(defaultItems);
      } else {
        res.json(foundItems);
      }
    } catch (err) {
      console.error("Error!", err);
      res.status(500).json({ error: "An error occurred" });
    }
  }
  

// Create a new item
export async function postItem(req, res) {
  try {
    const itemName = req.body.newItem;

    const item = new Item({
      name: itemName
    });

    await item.save();
    res.json({ message: "Item created successfully" });
  } catch (err) {
    console.error("Error!", err);
    res.status(500).json({ error: "An error occurred" });
  }
}

// Delete an item
export async function deleteItem(req, res) {
  try {
    const checkedItemId = req.body.checkbox;

    await Item.findByIdAndDelete(checkedItemId);
    res.json({ message: "Item deleted successfully" });
  } catch (err) {
    console.error("Error!", err);
    res.status(500).json({ error: "An error occurred" });
  }
}
