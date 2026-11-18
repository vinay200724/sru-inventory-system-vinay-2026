import { useEffect, useState } from "react";
import Login from "./login";
import Register from "./Register";

type InventoryItem = {
  id: number;
  product_name: string;
  quantity: number;
  status: string;
};

type AssetItem = {
  id: number;
  asset_id: string;
  asset_name: string;
  location: string;
  status: string;
};

type Room = {
  id: number;
  block_no: number;
  floor_name: string;
  room_no: number;
  room_code: string;
  room_type: string;
};

type RoomAsset = {
  id: number;
  room_id: number;
  asset_code: string;
  asset_name: string;
  category: string;
  quantity: number;
  status: string;
};
type AssetSearchResult = {
  id: number;
  asset_code: string;
  asset_name: string;
  category: string;
  quantity: number;
  status: string;
  block_no: number;
  floor_name: string;
  room_no: number;
  room_code: string;
  room_type: string;
};


type RoomAssetReportItem = {
  id: number;
  asset_code: string;
  block_no: number;
  floor_name: string;
  room_no: number;
  room_code: string;
  room_type: string;
  asset_name: string;
  quantity: number;
  status: string;
};

type LoggedInUser = {
  user_id: number;
  name: string;
  email: string;
  role: "admin" | "viewer";
  access_token: string;
};

type AIPredictionItem = {
  id: number;
  product_name: string;
  quantity: number;
  status: string;
  prediction: string;
  recommendation: string;
};

type FeedbackItem = {
  id: number;
  student_id: number;
  student_name: string;
  message: string;
  created_at: string;
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [activePage, setActivePage] = useState("Dashboard");
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);

  const isAdmin = currentUser?.role === "admin";

  const authHeaders = (): Record<string, string> => {
  if (!currentUser?.access_token) {
    return {};
  }

  return {
    Authorization: `Bearer ${currentUser.access_token}`
  };
};

  const [inventory, setInventory] =
    useState<InventoryItem[]>([]);

  const [assets, setAssets] =
    useState<AssetItem[]>([]);

  const [rooms, setRooms] =
    useState<Room[]>([]);

  const [roomAssets, setRoomAssets] =
    useState<RoomAsset[]>([]);

  const [roomAssetReport, setRoomAssetReport] =
    useState<RoomAssetReportItem[]>([]);

  const [aiPredictions, setAiPredictions] =
    useState<AIPredictionItem[]>([]);

  const [aiPredictionLoading, setAiPredictionLoading] =
    useState(false);

  const [productName, setProductName] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  const [assetId, setAssetId] =
    useState("");

  const [assetName, setAssetName] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [assetStatus, setAssetStatus] =
    useState("Available");

  const [selectedRoomId, setSelectedRoomId] =
    useState<number | null>(null);

  const [roomAssetDestinationId, setRoomAssetDestinationId] =
    useState<number | null>(null);

  const [roomAssetName, setRoomAssetName] =
    useState("");

  const [roomAssetCategory, setRoomAssetCategory] =
    useState("");

  const [roomAssetQuantity, setRoomAssetQuantity] =
    useState("");

  const [roomAssetStatus, setRoomAssetStatus] =
    useState("Working");

  const [search, setSearch] =
    useState("");

  const [assetSearch, setAssetSearch] =
    useState("");

  const [roomSearch, setRoomSearch] =
    useState("");

  const [reportAssetSearch, setReportAssetSearch] =
    useState("");

  const [roomAssetSearch, setRoomAssetSearch] =
    useState("");

  const [roomAssetReportSearch, setRoomAssetReportSearch] =
    useState("");

  const [editingInventoryId, setEditingInventoryId] =
    useState<number | null>(null);

  const [editingAssetId, setEditingAssetId] =
    useState<string | null>(null);

  const [editingRoomAssetId, setEditingRoomAssetId] =
    useState<number | null>(null);

  const [assetSearchCode, setAssetSearchCode] = useState("");
const [assetSearchResult, setAssetSearchResult] =
  useState<AssetSearchResult[]>([]);
const [assetSearchMessage, setAssetSearchMessage] = useState("");
const [assetSearchLoading, setAssetSearchLoading] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [feedbackError, setFeedbackError] = useState("");

  /* =========================
     LOAD INVENTORY
     ========================= */

  const loadInventory = async () => {
    try {
      const response = await fetch(
        "https://sru-inventory-system-vinay-2026.onrender.com"
      );
      const data = await response.json();

      setInventory(data);
    } catch (error) {
      console.log(error);
    }
  };
  

  /* =========================
     GLOBAL ASSET SEARCH
     ========================= */

