import { useEffect, useState } from "react";
import axios from "axios";
import "../style.css";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const [userRes, postRes] = await Promise.all([
        axios.get("http://localhost:5050/api/users"),
        axios.get("http://localhost:5050/api/posts"),
      ]);

      setUsers(userRes.data);
      setPosts(postRes.data);
    } catch (err) {
      console.error("Error fetching admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);

  const deleteUser = async (id, username) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${username}?`
    );

    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:5050/api/users/${id}`);

      setUsers((prev) => prev.filter((u) => u._id !== id));
      setPosts((prev) => prev.filter((p) => p.userId !== id));
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  const getUserPosts = (userId) => {
    return posts.filter((post) => post.userId === userId);
  };

  if (loading) {
    return (
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>

      <div className="admin-stats">
        <h3>Total Users: {users.length}</h3>
      </div>

      {users.map((user) => {
        const userPosts = getUserPosts(user._id);

        return (
          <div key={user._id} className="admin-user-card">
            <div className="admin-user-left">
              <div className="admin-profile-pic">
                {user.profilePicture ? (
                <img
                    src={user.profilePicture}
                    alt={user.username}
                />
                ) : null}
              </div>

              <div className="admin-user-info">
                <h3>{user.username}</h3>

                <p>
                  <strong>Bio:</strong>{" "}
                  {user.bio?.trim() ? user.bio : "No bio"}
                </p>

                <p>
                  <strong>Followers:</strong>{" "}
                  {user.followers?.length || 0}
                </p>

                <p>
                  <strong>Following:</strong>{" "}
                  {user.following?.length || 0}
                </p>

                <p>
                  <strong>Posts:</strong> {userPosts.length}
                </p>

                {userPosts.length > 0 && (
                  <div style={{ marginTop: "10px" }}>
                    <strong>Recent Posts:</strong>
                    <ul>
                      {userPosts.slice(0, 3).map((post) => (
                        <li key={post._id}>
                          {post.name || post.description || "Untitled post"}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <button
              className="admin-delete-btn"
              onClick={() => deleteUser(user._id, user.username)}
            >
              Delete
            </button>
          </div>
        );
      })}
    </div>
  );
}