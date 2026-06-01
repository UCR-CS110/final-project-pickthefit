import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Home() {
    const navigate = useNavigate();
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelType, setPanelType] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const followers = ["nimrah", "doha", "noor", "FBI", "noora","zanah", "labubu", "igloo"];
    const following = ["zanah", "labubu", "igloo", "doha", "noor", "FBI",];
    
    return (
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-pic"></div>
  
          <div className="profile-info">
            <h1>{user.username}</h1>
  
            <div className="stats">
                <div
                    className="clickable"
                    onClick={() => {
                        setPanelType("followers");
                        setPanelOpen(true);
                    }}
                >
                    <strong>250</strong> followers
                </div>

                <div
                    className="clickable"
                    onClick={() => {
                        setPanelType("following");
                        setPanelOpen(true);
                    }}
                >
                    <strong>180</strong> following
                </div>

                <div><strong>10</strong> posts</div>
            </div>
  
            <p className="bio">
              ✨ living my best coded life ✨
            </p>

            <div>
                <button className="closet-button" 
                    onClick={() => navigate("/closet")}>
                    Closet
                </button>
            </div>
          </div>
        </div>
  
        {/* Posts grid */}
        <div className="posts-grid">
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
          <div className="post"></div>
        </div>

        {panelOpen && (
            <div className="home-overlay" onClick={() => setPanelOpen(false)}>
                <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                <h2>
                    {panelType === "followers" ? "Followers" : "Following"}
                </h2>

                <div className="list">
                    {(panelType === "followers" ? followers : following).map((user, i) => (
                        <div key={i} className="user-row">
                            {user}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        )}
    </div>
);
}