const searchAsset = async () => {
  const searchText = assetSearchCode.trim();

  if (!searchText) {
    setAssetSearchMessage("Please enter an Asset ID or Asset Name");
    setAssetSearchResult([]);
    return;
  }

  setAssetSearchLoading(true);
  setAssetSearchMessage("");
  setAssetSearchResult([]);

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/search-assets?search=${encodeURIComponent(
        searchText
      )}`
    );

    const data = await response.json();

    if (!response.ok || !Array.isArray(data) || data.length === 0) {
      setAssetSearchMessage("Asset not found");
      setAssetSearchResult([]);
      return;
    }

    setAssetSearchResult(data);
    setAssetSearchMessage("");
  } catch (error) {
    console.error("Asset search error:", error);

    setAssetSearchMessage(
      "Unable to search asset. Please check the backend."
    );

    setAssetSearchResult([]);
  } finally {
    setAssetSearchLoading(false);
  }
};

  /* =========================
     LOAD ASSETS
     ========================= */

  const loadAssets = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/assets"
      );

      const data = await response.json();

      setAssets(data);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     LOAD ROOMS
     ========================= */

  const loadRooms = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/rooms"
      );

      const data = await response.json();

      setRooms(data);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     LOAD ROOM ASSETS
     ========================= */

  const loadRoomAssets = async (
    roomId: number
  ) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/rooms/${roomId}/assets`
      );

      const data = await response.json();

      setRoomAssets(data);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     LOAD ROOM ASSET REPORT
     ========================= */

  const loadRoomAssetReport = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/room-assets-report"
      );

      const data = await response.json();

      setRoomAssetReport(data);
    } catch (error) {
      console.log(error);
    }
  };

  /* =========================
     LOAD AI PREDICTIONS
     ========================= */

  const loadAIPredictions = async () => {
    try {
      setAiPredictionLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/ai-prediction"
      );

      if (!response.ok) {
        throw new Error("Unable to load AI predictions");
      }

      const data = await response.json();
      setAiPredictions(data);
    } catch (error) {
      console.log(error);
      setAiPredictions([]);
    } finally {
      setAiPredictionLoading(false);
    }
  };

  /* =========================
     FEEDBACK
     ========================= */

  const loadFeedback = async () => {
    if (!currentUser?.access_token) return;

    setFeedbackLoading(true);
    setFeedbackError("");

    try {
      const endpoint = isAdmin ? "/feedback" : "/my-feedback";
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        headers: { ...authHeaders() }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Unable to load feedback");
      }
      setFeedbackItems(Array.isArray(data) ? data : []);
    } catch (error) {
      setFeedbackError(error instanceof Error ? error.message : "Unable to load feedback");
      setFeedbackItems([]);
    } finally {
      setFeedbackLoading(false);
    }
  };

  const submitFeedback = async () => {
    const message = feedbackMessage.trim();
    if (!message) {
      alert("Please enter your feedback");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders()
        },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Unable to submit feedback");
      }
      setFeedbackMessage("");
      alert("Feedback submitted successfully");
      await loadFeedback();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to submit feedback");
    }
  };

  useEffect(() => {
    if (loggedIn && activePage === "Feedback") {
      loadFeedback();
    }
  }, [loggedIn, activePage, currentUser]);

  /* =========================
     LOAD DATA
     ========================= */

  useEffect(() => {
    if (loggedIn) {
      loadInventory();
      loadAssets();
      loadRooms();
      loadRoomAssetReport();
      loadAIPredictions();
    }
  }, [loggedIn]);

  /* =========================
     ROOM DISPLAY NAME
     ========================= */

  const getRoomDisplayName = (
    room: Room
  ) => {
    if (
      room.room_type ===
      "Library - Whole Ground Floor"
    ) {
      return "Library";
    }

    return `Room ${room.room_code}`;
  };

  /* =========================
     ROOM TYPE COUNTS
     ========================= */

  const totalLabs = rooms.filter(
    (room) =>
      room.room_type === "Lab"
  ).length;

  const totalClassrooms = rooms.filter(
    (room) =>
      room.room_type === "Class Room"
  ).length;

  const totalStaffRooms = rooms.filter(
    (room) =>
      room.room_type === "Staff Room"
  ).length;

  const totalOfficeRooms = rooms.filter(
    (room) =>
      room.room_type === "Office Room"
  ).length;

  const totalLibraries = rooms.filter(
    (room) =>
      room.room_type ===
      "Library - Whole Ground Floor"
  ).length;

  /* =========================
     BLOCK NUMBERS
     ========================= */

  const blockNumbers = [
    ...new Set(
      rooms.map(
        (room) => room.block_no
      )
    )
  ].sort(
    (a, b) => a - b
  );

  /* =========================
     FLOOR NAMES
     ========================= */

  const floorNames = [
    "Ground Floor",
    "First Floor",
    "Second Floor"
  ];

  /* =========================
     ROOM TYPES
     ========================= */

  const roomTypes = [
    "Lab",
    "Class Room",
    "Staff Room",
    "Office Room",
    "Library"
  ];

  /* =========================
     INVENTORY STATUS
     ========================= */

  const getInventoryStatus = (
    qty: number
  ) => {
    if (qty === 0) {
      return "Out of Stock";
    }

    if (qty <= 5) {
      return "Low Stock";
    }

    return "Available";
  };

  /* =========================
     INVENTORY STATUS COLOR
     ========================= */

  const getInventoryStatusStyle = (
    status: string
  ) => {
    if (
      status === "Out of Stock"
    ) {
      return {
        color: "#dc2626",
        fontWeight: "bold"
      };
    }

    if (
      status === "Low Stock"
    ) {
      return {
        color: "#f59e0b",
        fontWeight: "bold"
      };
    }

    return {
      color: "#16a34a",
      fontWeight: "bold"
    };
  };

  /* =========================
     INVENTORY QUANTITY COLOR
     ========================= */

  const getInventoryQuantityStyle = (
    qty: number
  ) => {
    if (qty === 0) {
      return {
        color: "#dc2626",
        fontWeight: "bold"
      };
    }

    if (qty <= 5) {
      return {
        color: "#f59e0b",
        fontWeight: "bold"
      };
    }

    return {};
  };

  /* =========================
     SAVE INVENTORY
     ========================= */

  const saveInventory = async () => {
    if (!productName.trim()) {
      alert(
        "Product name is required"
      );
      return;
    }

    if (quantity === "") {
      alert("Quantity is required");
      return;
    }

    const qty = Number(quantity);

    if (qty < 0) {
      alert(
        "Quantity cannot be negative"
      );
      return;
    }

    const automaticStatus =
      getInventoryStatus(qty);

    try {
      if (
        editingInventoryId !== null
      ) {
        await fetch(
          `http://127.0.0.1:8000/inventory/${editingInventoryId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type":
                "application/json",
              ...authHeaders()
            },
            body: JSON.stringify({
              product_name:
                productName,
              quantity: qty,
              status:
                automaticStatus
            })
          }
        );

        alert(
          "Inventory updated successfully"
        );
      } else {
        await fetch(
          "http://127.0.0.1:8000/inventory",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
              ...authHeaders()
            },
            body: JSON.stringify({
              product_name:
                productName,
              quantity: qty,
              status:
                automaticStatus
            })
          }
        );

        alert(
          "Inventory added successfully"
        );
      }

      clearInventoryForm();
      loadInventory();
    } catch (error) {
      console.log(error);
      alert(
        "Unable to connect to server"
      );
    }
  };

  /* =========================
     EDIT INVENTORY
     ========================= */

  const editInventory = (
    item: InventoryItem
  ) => {
    setEditingInventoryId(
      item.id
    );

    setProductName(
      item.product_name
    );

    setQuantity(
      String(item.quantity)
    );
  };

  /* =========================
     DELETE INVENTORY
     ========================= */

  const deleteInventory = async (id: number) => {
    if (!confirm("Are you sure you want to delete this inventory item?")) return;

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/inventory/${id}`,
        {
          method: "DELETE",
          headers: { ...authHeaders() }
        }
      );

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        alert(data.detail || data.message || "Unable to delete inventory item");
        return;
      }

      alert(data.message || "Inventory item deleted successfully");
      await loadInventory();
    } catch (error) {
      console.error("Inventory delete error:", error);
      alert("Unable to connect to server");
    }
  };

  /* =========================
     CLEAR INVENTORY
     ========================= */

  const clearInventoryForm = () => {
    setProductName("");
    setQuantity("");
    setEditingInventoryId(
      null
    );
  };

  /* =========================
     SAVE ASSET
     ========================= */

 
const saveAsset = async () => {
  if (!assetId.trim()) {
    alert("Asset ID is required");
    return;
  }

  if (!assetName.trim()) {
    alert("Asset name is required");
    return;
  }

  if (!location.trim()) {
    alert("Location is required");
    return;
  }

  try {
    let response;

    if (editingAssetId !== null) {
      response = await fetch(
        `http://127.0.0.1:8000/assets/${editingAssetId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders()
          },
          body: JSON.stringify({
            asset_name: assetName,
            location: location,
            status: assetStatus
          })
        }
      );
    } else {
      response = await fetch(
        "http://127.0.0.1:8000/assets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders()
          },
          body: JSON.stringify({
            asset_id: assetId,
            asset_name: assetName,
            location: location,
            status: assetStatus
          })
        }
      );
    }

    if (!response.ok) {
      const errorData = await response.json();
      alert(
        errorData.detail || "Unable to save asset"
      );
      return;
    }

    alert(
      editingAssetId !== null
        ? "Asset updated successfully"
        : "Asset added successfully"
    );

    clearAssetForm();
    loadAssets();

  } catch (error) {
    console.log(error);
    alert("Unable to connect to server");
  }
};

/* =========================
   EDIT ASSET
   ========================= */

const editAsset = (asset: AssetItem) => {
  setEditingAssetId(asset.asset_id);
  setAssetId(asset.asset_id);
  setAssetName(asset.asset_name);
  setLocation(asset.location);
  setAssetStatus(asset.status);
};


  /* =========================
     DELETE ASSET
     ========================= */

const deleteAsset = async (id: string) => {
  if (!confirm("Are you sure you want to delete this asset?")) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/assets/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
        headers: { ...authHeaders() }
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(data.detail || data.message || "Unable to delete asset");
      return;
    }

    alert(data.message || "Asset deleted successfully");
    await loadAssets();
  } catch (error) {
    console.error("Asset delete error:", error);
    alert("Unable to connect to server");
  }
};

  /* =========================
     CLEAR ASSET
     ========================= */

  const clearAssetForm = () => {
    setAssetId("");
    setAssetName("");
    setLocation("");
    setAssetStatus(
      "Available"
    );
    setEditingAssetId(
      null
    );
  };

  /* =========================
     SELECT ROOM
     ========================= */

  const selectRoom = (
    roomId: number
  ) => {
    setSelectedRoomId(
      roomId
    );

    setEditingRoomAssetId(
      null
    );

    setRoomAssetSearch("");

    clearRoomAssetForm();

    loadRoomAssets(
      roomId
    );
  };

  /* =========================
     SAVE ROOM ASSET
     ========================= */

  
const saveRoomAsset = async () => {
  if (selectedRoomId === null) {
    alert("Please select a room");
    return;
  }

  if (!roomAssetName.trim()) {
    alert("Asset name is required");
    return;
  }

  if (!roomAssetCategory.trim()) {
    alert("Asset category is required");
    return;
  }

  if (roomAssetQuantity === "") {
    alert("Quantity is required");
    return;
  }

  const qty = Number(roomAssetQuantity);
  if (!Number.isInteger(qty) || qty < 0) {
    alert("Enter a valid non-negative quantity");
    return;
  }

  const destinationRoomId =
    editingRoomAssetId !== null
      ? roomAssetDestinationId
      : selectedRoomId;

  if (destinationRoomId === null) {
    alert("Please select a destination room");
    return;
  }

  try {
    let response: Response;

    if (editingRoomAssetId !== null) {
      response = await fetch(
        `http://127.0.0.1:8000/room-assets/${editingRoomAssetId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders()
          },
          body: JSON.stringify({
            room_id: destinationRoomId,
            asset_name: roomAssetName.trim(),
            category: roomAssetCategory.trim(),
            quantity: qty,
            status: roomAssetStatus
          })
        }
      );
    } else {
      response = await fetch(
        "http://127.0.0.1:8000/room-assets",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...authHeaders()
          },
          body: JSON.stringify({
            room_id: selectedRoomId,
            asset_name: roomAssetName.trim(),
            category: roomAssetCategory.trim(),
            quantity: qty,
            status: roomAssetStatus
          })
        }
      );
    }

    const responseData = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(
        responseData.detail ||
        responseData.message ||
        "Unable to save room asset"
      );
      return;
    }

    const wasMovingAsset = editingRoomAssetId !== null;
    clearRoomAssetForm();

    if (wasMovingAsset) {
      setSelectedRoomId(destinationRoomId);
      await loadRoomAssets(destinationRoomId);
      alert("Room asset updated and moved to the selected room successfully");
    } else {
      await loadRoomAssets(selectedRoomId);
      alert("Room asset added successfully");
    }

    await loadRoomAssetReport();
  } catch (error) {
    console.error("Room asset save error:", error);
    alert("Unable to connect to server");
  }
};


  /* =========================
     EDIT ROOM ASSET
     ========================= */

  
