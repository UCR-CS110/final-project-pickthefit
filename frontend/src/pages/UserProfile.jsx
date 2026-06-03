import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  
  useEffect(() => {
    fetch(`http://localhost:5050/api/auth/${id}`)
      .then(res => res.json())
      .then(data => setUser(data));

    fetch("http://localhost:5050/api/posts")
      .then(res => res.json())
      .then(data => {
        setPosts(data.filter(p => p.userId === id));
      });
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">

      {/* HEADER */}
      <div className="profile-header">
        <div className="profile-pic" />

        <div className="profile-info">
          <h1>{user.username}</h1>

          <div className="stats">
            <div>
              <strong>{user.followers?.length || 0}</strong> followers
            </div>

            <div>
              <strong>{user.following?.length || 0}</strong> following
            </div>

            <div>
              <strong>{posts.length}</strong> posts
            </div>
          </div>

          {/* ✅ BIO ADDED */}
          <p className="bio">
            {user.bio || "no bio yet"}
          </p>

          <div className="rightside-buttons">
            <button
                className="editing-button"
                onClick={() => navigate("/home")}
            >
                Back to Profile
            </button>
          </div>
        </div>
      </div>

      {/* POSTS GRID (MATCHES HOME EXACTLY) */}
      <div className="posts-grid">
        {posts.map((post) => (
          <div key={post._id} className="post">

            <h3>{post.name}</h3>
            <p>{post.description}</p>

            <div className="post-outfit-wrapper">

              {/* LEFT: outfit */}
              <div className="post-outfit-preview">
                {[...post.items]
                  .filter(i => i.category !== "accessories")
                  .sort((a, b) => {
                    const order = ["shirts", "dresses", "jackets", "pants", "shoes"];
                    return order.indexOf(a.category) - order.indexOf(b.category);
                  })
                  .map((item) => (
                    <img key={item._id} src={item.imageUrl} />
                  ))}
              </div>

              {/* RIGHT: accessories */}
              <div className="post-accessories">
                {post.items
                  .filter(i => i.category === "accessories")
                  .map((item) => (
                    <img key={item._id} src={item.imageUrl} />
                  ))}
              </div>

            </div>
          

            <div className="like-bar">
            <button
                onClick={async () => {
                const res = await fetch(
                    `http://localhost:5050/api/posts/${post._id}/like`,
                    {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: currentUser._id })
                    }
                );

                const updated = await res.json();

                setPosts(prev =>
                    prev.map(p =>
                    p._id === updated._id ? updated : p
                    )
                );
                }}
            >
                👍 {post.likes?.length || 0}
            </button>

            <button
                onClick={async () => {
                const res = await fetch(
                    `http://localhost:5050/api/posts/${post._id}/dislike`,
                    {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userId: currentUser._id })
                    }
                );

                const updated = await res.json();

                setPosts(prev =>
                    prev.map(p =>
                    p._id === updated._id ? updated : p
                    )
                );
                }}
            >
                👎 {post.dislikes?.length || 0}
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}