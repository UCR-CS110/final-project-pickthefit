import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();

  async function signup(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('http://localhost:5050/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username,
          password
        })
      });

      const data = await res.json();

      if (data.success) {
        alert("Signup successful!");
        navigate("/");
      } else {
        alert(data.message || "Signup failed");
      }

    } catch (err) {
      console.log("ERROR:", err);
      alert("Server not reachable (check backend)");
    }
  }

  return (
    <div className="login_page">
      <div className="login_box">
        <h1>Signup</h1>

        <form onSubmit={signup}>
          <input id="username" placeholder="Username" />
          <input id="password" type="password" placeholder="Password" />
          <button>Signup</button>
        </form>

        <a href="/">   Login </a>

      </div>
    </div>
  );
}