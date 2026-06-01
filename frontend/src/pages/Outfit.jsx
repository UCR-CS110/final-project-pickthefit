import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Outfit() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("pendingOutfit")) || [];
    setItems(data);
  }, []);

  const shirts = items.filter(i =>
    i.category.toLowerCase() === "shirts"
  );

  const pants = items.filter(i =>
    i.category.toLowerCase() === "pants"
  );

  const shoes = items.filter(i =>
    i.category.toLowerCase() === "shoes"
  );

  return (
    <div className="outfit-container">
      <h1 className="closet-title"> Your Outfit</h1>

      <div className="mannequin">
        {/* SHIRT */}
        <div className="top-layer">
          {shirts.map(item => (
            <img key={item._id} src={item.imageUrl} />
          ))}
        </div>

        {/* PANTS */}
        <div className="bottom-layer">
          {pants.map(item => (
            <img key={item._id} src={item.imageUrl} />
          ))}
        </div>

        {/* SHOES */}
        <div className="shoe-layer">
          {shoes.map(item => (
            <img key={item._id} src={item.imageUrl} />
          ))}
        </div>
      </div>

      <button className="upload-button" onClick={() => alert("Shared!")}>
        Share it!
      </button>

      <button className="upload-button" onClick={() => navigate("/closet", { state: { editMode: true } })}>
        Edit
      </button>
    </div>
  );
}