import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function UserProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const [commentPanelOpen, setCommentPanelOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  
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
        <div className="profile-pic" >
            {user.profilePicture && (
                <img src={user.profilePicture} alt="pfp" />
            )}
        </div>

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
          <div key={post._id} className="post"
          onClick={() => {
            setSelectedPost(post);
            setCommentPanelOpen(true);
          }}
        >

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
                onClick={async (e) => { e.stopPropagation();
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
                onClick={async (e) => { e.stopPropagation();
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

        {commentPanelOpen && selectedPost && (
                <div className="home-overlay" onClick={() => setCommentPanelOpen(false)}>
                    <div className="sidebar" onClick={(e) => e.stopPropagation()}>

                    <h2>Comments</h2>

                    {/* COMMENTS */}
                    {selectedPost.comments?.map((comment) => (
                        <div key={comment._id}>

                        <strong>{comment.username}</strong>
                        <p>{comment.text}</p>

                        {comment.userId === currentUser._id && (
                            <button className = "editing-button"
                        
                                onClick={async (e) => {
                                e.stopPropagation();

                                const res = await fetch(
                                    `http://localhost:5050/api/posts/${selectedPost._id}/comment/${comment._id}`,
                                    {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({ userId: user._id })
                                    }
                                );

                                const updated = await res.json();

                                setPosts(prev =>
                                    prev.map(p => (p._id === updated._id ? updated : p))
                                );

                                setSelectedPost(updated);
                                }}
                            >
                                Delete
                            </button>
                        )}

                        {/* replies */}
                        <div style={{ marginLeft: "15px" }}>
                            {comment.replies?.map((reply) => (
                            <div key={reply._id}>
                                <strong>{reply.username}</strong>: {reply.text}
                                
                                {reply.userId === currentUser._id && (                                    <button className="editing-button"
                                        onClick={async (e) => {
                                        e.stopPropagation();

                                        const res = await fetch(
                                            `http://localhost:5050/api/posts/${selectedPost._id}/comment/${comment._id}/reply/${reply._id}`,
                                            {
                                            method: "DELETE",
                                            headers: { "Content-Type": "application/json" },
                                            body: JSON.stringify({ userId: user._id })
                                            }
                                        );

                                        const updated = await res.json();

                                        setPosts(prev =>
                                            prev.map(p => (p._id === updated._id ? updated : p))
                                        );

                                        setSelectedPost(updated);
                                        }}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            ))}
                        </div>

                        {/* reply button */}
                        <button className="editing-button"
                            onClick={() => setReplyingTo(comment._id)}>
                            Reply
                        </button>

                        {replyingTo === comment._id && (
                            <div>
                            <input
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Reply..."
                            />

                            <button className="closet-button"
                                onClick={async () => {
                                const res = await fetch(
                                    `http://localhost:5050/api/posts/${selectedPost._id}/comment/reply`,
                                    {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        commentId: comment._id,
                                        userId: currentUser._id,
                                        username: currentUser.username,
                                        text: replyText,
                                    }),
                                    }
                                );
                                
                                const updated = await res.json();

                                setPosts(prev =>
                                    prev.map(p =>
                                        p._id === updated._id ? updated : p
                                    )
                                    );
        
                                    setSelectedPost(updated);
                                    setReplyText("");
                                    setReplyingTo(null);
                                }}
                            >
                                Send
                            </button>
                            </div>
                        )}
                        </div>
                    ))}

                    {/* ADD COMMENT */}
                    <input
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write a comment..."
                    />

                    <button className="closet-button"
                        onClick={async () => {
                        const res = await fetch(
                            `http://localhost:5050/api/posts/${selectedPost._id}/comment`,
                            {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                userId: currentUser._id,
                                username: currentUser.username,
                                text: commentText,
                            }),
                            }
                        );
                        const updated = await res.json();
                        setPosts(prev =>
                            prev.map(p =>
                                p._id === updated._id ? updated : p
                            )
                            );
        
                            setSelectedPost(updated);
                            setCommentText("");
                        }}
                    >
                        Post
                    </button>

                    </div>
                </div>
            )}
      </div>
    </div>
  );
}