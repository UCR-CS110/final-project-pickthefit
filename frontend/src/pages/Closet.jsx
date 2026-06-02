import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function Closet() {
    const [showUpload, setShowUpload] = useState(false);
    const [clothes, setClothes] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isCreatingOutfit, setIsCreatingOutfit] = useState(false);
    const [selectedOutfitItems, setSelectedOutfitItems] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    // item upload form
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("shirts");
    const [imageFile, setImageFile] = useState(null);

    const categories = [
        "Shirts",
        "Pants",
        "Dresses",
        "Jackets",
        "Shoes",
        "Accessories"
    ];

    // getting user
    const getUser = () =>
        JSON.parse(localStorage.getItem("user"));

    // fetch specific user's clothes
    const fetchClothes = () => {
        const user = getUser();
        if (!user?._id) return;

        fetch(`http://localhost:5050/api/clothes?userId=${user._id}`)
            .then((res) => res.json())
            .then((data) => setClothes(data))
            .catch((err) => console.log(err));
    };

    useEffect(() => {
        fetchClothes();
    }, []);
    useEffect(() => {
        const isEditMode = location.state?.editMode === true;
    
        if (isEditMode) {
            const saved =
                JSON.parse(localStorage.getItem("pendingOutfit")) || [];
            setSelectedOutfitItems(saved);
            setIsCreatingOutfit(true);
        } else {
            setSelectedOutfitItems([]); // IMPORTANT: no auto selection in create mode
            setIsCreatingOutfit(false);
        }
    }, [location.state]);

    // save items
    const handleSave = async () => {
        try {
            if (!name || !description || !category) {
                alert("Please fill all fields");
                return;
            }

            if (!imageFile) {
                alert("Please select an image");
                return;
            }

            const user = getUser();
            if (!user?._id) {
                alert("User not found");
                return;
            }

            const formData = new FormData();

            formData.append("name", name);
            formData.append("description", description);
            formData.append("category", category);
            formData.append("image", imageFile);
            formData.append("userId", user._id);

            const res = await fetch(
                "http://localhost:5050/api/clothes",
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                console.log("Backend error:", data);
                return;
            }

            fetchClothes();

            setName("");
            setDescription("");
            setCategory("shirts");
            setImageFile(null);
            setShowUpload(false);
        } catch (err) {
            console.log(err);
        }
    };

    // delete items
    const handleDelete = async () => {
        if (!selectedItem) return;

        try {
            const res = await fetch(
                `http://localhost:5050/api/clothes/${selectedItem._id}`,
                {
                    method: "DELETE"
                }
            );

            if (res.ok) {
                setClothes((prev) =>
                    prev.filter(
                        (item) => item._id !== selectedItem._id
                    )
                );

                setSelectedItem(null);
            }
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="closet-container">
            <div>
                <button className="back-button"
                    onClick={() => navigate("/home")}
                >
                Back to Home
                </button>
            </div>
            <h1 className="closet-title">My Closet</h1>
            
            {/* clothes for each category */}
            {categories.map((categoryName) => (
                <div key={categoryName} className="category-section">
                    <h2 className="category-title">
                        {categoryName}
                    </h2>

                    <div className="clothing-grid">
                        {clothes
                            .filter(
                                (item) =>
                                    item.category?.toLowerCase() ===
                                    categoryName.toLowerCase()
                            )
                            .map((item) => (
                                <div
                                key={item._id}
                                className={`clothing-card ${
                                    selectedOutfitItems.find((i) => i._id === item._id)
                                        ? "selected"
                                        : ""
                                }`}
                                onClick={() => {
                                    if (!isCreatingOutfit)  {
                                        setSelectedItem(item);
                                        return;
                                    }
                    
                                    // 🟢 CREATE MODE (build outfit slowly)
                                    setSelectedOutfitItems((prev) => {
                                        const exists = prev.some(i => i._id === item._id);
                                
                                        if (exists) {
                                            return prev.filter(i => i._id !== item._id);
                                        }
                                
                                        return [
                                            ...prev.filter(i => i.category !== item.category),
                                            item
                                        ];
                                    });
                                }}
                                style={{ cursor: "pointer" }}
                            >
                                {/* IMAGE */}
                                {item.imageUrl ? (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.name}
                                        className="clothing-image"
                                    />
                                ) : (
                                    <div className="clothing-image" />
                                )}

                                    <p>{item.name}</p>
                                </div>
                            ))}
                    </div>
                </div>
            ))}

            {/* upload button */}
            <div className="upload-section">
                <button
                    className="upload-button"
                    onClick={() => setShowUpload(true)}
                >
                    Upload More Clothes
                </button>

                <button
                className="upload-button"
                onClick={() => {setIsCreatingOutfit(true); 
                    setSelectedOutfitItems([]); // IMPORTANT: start fresh
                    setSelectedItem(null);
                }}

                // style={{ marginTop: "10px", backgroundColor: "#333" }}
                >
                    Create Outfit
                </button>
            </div>

            {/* upload */}
            {showUpload && (
                <div
                    className="modal-overlay"
                    onClick={() => setShowUpload(false)}
                >
                    <div
                        className="upload-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>Item Upload</h2>

                        <input
                            type="text"
                            placeholder="Item Name"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                        />

                        <textarea
                            placeholder="Item Description"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                        <select
                            value={category}
                            onChange={(e) =>
                                setCategory(e.target.value)
                            }
                        >
                            <option value="shirts">Shirts</option>
                            <option value="pants">Pants</option>
                            <option value="dresses">Dresses</option>
                            <option value="jackets">Jackets</option>
                            <option value="shoes">Shoes</option>
                            <option value="accessories">
                                Accessories
                            </option>
                        </select>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImageFile(e.target.files[0])
                            }
                        />

                        <div className="modal-buttons">
                            <button onClick={handleSave}>
                                Save
                            </button>

                            <button
                                onClick={() =>
                                    setShowUpload(false)
                                }
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* delete popup */}
            {selectedItem && (
                <div
                    className="modal-overlay"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="upload-modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2>{selectedItem.name}</h2>

                        {selectedItem.imageUrl && (
                            <img
                                src={selectedItem.imageUrl}
                                alt=""
                                className="clothing-image"
                            />
                        )}

                        <p>{selectedItem.description}</p>

                        <div className="modal-buttons">
                            <button
                                onClick={handleDelete}
                                style={{
                                    backgroundColor: "red",
                                    color: "white"
                                }}
                            >
                                Delete
                            </button>

                            <button
                                onClick={() =>
                                    setSelectedItem(null)
                                }
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCreatingOutfit && (
            <div className="upload-section">
                <button
                className="upload-button"
                onClick={() => {
                    const outfit = selectedOutfitItems;
                
                    localStorage.setItem(
                        "pendingOutfit",
                        JSON.stringify(outfit)
                    );
                
                    console.log("SAVED OUTFIT:", outfit);
                
                    navigate("/outfit");
                }}
                >
                Done
                </button>

                <button
                    className="upload-button"
                    // style={{ backgroundColor: "rgb(128, 6, 61)" }}
                    onClick={() => {
                        setIsCreatingOutfit(false);
                        setSelectedOutfitItems([]);
                    }}
                >
                    Cancel
                </button>
            </div>
            )}
        </div>
    );
}