const editRoomAsset = (asset: RoomAsset) => {
  setEditingRoomAssetId(asset.id);
  setRoomAssetName(asset.asset_name);
  setRoomAssetCategory(asset.category || "General");
  setRoomAssetQuantity(String(asset.quantity));
  const normalizedStatus =
    asset.status === "Good" ? "Working" :
    asset.status === "Needs Repair" ? "Repair" :
    asset.status === "Damaged" || asset.status === "Not Available"
      ? "Not Working"
      : asset.status || "Working";

  setRoomAssetStatus(normalizedStatus);
  setRoomAssetDestinationId(asset.room_id);
};


  /* =========================
     DELETE ROOM ASSET
     ========================= */

const deleteRoomAsset = async (id: number) => {
  if (!confirm("Are you sure you want to delete this room asset?")) return;

  try {
    const response = await fetch(
      `http://127.0.0.1:8000/room-assets/${id}`,
      {
        method: "DELETE",
        headers: { ...authHeaders() }
      }
    );

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      alert(data.detail || data.message || "Unable to delete room asset");
      return;
    }

    alert(data.message || "Room asset deleted successfully");

    if (selectedRoomId !== null) {
      await loadRoomAssets(selectedRoomId);
    }
    await loadRoomAssetReport();
  } catch (error) {
    console.error("Room asset delete error:", error);
    alert("Unable to connect to server");
  }
};

  /* =========================
     CLEAR ROOM ASSET
     ========================= */

  const clearRoomAssetForm = () => {
    setRoomAssetName("");
    setRoomAssetCategory("");
    setRoomAssetQuantity("");
    setRoomAssetStatus("Working");
    setRoomAssetDestinationId(null);
    setEditingRoomAssetId(null);
  };

  /* =========================
     SEARCH FILTERS
     ========================= */

  const filteredInventory =
    inventory.filter(
      (item) => {
        const text =
          `${item.product_name} ${item.quantity} ${item.status}`
            .toLowerCase();

        return text.includes(
          search.toLowerCase()
        );
      }
    );

  const filteredAssets =
    assets.filter(
      (asset) => {
        const text =
          `${asset.asset_id} ${asset.asset_name} ${asset.location} ${asset.status}`
            .toLowerCase();

        return text.includes(
          assetSearch.toLowerCase()
        );
      }
    );

  const filteredRooms =
    rooms.filter(
      (room) => {
        const text =
          `Block ${room.block_no} ${room.floor_name} ${getRoomDisplayName(room)} ${room.room_type}`
            .toLowerCase();

        return text.includes(
          roomSearch.toLowerCase()
        );
      }
    );

  const filteredRoomAssets =
    roomAssets.filter(
      (asset) => {
        const text =
          `${asset.asset_name} ${asset.quantity} ${asset.status}`
            .toLowerCase();

        return text.includes(
          roomAssetSearch.toLowerCase()
        );
      }
    );

  const filteredReportAssets =
    assets.filter(
      (asset) => {
        const text =
          `${asset.asset_id} ${asset.asset_name} ${asset.location} ${asset.status}`
            .toLowerCase();

        return text.includes(
          reportAssetSearch.toLowerCase()
        );
      }
    );

  const filteredRoomAssetReport =
    roomAssetReport.filter(
      (item) => {
        const text =
          `SRU-${item.asset_code} Block ${item.block_no} ${item.floor_name} ${item.room_no} ${item.room_code} ${item.room_type} ${item.asset_name} ${item.quantity} ${item.status}`
            .toLowerCase();

        return text.includes(
          roomAssetReportSearch.toLowerCase()
        );
      }
    );

  /* =========================
     SELECTED ROOM
     ========================= */

  const selectedRoom =
    rooms.find(
      (room) =>
        room.id ===
        selectedRoomId
    );

  /* =========================
     DASHBOARD DATA
     ========================= */

  const totalQuantity =
    inventory.reduce(
      (total, item) =>
        total +
        item.quantity,
      0
    );

  const availableProducts =
    inventory.filter(
      (item) =>
        item.quantity > 5
    ).length;

  const lowStockItems =
    inventory.filter(
      (item) =>
        item.quantity > 0 &&
        item.quantity <= 5
    );

  const outOfStockProducts =
    inventory.filter(
      (item) =>
        item.quantity === 0
    );

  const maintenanceAssets =
    assets.filter(
      (asset) =>
        asset.status ===
        "Maintenance"
    );

  const assignedAssets =
    assets.filter(
      (asset) =>
        asset.status ===
        "Assigned"
    ).length;

  const availableAssets =
    assets.filter(
      (asset) =>
        asset.status ===
        "Available"
    ).length;

  const totalRoomAssetQuantity =
    roomAssets.reduce(
      (total, asset) =>
        total +
        asset.quantity,
      0
    );

  /* =========================
     LOGIN
     ========================= */

  if (
    !loggedIn &&
    !showRegister
  ) {
    return (
      <Login
        onLogin={(user) => {
          setCurrentUser(user);
          setLoggedIn(true);
          setActivePage(
            "Dashboard"
          );
        }}
        onRegister={() => {
          setShowRegister(
            true
          );
        }}
      />
    );
  }

  /* =========================
     REGISTER
     ========================= */

  if (
    !loggedIn &&
    showRegister
  ) {
    return (
      <Register
        onRegister={() => {
          setShowRegister(
            false
          );
        }}
        onBackToLogin={() => {
          setShowRegister(
            false
          );
        }}
      />
    );
  }

  /* =========================
     MAIN APP
     ========================= */

  return (
    <div className="app">

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap');

        .app {
          min-height: 100vh;
          background: #f3f6fb;
          color: #17243b;
          font-family: 'DM Sans', 'Segoe UI', sans-serif;
        }
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 16px;
          padding: 15px clamp(18px, 4vw, 54px);
          background: linear-gradient(110deg, #102b50 0%, #174b72 58%, #087e8b 100%);
          color: #fff;
          box-shadow: 0 8px 28px rgba(15, 42, 75, .18);
          border-bottom: 1px solid rgba(255,255,255,.15);
        }
        .logo {
          color: #fff;
          font-family: 'Manrope', sans-serif;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -.5px;
          white-space: nowrap;
        }
        .navbar > div[style*="margin-left"] {
          margin-left: auto !important;
          margin-right: 4px !important;
          padding: 8px 13px;
          border: 1px solid rgba(255,255,255,.22);
          border-radius: 999px;
          background: rgba(255,255,255,.12);
          color: #fff;
          font-size: 13px;
        }
        .nav-links {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 7px;
        }
        .nav-links button {
          border: 1px solid transparent;
          border-radius: 10px;
          padding: 9px 13px;
          background: transparent;
          color: rgba(255,255,255,.88);
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s ease;
        }
        .nav-links button:hover, .nav-links button.active-nav {
          background: rgba(255,255,255,.17);
          border-color: rgba(255,255,255,.22);
          color: #fff;
          transform: translateY(-1px);
        }
        .container {
          width: min(1440px, calc(100% - 44px));
          margin: 0 auto;
          padding: 34px 0 56px;
        }
        .container > h1 {
          margin: 0 0 8px;
          color: #142b4b;
          font-family: 'Manrope', sans-serif;
          font-size: clamp(27px, 3vw, 36px);
          font-weight: 800;
          letter-spacing: -1.1px;
        }
        .welcome-text {
          margin: 8px 0 4px;
          color: #38516f;
          font-size: 17px;
          font-weight: 600;
        }
        .subtitle {
          margin: 8px 0 25px;
          color: #718096;
          font-size: 14px;
          line-height: 1.7;
        }
        .section, .form-section {
          margin: 22px 0;
          padding: clamp(18px, 2.4vw, 27px);
          border: 1px solid #e3eaf3;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 8px 26px rgba(31, 55, 86, .055);
        }
        .section h2, .form-section h2 {
          margin: 0 0 17px;
          color: #183653;
          font-family: 'Manrope', sans-serif;
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -.35px;
        }
        .section h3, .form-section h3 {
          color: #244663;
          font-family: 'Manrope', sans-serif;
          font-weight: 700;
        }
        .cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(185px, 1fr));
          gap: 17px;
          margin: 22px 0;
        }
        .card {
          position: relative;
          overflow: hidden;
          min-height: 132px;
          padding: 21px 22px;
          border: 1px solid #e1eaf3;
          border-radius: 17px;
          background: linear-gradient(145deg, #fff 0%, #f8fbff 100%);
          box-shadow: 0 7px 22px rgba(25, 55, 88, .06);
          transition: transform .2s ease, box-shadow .2s ease;
        }
        .card::after {
          content: "";
          position: absolute;
          width: 78px;
          height: 78px;
          right: -22px;
          top: -25px;
          border-radius: 50%;
          background: rgba(14, 151, 163, .08);
        }
        .card:hover {
          transform: translateY(-4px);
          box-shadow: 0 13px 28px rgba(25, 55, 88, .11);
        }
        .card h3 {
          position: relative;
          z-index: 1;
          margin: 0 0 10px;
          color: #64758b;
          font-size: 13px;
          font-weight: 700;
        }
        .card h2 {
          position: relative;
          z-index: 1;
          margin: 0;
          color: #087f8c;
          font-family: 'Manrope', sans-serif;
          font-size: 31px;
          font-weight: 800;
          letter-spacing: -.8px;
        }
        .card p {
          position: relative;
          z-index: 1;
          margin: 7px 0 0;
          color: #8795a8;
          font-size: 12px;
        }
        .app button {
          border: 0;
          border-radius: 10px;
          padding: 10px 16px;
          background: linear-gradient(110deg, #087f8c, #126b91);
          color: #fff;
          font-family: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(8, 127, 140, .13);
          transition: transform .18s ease, box-shadow .18s ease, filter .18s ease;
        }
        .app button:hover {
          transform: translateY(-1px);
          filter: brightness(1.04);
          box-shadow: 0 7px 15px rgba(8, 127, 140, .2);
        }
        .app button:disabled {
          opacity: .55;
          cursor: not-allowed;
          transform: none;
        }
        .app input, .app select, .app textarea, .search-box {
          max-width: 100%;
          border: 1px solid #d8e2ee;
          border-radius: 10px;
          padding: 11px 13px;
          background: #fbfdff;
          color: #1d2f46;
          font: inherit;
          font-size: 14px;
          outline: none;
          transition: border-color .18s ease, box-shadow .18s ease, background .18s ease;
        }
        .app input:focus, .app select:focus, .app textarea:focus, .search-box:focus {
          border-color: #1595a1;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(21,149,161,.12);
        }
        .search-box {
          width: 100%;
          margin: 4px 0 12px;
        }
        .form-section {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
        }
        .form-section h2, .form-section h3 {
          flex-basis: 100%;
        }
        .form-section textarea {
          flex-basis: 100%;
          min-height: 125px;
          resize: vertical;
        }
        .app table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          overflow: hidden;
          border: 1px solid #e4ebf3;
          border-radius: 12px;
          background: #fff;
          font-size: 13px;
        }
        .app thead th {
          padding: 13px 14px;
          background: #edf4f9;
          color: #36536d;
          text-align: left;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: .25px;
          white-space: nowrap;
        }
        .app tbody td {
          padding: 13px 14px;
          border-top: 1px solid #edf1f6;
          color: #42546a;
          vertical-align: middle;
        }
        .app tbody tr:hover td {
          background: #f7fbfd;
        }
        .app footer {
          margin-top: 30px;
          padding: 22px;
          background: #102b50;
          color: rgba(255,255,255,.75);
          text-align: center;
          font-size: 12px;
          letter-spacing: .3px;
        }
        @media (max-width: 900px) {
          .navbar { position: relative; }
          .navbar > div[style*="margin-left"] { margin-left: 0 !important; }
          .nav-links { width: 100%; }
          .nav-links button { flex: 1 1 auto; }
        }
        @media (max-width: 600px) {
          .container { width: min(100% - 26px, 1440px); padding-top: 24px; }
          .navbar { padding: 14px; }
          .logo { font-size: 18px; }
          .nav-links { gap: 5px; }
          .nav-links button { padding: 8px 10px; font-size: 12px; }
          .cards { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
          .card { min-height: 116px; padding: 15px; }
          .card h2 { font-size: 25px; }
          .section, .form-section { padding: 16px; border-radius: 14px; }
          .app table { min-width: 600px; }
          .section { overflow-x: auto; }
        }
      `}</style>


      {/* NAVBAR */}

      <nav className="navbar">

        <div className="logo">
          Smart Inventory
        </div>

        {currentUser && (
          <div
            style={{
              marginLeft: "auto",
              marginRight: "20px",
              fontWeight: "bold"
            }}
          >
            {currentUser.name} (
            {isAdmin ? "Administrator" : "Student"})
          </div>
        )}

        <div className="nav-links">

          <button
            className={
              activePage ===
              "Dashboard"
                ? "active-nav"
                : ""
            }
            onClick={() =>
              setActivePage(
                "Dashboard"
              )
            }
          >
            Dashboard
          </button>

          <button
            className={
              activePage ===
              "Rooms"
                ? "active-nav"
                : ""
            }
            onClick={() =>
              setActivePage(
                "Rooms"
              )
            }
          >
            Rooms
          </button>

          <button
            className={
              activePage ===
              "Inventory"
                ? "active-nav"
                : ""
            }
            onClick={() =>
              setActivePage(
                "Inventory"
              )
            }
          >
            Inventory
          </button>

          <button
            className={
              activePage ===
              "Assets"
                ? "active-nav"
                : ""
            }
            onClick={() =>
              setActivePage(
                "Assets"
              )
            }
          >
            Assets
          </button>

          <button
            className={
              activePage ===
              "Reports"
                ? "active-nav"
                : ""
            }
            onClick={() =>
              setActivePage(
                "Reports"
              )
            }
          >
            Reports
          </button>

          <button
            className={activePage === "Feedback" ? "active-nav" : ""}
            onClick={() => setActivePage("Feedback")}
          >
            Feedback
          </button>

          <button
            onClick={() => {
              const confirmLogout =
                confirm(
                  "Are you sure you want to logout?"
                );

              if (
                confirmLogout
              ) {
                setLoggedIn(
                  false
                );

                setCurrentUser(
                  null
                );

                setShowRegister(
                  false
                );

                setActivePage(
                  "Dashboard"
                );
              }
            }}
          >
            Logout
          </button>

        </div>

      </nav>

      {/* =========================
          DASHBOARD
          ========================= */}

      {activePage ===
        "Dashboard" && (

        <div className="container">

          <h1>
            Smart Inventory Dashboard
          </h1>

          <p className="welcome-text">
            Welcome to your Smart
            Inventory Management
            System
          </p>

          <p className="subtitle">
            Monitor inventory, rooms
            and college assets
          </p>

          {/* GLOBAL ASSET SEARCH */}

          <div className="section">

            <h2>
              Search Asset
            </h2>

            <p>
              Search using the SRU Asset ID.
            </p>

            <div style={{
              display: "flex",
              gap: "10px",
              marginBottom: "15px"
            }}>

              <input
                className="search-box"
                type="text"
                value={assetSearchCode}
                onChange={(e) =>
                  setAssetSearchCode(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchAsset();
                  }
                }}
                placeholder="Enter Asset ID e.g. SRU-00001"
                style={{ flex: 1 }}
              />

              <button
                onClick={searchAsset}
                disabled={assetSearchLoading}
              >
                {assetSearchLoading ? "Searching..." : "Search"}
              </button>

            </div>

            {assetSearchMessage && (
              <p style={{
                color: "#dc2626",
                fontWeight: "bold"
              }}>
                {assetSearchMessage}
              </p>
            )}

           {assetSearchResult.length > 0 && (
  <div style={{ marginTop: "20px", overflowX: "auto" }}>
    <h3>Search Results</h3>

    <table>
      <thead>
        <tr>
          <th>Asset ID</th>
          <th>Asset Name</th>
          <th>Block</th>
          <th>Floor</th>
          <th>Room</th>
          <th>Room Type</th>
          <th>Quantity</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {assetSearchResult.map((asset) => (
          <tr key={asset.id}>
            <td>{asset.asset_code}</td>
            <td>{asset.asset_name}</td>
            <td>Block {asset.block_no}</td>
            <td>{asset.floor_name}</td>
            <td>{asset.room_code}</td>
            <td>
              {asset.room_type === "Library - Whole Ground Floor"
                ? "Library"
                : asset.room_type}
            </td>
            <td>{asset.quantity}</td>
            <td>{asset.status}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
</div>

          <div className="cards">

            <div className="card">
              <h3>
                Total Rooms
              </h3>

              <h2>
                {rooms.length}
              </h2>

              <p>
                College rooms
              </p>
            </div>

            <div className="card">
              <h3>
                Total Products
              </h3>

              <h2>
                {inventory.length}
              </h2>

              <p>
                Products in inventory
              </p>
            </div>

            <div className="card">
              <h3>
                Total Quantity
              </h3>

              <h2>
                {totalQuantity}
              </h2>

              <p>
                Total inventory items
              </p>
            </div>

            <div className="card">
              <h3>
                Low Stock
              </h3>

              <h2
                style={{
                  color:
                    "#f59e0b",
                  fontWeight:
                    "bold"
                }}
              >
                {
                  lowStockItems.length
                }
              </h2>

              <p>
                Products need attention
              </p>
            </div>

            <div className="card">
              <h3>
                Total Assets
              </h3>

              <h2>
                {assets.length}
              </h2>

              <p>
                Registered assets
              </p>
            </div>

            <div className="card">
              <h3>
                Maintenance
              </h3>

              <h2>
                {
                  maintenanceAssets.length
                }
              </h2>

              <p>
                Assets under maintenance
              </p>
            </div>

          </div>

          {/* ROOM OVERVIEW */}

          <div className="section">

            <h2>
              Room Overview
            </h2>

            <div className="cards">

              <div className="card">
                <h3>
                  Labs
                </h3>

                <h2>
                  {totalLabs}
                </h2>

                <p>
                  Laboratories
                </p>
              </div>

              <div className="card">
                <h3>
                  Classrooms
                </h3>

                <h2>
                  {totalClassrooms}
                </h2>

                <p>
                  Class rooms
                </p>
              </div>

              <div className="card">
                <h3>
                  Staff Rooms
                </h3>

                <h2>
                  {totalStaffRooms}
                </h2>

                <p>
                  Staff rooms
                </p>
              </div>

              <div className="card">
                <h3>
                  Office Rooms
                </h3>

                <h2>
                  {totalOfficeRooms}
                </h2>

                <p>
                  Office rooms
                </p>
              </div>

              <div className="card">
                <h3>
                  Library
                </h3>

                <h2>
                  {totalLibraries}
                </h2>

                <p>
                  Library area
                </p>
              </div>

            </div>

          </div>

          {/* BLOCK-WISE ROOM SUMMARY */}

          <div className="section">

            <h2>
              Block-wise Room Summary
            </h2>

            <table>

              <thead>

                <tr>
                  <th>
                    Block
                  </th>

                  <th>
                    Total Rooms
                  </th>
                </tr>

              </thead>

              <tbody>

                {blockNumbers.map(
                  (block) => {

                    const blockRoomCount =
                      rooms.filter(
                        (room) =>
                          room.block_no ===
                          block
                      ).length;

                    return (
                      <tr
                        key={block}
                      >

                        <td>
                          Block {block}
                        </td>

                        <td>
                          {
                            blockRoomCount
                          }
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* FLOOR-WISE SUMMARY */}

          <div className="section">

            <h2>
              Floor-wise Room Summary
            </h2>

            <table>

              <thead>

                <tr>
                  <th>
                    Floor
                  </th>

                  <th>
                    Total Rooms
                  </th>
                </tr>

              </thead>

              <tbody>

                {floorNames.map(
                  (floor) => {

                    const floorRoomCount =
                      rooms.filter(
                        (room) =>
                          room.floor_name ===
                          floor
                      ).length;

                    return (
                      <tr
                        key={floor}
                      >

                        <td>
                          {floor}
                        </td>

                        <td>
                          {
                            floorRoomCount
                          }
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* ROOM TYPE SUMMARY */}

          <div className="section">

            <h2>
              Room Type Summary
            </h2>

            <table>

              <thead>

                <tr>
                  <th>
                    Room Type
                  </th>

                  <th>
                    Total Rooms
                  </th>
                </tr>

              </thead>

              <tbody>

                {roomTypes.map(
                  (type) => {

                    let count = 0;

                    if (
                      type ===
                      "Library"
                    ) {
                      count =
                        totalLibraries;
                    } else {
                      count =
                        rooms.filter(
                          (room) =>
                            room.room_type ===
                            type
                        ).length;
                    }

                    return (
                      <tr
                        key={type}
                      >

                        <td>
                          {type}
                        </td>

                        <td>
                          {count}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* QUICK ACTIONS */}

          <div className="section">

            <h2>
              Quick Actions
            </h2>

            <button
              onClick={() =>
                setActivePage(
                  "Rooms"
                )
              }
            >
              Manage Rooms
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "Inventory"
                )
              }
            >
              Manage Inventory
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "Assets"
                )
              }
            >
              Manage Assets
            </button>

            <button
              onClick={() =>
                setActivePage(
                  "Reports"
                )
              }
            >
              View Reports
            </button>

          </div>

          {/* INVENTORY OVERVIEW */}

          <div className="section">

            <h2>
              Inventory Overview
            </h2>

            {inventory.length ===
            0 ? (

              <p>
                No inventory items
                available.
              </p>

            ) : (

              <table>

                <thead>

                  <tr>
                    <th>
                      Product
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Status
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {inventory.map(
                    (item) => {

                      const status =
                        getInventoryStatus(
                          item.quantity
                        );

                      return (
                        <tr
                          key={item.id}
                        >

                          <td>
                            {
                              item.product_name
                            }
                          </td>

                          <td
                            style={
                              getInventoryQuantityStyle(
                                item.quantity
                              )
                            }
                          >
                            {
                              item.quantity
                            }
                          </td>

                          <td
                            style={
                              getInventoryStatusStyle(
                                status
                              )
                            }
                          >
                            {status}
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

          {/* NOTIFICATIONS */}

          <div className="section">

            <h2>
              Notifications
            </h2>

            {lowStockItems.length > 0 && (

              <div>

                <div
                  style={{
                    color: "#f59e0b",
                    fontWeight: "bold",
                    marginBottom: "12px"
                  }}
                >
                  ⚠️ {lowStockItems.length} product(s) need attention.
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {lowStockItems.map((item) => (
                      <tr key={item.id}>
                        <td>{item.product_name}</td>
                        <td style={getInventoryQuantityStyle(item.quantity)}>
                          {item.quantity}
                        </td>
                        <td style={getInventoryStatusStyle(item.status)}>
                          {item.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>

            )}

            {outOfStockProducts.length > 0 && (

              <div
                style={{
                  color: "#dc2626",
                  fontWeight: "bold",
                  marginTop: "12px"
                }}
              >
                ⚠️ {outOfStockProducts.length} product(s) are out of stock.
              </div>

            )}

            {maintenanceAssets.length > 0 && (

              <div>
                🔧 {maintenanceAssets.length} asset(s) are under maintenance.
              </div>

            )}

            {lowStockItems.length === 0 &&
              outOfStockProducts.length === 0 &&
              maintenanceAssets.length === 0 && (

                <p>
                  No notifications. Everything looks good!
                </p>

              )}

          </div>

          {/* AI INVENTORY PREDICTION */}

          <div className="section">

            <h2>
              AI Inventory Prediction
            </h2>

            <p>
              Inventory risk analysis and smart restocking recommendations.
            </p>

            {aiPredictionLoading ? (

              <p>Loading AI predictions...</p>

            ) : aiPredictions.length === 0 ? (

              <p>No prediction data available.</p>

            ) : (

              <table>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Prediction</th>
                    <th>Recommendation</th>
                  </tr>
                </thead>

                <tbody>
                  {aiPredictions.map((item) => (
                    <tr key={item.id}>
                      <td>{item.product_name}</td>
                      <td style={getInventoryQuantityStyle(item.quantity)}>
                        {item.quantity}
                      </td>
                      <td
                        style={{
                          fontWeight: "bold",
                          color:
                            item.prediction === "High Restock Risk"
                              ? "#dc2626"
                              : item.prediction === "May Need Restocking"
                              ? "#f59e0b"
                              : "#16a34a"
                        }}
                      >
                        {item.prediction}
                      </td>
                      <td>{item.recommendation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

            )}

          </div>

        </div>

      )}

      {/* =========================
          ROOMS
          ========================= */}

      {activePage ===
        "Rooms" && (

        <div className="container">

          <h1>
            College Room Management
          </h1>

          <p className="subtitle">
            Track computers, benches,
            chairs, projectors and
            other assets in each room
          </p>

          <div className="cards">

            <div className="card">
              <h3>
                Total Rooms
              </h3>

              <h2>
                {rooms.length}
              </h2>

              <p>
                All college rooms
              </p>
            </div>

            <div className="card">

              <h3>
                Selected Room
              </h3>

              <h2>

                {selectedRoom
                  ? `B${selectedRoom.block_no} - ${getRoomDisplayName(selectedRoom)}`
                  : "-"}

              </h2>

              <p>
                Currently selected
              </p>

            </div>

            <div className="card">

              <h3>
                Room Asset Types
              </h3>

              <h2>
                {roomAssets.length}
              </h2>

              <p>
                Asset records
              </p>

            </div>

            <div className="card">

              <h3>
                Room Asset Quantity
              </h3>

              <h2>
                {
                  totalRoomAssetQuantity
                }
              </h2>

              <p>
                Total quantity
              </p>

            </div>

          </div>

          <div className="section">

            <h2>
              Search Rooms
            </h2>

            <input
              className="search-box"
              type="text"
              placeholder="Search Block, Floor, Room or Type..."
              value={
                roomSearch
              }
              onChange={(e) =>
                setRoomSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="section">

            <h2>
              Rooms
            </h2>

            {filteredRooms.length ===
            0 ? (

              <p>
                No rooms found.
              </p>

            ) : (

              <table>

                <thead>

                  <tr>
                    <th>
                      Block
                    </th>

                    <th>
                      Floor
                    </th>

                    <th>
                      Room No
                    </th>

                    <th>
                      Room Type
                    </th>

                    <th>
                      Action
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredRooms.map(
                    (room) => (

                      <tr
                        key={room.id}
                      >

                        <td>
                          Block{" "}
                          {
                            room.block_no
                          }
                        </td>

                        <td>
                          {
                            room.floor_name
                          }
                        </td>

                        <td>
                          {
                            getRoomDisplayName(
                              room
                            )
                          }
                        </td>

                        <td>
                          {
                            room.room_type
                          }
                        </td>

                        <td>

                          <button
                            onClick={() =>
                              selectRoom(
                                room.id
                              )
                            }
                          >
                            Manage Assets
                          </button>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

          {selectedRoom && (

            <div className="section">

              <h2>
                Assets in Block{" "}
                {
                  selectedRoom.block_no
                }
                ,{" "}
                {
                  selectedRoom.floor_name
                }
                ,{" "}
                {
                  getRoomDisplayName(
                    selectedRoom
                  )
                }
              </h2>

              <p>
                Room Type:{" "}
                {
                  selectedRoom.room_type
                }
              </p>

              {isAdmin && (
              <div className="form-section">

                <h3>
                  {editingRoomAssetId !==
                  null
                    ? "Edit Room Asset"
                    : "Add Asset to Room"}
                </h3>

                <input
                  type="text"
                  placeholder="Asset Name e.g. Computer, Bench, Chair"
                  value={roomAssetName}
                  onChange={(e) => setRoomAssetName(e.target.value)}
                />

                <input
                  type="text"
                  placeholder="Category e.g. Electrical, Furniture, Computer"
                  value={roomAssetCategory}
                  onChange={(e) => setRoomAssetCategory(e.target.value)}
                />

                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Quantity"
                  value={roomAssetQuantity}
                  onChange={(e) => setRoomAssetQuantity(e.target.value)}
                />

                {editingRoomAssetId !== null && (
                  <select
                    value={roomAssetDestinationId ?? ""}
                    onChange={(e) =>
                      setRoomAssetDestinationId(
                        e.target.value === "" ? null : Number(e.target.value)
                      )
                    }
                  >
                    <option value="">Select destination room</option>
                    {rooms.map((room) => (
                      <option key={room.id} value={room.id}>
                        Block {room.block_no} - {room.floor_name} - {getRoomDisplayName(room)}
                      </option>
                    ))}
                  </select>
                )}

                <select
                  value={roomAssetStatus}
                  onChange={(e) => setRoomAssetStatus(e.target.value)}
                >
                  <option value="Working">Working</option>
                  <option value="Repair">Repair</option>
                  <option value="Not Working">Not Working</option>
                </select>

                <button
                  onClick={
                    saveRoomAsset
                  }
                >
                  {editingRoomAssetId !==
                  null
                    ? "Update"
                    : "Add Asset"}
                </button>

                <button
                  onClick={
                    clearRoomAssetForm
                  }
                >
                  Clear
                </button>

              </div>

                )}
              <div className="section">

                <h3>
                  Search Room Assets
                </h3>

                <input
                  className="search-box"
                  type="text"
                  placeholder="Search asset name, quantity or status..."
                  value={
                    roomAssetSearch
                  }
                  onChange={(e) =>
                    setRoomAssetSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              {filteredRoomAssets.length ===
              0 ? (

                <p>
                  {roomAssets.length ===
                  0
                    ? "No assets added to this room yet."
                    : "No matching room assets found."}
                </p>

              ) : (

                <table>

                  <thead>

                    <tr>
                      <th>
                        Asset
                      </th>

                      <th>
                        Quantity
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredRoomAssets.map(
                      (asset) => (

                        <tr
                          key={asset.id}
                        >

                          <td>
                            {
                              asset.asset_name
                            }
                          </td>

                          <td>
                            {
                              asset.quantity
                            }
                          </td>

                          <td>
                            {
                              asset.status
                            }
                          </td>

                          <td>

                            {isAdmin && (
                              <>
                                <button
                                  onClick={() =>
                                    editRoomAsset(
                                      asset
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    deleteRoomAsset(
                                      asset.id
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </>
                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              )}

            </div>

          )}

        </div>

      )}

      {/* =========================
          INVENTORY
          ========================= */}

      {activePage ===
        "Inventory" && (

        <div className="container">

          <h1>
            Inventory Management
          </h1>

          <p className="subtitle">
            Track products, quantities
            and stock levels
          </p>

          {isAdmin && (
          <div className="form-section">

            <h2>
              {editingInventoryId !==
              null
                ? "Edit Inventory"
                : "Add Inventory"}
            </h2>

            <input
              type="text"
              placeholder="Product Name"
              value={
                productName
              }
              onChange={(e) =>
                setProductName(
                  e.target.value
                )
              }
            />

            <input
              type="number"
              placeholder="Quantity"
              value={
                quantity
              }
              onChange={(e) =>
                setQuantity(
                  e.target.value
                )
              }
            />

            <p>
              Status is automatically
              calculated from quantity.
            </p>

            <button
              onClick={
                saveInventory
              }
            >
              {editingInventoryId !==
              null
                ? "Update"
                : "Add"}
            </button>

            <button
              onClick={
                clearInventoryForm
              }
            >
              Clear
            </button>

          </div>

            )}
          <div className="section">

            <h2>
              Search Inventory
            </h2>

            <input
              className="search-box"
              type="text"
              placeholder="Search product, quantity or status..."
              value={
                search
              }
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="section">

            <h2>
              Inventory List
            </h2>

            {filteredInventory.length ===
            0 ? (

              <p>
                No inventory found.
              </p>

            ) : (

              <table>

                <thead>

                  <tr>
                    <th>
                      ID
                    </th>

                    <th>
                      Product Name
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredInventory.map(
                    (item) => {

                      const status =
                        getInventoryStatus(
                          item.quantity
                        );

                      return (
                        <tr
                          key={item.id}
                        >

                          <td>
                            {
                              item.id
                            }
                          </td>

                          <td>
                            {
                              item.product_name
                            }
                          </td>

                          <td
                            style={
                              getInventoryQuantityStyle(
                                item.quantity
                              )
                            }
                          >
                            {
                              item.quantity
                            }
                          </td>

                          <td
                            style={
                              getInventoryStatusStyle(
                                status
                              )
                            }
                          >
                            {
                              status
                            }
                          </td>

                          <td>

                            {isAdmin && (
                              <>
                                <button
                                  onClick={() =>
                                    editInventory(
                                      item
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={() =>
                                    deleteInventory(
                                      item.id
                                    )
                                  }
                                >
                                  Delete
                                </button>
                              </>
                            )}

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

      )}

      {/* =========================
          ASSETS
          ========================= */}

      {activePage ===
        "Assets" && (

        <div className="container">

          <h1>
            Asset Management
          </h1>

          <p className="subtitle">
            Track general assets and
            their locations
          </p>

          {isAdmin && (
          <div className="form-section">

            <h2>
              {editingAssetId !==
              null
                ? "Edit Asset"
                : "Add Asset"}
            </h2>

            <input
              type="text"
              placeholder="Asset ID"
              value={
                assetId
              }
              disabled={
                editingAssetId !==
                null
              }
              onChange={(e) =>
                setAssetId(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Asset Name"
              value={
                assetName
              }
              onChange={(e) =>
                setAssetName(
                  e.target.value
                )
              }
            />

            <input
              type="text"
              placeholder="Location"
              value={
                location
              }
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
            />

            <select
              value={
                assetStatus
              }
              onChange={(e) =>
                setAssetStatus(
                  e.target.value
                )
              }
            >

              <option value="Available">
                Available
              </option>

              <option value="Assigned">
                Assigned
              </option>

              <option value="Maintenance">
                Maintenance
              </option>

            </select>

            <button
              onClick={
                saveAsset
              }
            >
              {editingAssetId !==
              null
                ? "Update"
                : "Add"}
            </button>

            <button
              onClick={
                clearAssetForm
              }
            >
              Clear
            </button>

          </div>

            )}
          <div className="section">

            <h2>
              Search Assets
            </h2>

            <input
              className="search-box"
              type="text"
              placeholder="Search Asset ID, Name, Location or Status..."
              value={
                assetSearch
              }
              onChange={(e) =>
                setAssetSearch(
                  e.target.value
                )
              }
            />

          </div>

          <div className="section">

            <h2>
              Asset List
            </h2>

            {filteredAssets.length ===
            0 ? (

              <p>
                No assets found.
              </p>

            ) : (

              <table>

                <thead>

                  <tr>
                    <th>
                      ID
                    </th>

                    <th>
                      Asset ID
                    </th>

                    <th>
                      Asset Name
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Status
                    </th>

                    <th>
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {filteredAssets.map(
                    (asset) => (

                      <tr
                        key={
                          asset.id
                        }
                      >

                        <td>
                          {
                            asset.id
                          }
                        </td>

                        <td>
                          {
                            asset.asset_id
                          }
                        </td>

                        <td>
                          {
                            asset.asset_name
                          }
                        </td>

                        <td>
                          {
                            asset.location
                          }
                        </td>

                        <td>
                          {
                            asset.status
                          }
                        </td>

                        <td>

                          {isAdmin && (
                            <>
                              <button
                                onClick={() =>
                                  editAsset(
                                    asset
                                  )
                                }
                              >
                                Edit
                              </button>

                              <button
                                onClick={() =>
                                  deleteAsset(
                                    asset.asset_id
                                  )
                                }
                              >
                                Delete
                              </button>
                            </>
                          )}

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

      )}

      {/* =========================
          REPORTS
          ========================= */}

      {activePage ===
        "Reports" && (

        <div className="container">

          <h1>
            Reports
          </h1>

          <p className="subtitle">
            View inventory, rooms and
            asset summaries
          </p>

          <div className="cards">

            <div className="card">
              <h3>
                Total Rooms
              </h3>

              <h2>
                {rooms.length}
              </h2>

              <p>
                College rooms
              </p>
            </div>

            <div className="card">
              <h3>
                Labs
              </h3>

              <h2>
                {totalLabs}
              </h2>

              <p>
                Laboratories
              </p>
            </div>

            <div className="card">
              <h3>
                Classrooms
              </h3>

              <h2>
                {totalClassrooms}
              </h2>

              <p>
                Class rooms
              </p>
            </div>

            <div className="card">
              <h3>
                Staff Rooms
              </h3>

              <h2>
                {totalStaffRooms}
              </h2>

              <p>
                Staff rooms
              </p>
            </div>

            <div className="card">
              <h3>
                Office Rooms
              </h3>

              <h2>
                {totalOfficeRooms}
              </h2>

              <p>
                Office rooms
              </p>
            </div>

            <div className="card">
              <h3>
                Library
              </h3>

              <h2>
                {totalLibraries}
              </h2>

              <p>
                Library area
              </p>
            </div>

            <div className="card">
              <h3>
                Total Products
              </h3>

              <h2>
                {inventory.length}
              </h2>

              <p>
                Different products
              </p>
            </div>

            <div className="card">
              <h3>
                Total Quantity
              </h3>

              <h2>
                {totalQuantity}
              </h2>

              <p>
                Total inventory quantity
              </p>
            </div>

            <div className="card">
              <h3>
                Available Products
              </h3>

              <h2>
                {availableProducts}
              </h2>

              <p>
                Products with sufficient stock
              </p>
            </div>

            <div className="card">
              <h3>
                Low Stock Products
              </h3>

              <h2
                style={{
                  color:
                    "#f59e0b",
                  fontWeight:
                    "bold"
                }}
              >
                {
                  lowStockItems.length
                }
              </h2>

              <p>
                Products with low quantity
              </p>
            </div>

            <div className="card">
              <h3>
                Out of Stock
              </h3>

              <h2
                style={{
                  color:
                    "#dc2626",
                  fontWeight:
                    "bold"
                }}
              >
                {
                  outOfStockProducts.length
                }
              </h2>

              <p>
                Products with zero quantity
              </p>
            </div>

            <div className="card">
              <h3>
                Total Assets
              </h3>

              <h2>
                {assets.length}
              </h2>

              <p>
                Registered assets
              </p>
            </div>

            <div className="card">
              <h3>
                Available Assets
              </h3>

              <h2>
                {availableAssets}
              </h2>

              <p>
                Assets currently available
              </p>
            </div>

            <div className="card">
              <h3>
                Assigned Assets
              </h3>

              <h2>
                {assignedAssets}
              </h2>

              <p>
                Assets currently assigned
              </p>
            </div>

            <div className="card">
              <h3>
                Maintenance Assets
              </h3>

              <h2>
                {
                  maintenanceAssets.length
                }
              </h2>

              <p>
                Assets under maintenance
              </p>
            </div>

          </div>

          {/* BLOCK REPORT */}

          <div className="section">

            <h2>
              Block-wise Room Report
            </h2>

            <table>

              <thead>

                <tr>
                  <th>
                    Block
                  </th>

                  <th>
                    Total Rooms
                  </th>
                </tr>

              </thead>

              <tbody>

                {blockNumbers.map(
                  (block) => {

                    const count =
                      rooms.filter(
                        (room) =>
                          room.block_no ===
                          block
                      ).length;

                    return (
                      <tr
                        key={
                          block
                        }
                      >

                        <td>
                          Block {block}
                        </td>

                        <td>
                          {count}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* FLOOR REPORT */}

          <div className="section">

            <h2>
              Floor-wise Room Report
            </h2>

            <table>

              <thead>

                <tr>
                  <th>
                    Floor
                  </th>

                  <th>
                    Total Rooms
                  </th>
                </tr>

              </thead>

              <tbody>

                {floorNames.map(
                  (floor) => {

                    const count =
                      rooms.filter(
                        (room) =>
                          room.floor_name ===
                          floor
                      ).length;

                    return (
                      <tr
                        key={
                          floor
                        }
                      >

                        <td>
                          {floor}
                        </td>

                        <td>
                          {count}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* ROOM TYPE REPORT */}

          <div className="section">

            <h2>
              Room Type Report
            </h2>

            <table>

              <thead>

                <tr>
                  <th>
                    Room Type
                  </th>

                  <th>
                    Total Rooms
                  </th>
                </tr>

              </thead>

              <tbody>

                {roomTypes.map(
                  (type) => {

                    let count = 0;

                    if (
                      type ===
                      "Library"
                    ) {
                      count =
                        totalLibraries;
                    } else {
                      count =
                        rooms.filter(
                          (room) =>
                            room.room_type ===
                            type
                        ).length;
                    }

                    return (
                      <tr
                        key={
                          type
                        }
                      >

                        <td>
                          {type}
                        </td>

                        <td>
                          {count}
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* INVENTORY REPORT */}

          <div className="section">

            <h2>
              Inventory Report
            </h2>

            <table>

              <thead>

                <tr>
                  <th>
                    Product
                  </th>

                  <th>
                    Quantity
                  </th>

                  <th>
                    Status
                  </th>
                </tr>

              </thead>

              <tbody>

                {inventory.map(
                  (item) => {

                    const status =
                      getInventoryStatus(
                        item.quantity
                      );

                    return (
                      <tr
                        key={
                          item.id
                        }
                      >

                        <td>
                          {
                            item.product_name
                          }
                        </td>

                        <td
                          style={
                            getInventoryQuantityStyle(
                              item.quantity
                            )
                          }
                        >
                          {
                            item.quantity
                          }
                        </td>

                        <td
                          style={
                            getInventoryStatusStyle(
                              status
                            )
                          }
                        >
                          {
                            status
                          }
                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>

          {/* ROOM SUMMARY */}

          <div className="section">

            <h2>
              Room Summary
            </h2>

            <p>
              Total college rooms:{" "}
              {rooms.length}
            </p>

            <p>
              Laboratories:{" "}
              {totalLabs}
            </p>

            <p>
              Classrooms:{" "}
              {totalClassrooms}
            </p>

            <p>
              Staff Rooms:{" "}
              {totalStaffRooms}
            </p>

            <p>
              Office Rooms:{" "}
              {totalOfficeRooms}
            </p>

            <p>
              Library:{" "}
              {totalLibraries}
            </p>

            <p>
              Room assets currently
              selected:{" "}
              {roomAssets.length}
            </p>

            <p>
              Quantity in selected
              room:{" "}
              {
                totalRoomAssetQuantity
              }
            </p>

            {selectedRoom && (

              <p>
                Selected room:
                Block{" "}
                {
                  selectedRoom.block_no
                }
                ,{" "}
                {
                  selectedRoom.floor_name
                }
                ,{" "}
                {
                  getRoomDisplayName(
                    selectedRoom
                  )
                }
              </p>

            )}

          </div>

          {/* =========================
              ROOM ASSET REPORT
              ========================= */}

          <div className="section">

            <h2>
              Room Asset Report
            </h2>

            <input
              className="search-box"
              type="text"
              placeholder="Search Block, Floor, Room, Asset or Status..."
              value={
                roomAssetReportSearch
              }
              onChange={(e) =>
                setRoomAssetReportSearch(
                  e.target.value
                )
              }
            />

            {filteredRoomAssetReport.length ===
            0 ? (

              <p>
                No room assets
                found.
              </p>

            ) : (

              <table>

                <thead>

                  <tr>

                    <th>
                      Block
                    </th>

                    <th>
                      Floor
                    </th>

                    <th>
                      Room
                    </th>

                    <th>
                      Room Type
                    </th>

                    <th>
                      Asset
                    </th>

                    <th>
                      Quantity
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredRoomAssetReport.map(
                    (item) => (

                      <tr
                        key={
                          item.id
                        }
                      >

                        <td>
                          Block{" "}
                          {
                            item.block_no
                          }
                        </td>

                        <td>
                          {
                            item.floor_name
                          }
                        </td>

                        <td>
                          {
                            item.room_type ===
                            "Library - Whole Ground Floor"
                              ? "Library"
                              : `Room ${item.room_code}`
                          }
                        </td>

                        <td>
                          {
                            item.room_type
                          }
                        </td>

                        <td>
                          {
                            item.asset_name
                          }
                        </td>

                        <td>
                          {
                            item.quantity
                          }
                        </td>

                        <td>
                          {
                            item.status
                          }
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

          {/* ASSET REPORT */}

          <div className="section">

            <h2>
              Asset Report
            </h2>

            <input
              className="search-box"
              type="text"
              placeholder="Search Asset ID, Name, Location or Status..."
              value={
                reportAssetSearch
              }
              onChange={(e) =>
                setReportAssetSearch(
                  e.target.value
                )
              }
            />

            {filteredReportAssets.length ===
            0 ? (

              <p>
                No matching assets
                found.
              </p>

            ) : (

              <table>

                <thead>

                  <tr>

                    <th>
                      Asset ID
                    </th>

                    <th>
                      Asset Name
                    </th>

                    <th>
                      Location
                    </th>

                    <th>
                      Status
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {filteredReportAssets.map(
                    (asset) => (

                      <tr
                        key={
                          asset.id
                        }
                      >

                        <td>
                          {
                            asset.asset_id
                          }
                        </td>

                        <td>
                          {
                            asset.asset_name
                          }
                        </td>

                        <td>
                          {
                            asset.location
                          }
                        </td>

                        <td>
                          {
                            asset.status
                          }
                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            )}

          </div>

        </div>

      )}

      {/* =========================
          STUDENT / ADMIN FEEDBACK
          ========================= */}

      {activePage === "Feedback" && (
        <div className="container">
          <h1>{isAdmin ? "Student Feedback" : "Feedback"}</h1>
          <p className="subtitle">
            {isAdmin
              ? "Feedback messages submitted by students"
              : "Share your suggestions or concerns with the administrator"}
          </p>

          {!isAdmin && (
            <div className="form-section">
              <h2>Send Feedback to Administrator</h2>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Write your feedback here..."
                rows={5}
                style={{ width: "100%", padding: "12px", marginBottom: "12px" }}
              />
              <button onClick={submitFeedback}>Submit Feedback</button>
            </div>
          )}

          <div className="section">
            <h2>{isAdmin ? "All Student Feedback" : "My Submitted Feedback"}</h2>
            {feedbackLoading ? (
              <p>Loading feedback...</p>
            ) : feedbackError ? (
              <p style={{ color: "#dc2626" }}>{feedbackError}</p>
            ) : feedbackItems.length === 0 ? (
              <p>No feedback found.</p>
            ) : (
              <div style={{ overflowX: "auto" }}>
                <table>
                  <thead>
                    <tr>
                      {isAdmin && <th>Student Name</th>}
                      <th>Feedback</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feedbackItems.map((item) => (
                      <tr key={item.id}>
                        {isAdmin && <td>{item.student_name}</td>}
                        <td style={{ whiteSpace: "pre-wrap" }}>{item.message}</td>
                        <td>{item.created_at ? new Date(item.created_at).toLocaleString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button onClick={loadFeedback} style={{ marginTop: "15px" }}>
              Refresh Feedback
            </button>
          </div>
        </div>
      )}

      <footer>
        Smart Inventory Management
        System
      </footer>

    </div>
  );
}

export default App;
