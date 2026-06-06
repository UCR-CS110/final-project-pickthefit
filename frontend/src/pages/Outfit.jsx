import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Outfit() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const [showSharePanel, setShowSharePanel] = useState(false);
  const [outfitName, setOutfitName] = useState("");
  const [outfitDescription, setOutfitDescription] = useState("");
  
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("pendingOutfit")) || [];
    setItems(data);
  }, []);

  const shirts = items.filter(i =>
    i.category.toLowerCase() === "shirts"
  );

  const dresses = items.filter(i =>
    i.category.toLowerCase() === "dresses"
  );

  const jackets = items.filter(i =>
    i.category.toLowerCase() === "jackets"
  );

  const accessories = items.filter(i =>
    i.category.toLowerCase() === "accessories"
  );

  const pants = items.filter(i =>
    i.category.toLowerCase() === "pants"
  );

  const shoes = items.filter(i =>
    i.category.toLowerCase() === "shoes"
  );

  const handlePost = async () => {
    const user = JSON.parse(localStorage.getItem("user")); 
  
    const newPost = {
      name: outfitName,
      description: outfitDescription,
      items: items,
      userId: user._id, 
      createdAt: new Date()
    };
  
    const res = await fetch("http://localhost:5050/api/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newPost)
    });
  
    if (res.ok) {
      setShowSharePanel(false);
      setOutfitName("");
      setOutfitDescription("");
      alert("Posted!");
    }
  };
  return (
    <div className="outfit-container">
        <div>
        <button className="back-button"
            onClick={() => navigate("/closet")}
        >
        Back to Closet
        </button>
      </div>
      <h1 className="closet-title"> Your Outfit</h1>
      
      <div className="mannequin">
        {/* shirt */}
        <div className="top-layer">
          {shirts.map(item => (
            <img key={item._id} src={item.imageUrl} />
          ))}
          {dresses.map(item => (
            <img key={item._id} src={item.imageUrl} />
          ))}
          {jackets.map(item => (
            <img key={item._id} src={item.imageUrl} />
          ))}
        </div>

        {/* pants */}
        <div className="bottom-layer">
          {pants.map(item => (
            <img key={item._id} src={item.imageUrl} />
          ))}
        </div>

        {/* shoes */}
        <div className="shoe-layer">
          {shoes.map(item => (
            <img key={item._id} src={item.imageUrl} />
          ))}
        </div>
        
        <div className="accessory-layer">
        {accessories.map(item => (
            <img key={item._id} src={item.imageUrl} />
          ))}
        </div>
      </div>

      <button
        className="upload-button"
        onClick={() => setShowSharePanel(true)}
      >
        Share it!
      </button>

      <button className="upload-button" onClick={() => navigate("/closet", { state: { editMode: true } })}>
        Edit
      </button>

      {showSharePanel && (
        <div
            className="share-overlay"
            onClick={() => setShowSharePanel(false)}
        >
            <div
            className="share-panel"
            onClick={(e) => e.stopPropagation()}
            >
            <h2>Create Post</h2>

            <input
                type="text"
                placeholder="Outfit Name"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
            />

            <textarea
                placeholder="Outfit Description"
                value={outfitDescription}
                onChange={(e) => setOutfitDescription(e.target.value)}
            />

            <button onClick={handlePost}>
                Post
            </button>
            </div>
        </div>
        )}
    </div>
  );
}