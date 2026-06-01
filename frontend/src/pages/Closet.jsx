import { useState } from "react";


export default function Closet() {
    const [showUpload, setShowUpload] = useState(false);

    const categories = [
        "Shirts",
        "Pants",
        "Dresses",
        "Jackets",
        "Shoes",
        "Accessories"
    ];

    return (
        <div className="closet-container">
            <h1 className="closet-title">My Closet</h1>

            {categories.map((category) => (
                <div key={category} className="category-section">
                    <h2 className="category-title">{category}</h2>

                    <div className="clothing-grid">
                        {/* Placeholder items */}
                        <div className="clothing-card">
                            <div className="clothing-image"></div>
                            <p>Item Name</p>
                        </div>

                        <div className="clothing-card">
                            <div className="clothing-image"></div>
                            <p>Item Name</p>
                        </div>

                        <div className="clothing-card">
                            <div className="clothing-image"></div>
                            <p>Item Name</p>
                        </div>
                    </div>
                </div>
            ))}

            <div className="upload-section">
                <button
                    className="upload-button"
                    onClick={() => setShowUpload(true)}
                >
                    Upload More Clothes
                </button>
            </div>

            {showUpload && (
                <div
                    className="overlay"
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
                        />

                        <textarea
                            placeholder="Item Description"
                        />

                        <select>
                            <option>Shirts</option>
                            <option>Pants</option>
                            <option>Dresses</option>
                            <option>Jackets</option>
                            <option>Shoes</option>
                            <option>Accessories</option>
                        </select>

                        <input type="file" />

                        <div className="modal-buttons">
                            <button>Save</button>

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
        </div>
    );
}