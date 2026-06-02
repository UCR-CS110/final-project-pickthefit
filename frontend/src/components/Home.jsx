import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
    const navigate = useNavigate();
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelType, setPanelType] = useState("");
    const [posts, setPosts] = useState([]);

    const user = JSON.parse(localStorage.getItem("user"));
    const followers = ["nimrah", "doha", "noor", "FBI", "noora","zanah", "labubu", "igloo"];
    const following = ["zanah", "labubu", "igloo", "doha", "noor", "FBI",];
    
    useEffect(() => {
        fetch("http://localhost:5050/api/posts")
          .then(res => res.json())
          .then(data => setPosts(data));
      }, []);
    
    const userPosts = posts.filter(
        post => post.userId === user._id
    );

    const handleDeletePost = async (postId) => {
        try {
            const res = await fetch(
                `http://localhost:5050/api/posts/${postId}`,
                {
                    method: "DELETE"
                }
            );
    
            if (res.ok) {
                setPosts((prev) =>
                    prev.filter((post) => post._id !== postId)
                );
            }
        } catch (err) {
            console.log(err);
        }
    };
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

                <div><strong>{userPosts.length}</strong> posts</div>
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
            {posts.map((post) => (
                <div key={post._id} className="post">
                <h3>{post.name}</h3>
                <p>{post.description}</p>
                
                
                <div className="post-outfit-wrapper">
    
                    {/* LEFT SIDE: outfit (shirt/pants/shoes) */}
                    <div className="post-outfit-preview">
                        {[...post.items]
                            .filter(i => i.category !== "accessories")
                            .sort((a, b) => {
                                const order = ["shirts", "dresses","jackets", "pants", "shoes"];
                                return order.indexOf(a.category) - order.indexOf(b.category);
                            })
                            .map((item) => (
                                <img key={item._id} src={item.imageUrl} />
                            ))}
                    </div>

                    {/* RIGHT SIDE: accessories */}
                    <div className="post-accessories">
                        {post.items
                            .filter(i => i.category === "accessories")
                            .map((item) => (
                                <img key={item._id} src={item.imageUrl} />
                            ))}
                    </div>
                    <button
                        className="delete-post-button"
                        onClick={() => handleDeletePost(post._id)}
                    >
                        Delete
                    </button>

                </div>

                <div className="like-bar">
                    <button
                    onClick={async () => {
                        const res = await fetch(`http://localhost:5050/api/posts/${post._id}/like`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: user._id })
                        });

                        const updated = await res.json();

                        setPosts(prev =>
                        prev.map(p => (p._id === updated._id ? updated : p))
                        );
                    }}
                    >
                    👍 {post.likes?.length || 0}
                    </button>

                    <button
                    onClick={async () => {
                        const res = await fetch(`http://localhost:5050/api/posts/${post._id}/dislike`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userId: user._id })
                        });

                        const updated = await res.json();

                        setPosts(prev =>
                        prev.map(p => (p._id === updated._id ? updated : p))
                        );
                    }}
                    >
                    👎 {post.dislikes?.length || 0}
                    </button>
                </div>
                </div>
            ))}
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