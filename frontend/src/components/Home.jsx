import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Home() {
    const navigate = useNavigate();
    const [panelOpen, setPanelOpen] = useState(false);
    const [panelType, setPanelType] = useState("");
    const [posts, setPosts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [bioText, setBioText] = useState("");
    const [editingBio, setEditingBio] = useState(false);
    const [editBioOpen, setEditBioOpen] = useState(false);
    const [editPicOpen, setEditPicOpen] = useState(false);
    
    const user = JSON.parse(localStorage.getItem("user"));
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    const [bio, setBio] = useState(user.bio || "");
    const [profilePicture, setProfilePicture] = useState(user.profilePicture || "");
    
    useEffect(() => {
        fetch("http://localhost:5050/api/posts")
          .then(res => res.json())
          .then(data => setPosts(data));
      }, []);

    useEffect(() => {
        fetch(
          `http://localhost:5050/api/auth/${user._id}`
        )
          .then(res => res.json())
          .then(data => {
            setFollowers(data.followers);
            setFollowing(data.following);
          });
      }, []);

    useEffect(() => {
        if (user) {
          setBioText(user.bio || "");
        }
      }, [user]);

    const userPosts = posts.filter(
        post => post.userId === user._id
    );

    const handleFollow = async (targetUserId) => {
        await fetch(
          "http://localhost:5050/api/auth/follow",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json"
            },
            body: JSON.stringify({
              currentUserId: user._id,
              targetUserId
            })
          }
        );
      
        // refresh counts afterward
        const updatedUser = await fetch(
            `http://localhost:5050/api/auth/${user._id}`
          );
          
          const data = await updatedUser.json();
          
          setFollowers(data.followers);
          setFollowing(data.following);
      };

      const handleUpdateProfile = async () => {
        const res = await fetch(
          `http://localhost:5050/api/auth/update/${user._id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ bio, profilePicture })
          }
        );
      
        const updatedUser = await res.json();
      
        localStorage.setItem("user", JSON.stringify(updatedUser));
      
        setEditBioOpen(false);
        setEditPicOpen(false);
      };

    const handleLogout = () => {
        localStorage.removeItem("user");
        navigate("/");
    };

    const handleSearch = async (value) => {
        setSearchTerm(value);
    
        if (!value) {
            setSearchResults([]);
            return;
        }
    
        const res = await fetch(
            `http://localhost:5050/api/auth/search?username=${value}`
        );
    
        const data = await res.json();
        setSearchResults(data);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
      
        if (!file) return;
      
        const imageUrl = URL.createObjectURL(file);
        setProfilePicture(imageUrl);
      };
    // const saveBio = async () => {
    //     const res = await fetch("http://localhost:5050/api/auth/bio", {
    //       method: "PUT",
    //       headers: {
    //         "Content-Type": "application/json"
    //       },
    //       body: JSON.stringify({
    //         userId: user._id,
    //         bio: bioText
    //       })
    //     });
      
    //     const updated = await res.json();
    //     setUser(updated);
    //     setEditingBio(false);
    //   };
    const handleUnfollow = async (targetUserId) => {
        await fetch("http://localhost:5050/api/auth/unfollow", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentUserId: user._id,
            targetUserId
          })
        });
      
        const updatedUser = await fetch(
          `http://localhost:5050/api/auth/${user._id}`
        );
      
        const data = await updatedUser.json();
      
        setFollowers(data.followers);
        setFollowing(data.following);
    };

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
            
          <div className="profile-pic">
            {profilePicture && (
                <img src={profilePicture} alt="pfp" />
            )}
          </div>
  
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
                    <strong>{followers.length}</strong> followers
                </div>

                <div
                    className="clickable"
                    onClick={() => {
                        setPanelType("following");
                        setPanelOpen(true);
                    }}
                >
                    <strong>{following.length}</strong> following
                </div>

                <div><strong>{userPosts.length}</strong> posts</div>
            </div>
  
            <p className="bio">
                {bio}
            </p>

            <div className = "rightside-buttons">
                <button className = "editing-button" onClick={() => setEditBioOpen(true)}>
                    Edit Bio
                </button>
                <button  className="editing-button" onClick={() => setEditPicOpen(true)}>
                    Edit Profile Picture
                </button>
                <button className="editing-button" onClick={handleLogout}>
                    Logout
                </button>
            </div>

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
            {userPosts.map((post) => (
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

        {editBioOpen && (
            <div className="modal">
                <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                />

                <button className="closet-button" onClick={handleUpdateProfile}>
                Save Bio
                </button>
            </div>
        )}

        {editPicOpen && (
            <div className="modal">
                <input
                type="file"
                accept="image/*"
                value={profilePicture}
                onChange= {handleImageUpload}
                />

                <button className="closet-button" onClick={handleUpdateProfile}>
                Save Picture
                </button>
            </div>
        )}

        {panelOpen && (
            <div className="home-overlay" onClick={() => setPanelOpen(false)}>
                <div className="sidebar" onClick={(e) => e.stopPropagation()}>
                <h2>
                    {panelType === "followers" ? "Followers" : "Following"}
                </h2>

                <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) =>
                        handleSearch(e.target.value)
                    }
                />

                <div className="list">

                {/* SEARCH MODE */}
                {searchTerm.length > 0 ? (
                searchResults.length > 0 ? (
                    searchResults.map((person) => (
                    <div key={person._id} className="user-row"
                    // onClick={() => navigate(`/user/${person._id}`)}
                    >
                        {person.username}
                    
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleFollow(person._id);
                            }}
                        >
                            Follow
                        </button>
                    </div>
                    ))
                ) : (
                    <p>No users found</p>
                )
                ) : (
                /* FOLLOWERS / FOLLOWING MODE */
                (panelType === "followers" ? followers : following).map((person) => (
                    <div key={person._id} className="user-row user-row-flex"
                    onClick={() => navigate(`/user/${person._id}`)} 
                    >
                        {person.username}
                    
                    {panelType === "following" && (
                        <button
                            className="editing-button unfollow-btn"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleUnfollow(person._id);
                            }}
                        >
                            Unfollow
                        </button>
                    )}
                    </div>
                ))
                )}

                </div>
            </div>
        </div>
        )}
    </div>
);
}