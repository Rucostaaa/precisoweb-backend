import User from '../models/UserModel.js';

export const toogleAvailability = async (req, res) => {
  try {
    // Get the authenticated user (driver)
    const driver = await User.findById(req.user.id);  // Assuming req.user.id is set by the auth middleware
    
    if (!driver) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Toggle the availability status
    driver.available = !driver.available;

    // Save the updated driver
    await driver.save();

    // Respond with the updated availability status
    res.status(200).json({ available: driver.available });
  } catch (error) {
    console.error("Error toggling availability:", error);
    res.status(500).json({ message: 'Server error' });
  }
};
import Order from '../models/OrderModel.js';

export const getSingleOrder = async (req, res) => {
  try {
    const orderId = req.params.id;  // Get the order ID from the request parameters

    // Find the order by ID
    const order = await Order.findById(orderId).populate('user');  // Populating user details, adjust if needed

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Return the found order
    res.status(200).json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateOrder = async (req, res) => {
    console.log("updating Order");
    
    try {
      const orderId = req.params.id;  // Get the order ID from the request parameters
      const updatedData = req.body;   // Data to update in the order
        console.log(updatedData);

      // Find the order by ID and update it with the provided data
      const order = await Order.findByIdAndUpdate(orderId, updatedData, { new: true });
      console.log("order",order,orderId);

      if (!order) {
        return res.status(404).json({ message: 'Order not found' });
      }
  
      // Return the updated order
      res.status(200).json(order);
    } catch (error) {
      console.error('Error updating order:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };
  export const updateRoute = async (req, res) => {
      console.log("Updating Route with data:", JSON.stringify(req.body, null, 2));
      
      try {
          const orderId = req.params.id;  // Get the order ID from the request parameters
          const updatedData = req.body;   // Data to update in the order
  
          if (!updatedData || (!updatedData.pickup?.route && !updatedData.destination?.route)) {
              return res.status(400).json({ message: 'No route data provided' });
          }
  
          // Ensure `pickup.route` and `destination.route` are properly parsed as arrays
          ['pickup', 'destination'].forEach((key) => {
              if (updatedData[key]?.route && typeof updatedData[key].route === "string") {
                  try {
                      updatedData[key].route = JSON.parse(updatedData[key].route);
                      if (!Array.isArray(updatedData[key].route)) {
                          throw new Error("Parsed route is not an array");
                      }
                  } catch (error) {
                      console.error(`Error parsing ${key} route JSON:`, error);
                      return res.status(400).json({ message: `Invalid ${key} route format` });
                  }
              }
          });
  
          console.log("Processed route data:", updatedData);
  
          // Create update object dynamically based on provided data
          let updateFields = {};
          if (updatedData.pickup?.route) updateFields["pickup.route"] = updatedData.pickup.route;
          if (updatedData.destination?.route) updateFields["destination.route"] = updatedData.destination.route;
  
          // Find the order by ID and update only the specified route fields
          const order = await Order.findByIdAndUpdate(orderId, updateFields, { new: true });
  
          if (!order) {
              return res.status(404).json({ message: 'Order not found' });
          }
      
          console.log("Updated Order Route:", order);
      
          // Return the updated order
          res.status(200).json(order);
      } catch (error) {
          console.error('Error updating route:', error);
          res.status(500).json({ message: 'Server error' });
      }
  };// Controller to update the user's location
  export const updateLocation = async (req, res) => {
    const userId = req.user._id;
    const coords  = req.body; // Get the new longitude and latitude from the request body
 
  
    // Validate the coordinates
    if (!coords || !coords[0] || !coords[1]) {
      return res.status(400).json({ message: "Longitude and latitude are required." });
    }
  
    const [longitude, latitude] = coords; // Destructure the longitude and latitude from coords
    try {
      // Find the user and update their location
      const user = await User.findByIdAndUpdate(
        userId,
        {
          $set: {
            location: {
              type: "Point", // Specify the point type
              coordinates: [longitude, latitude], // Set the coordinates as an array [longitude, latitude]
            },
          },
        },
        { new: true } // Return the updated user document
      );
      
  
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      return res.status(200).json({ message: "Location updated successfully.", user });
    } catch (error) {
      console.error("Error updating location:", error);
      return res.status(500).json({ message: "Server error." });
    }
  };
  