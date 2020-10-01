import React, { useState, useContext } from "react";
import { UserContext } from "../App";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { state, dispatch } = useContext(UserContext);
  const saveUser = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          console.log(data.user);
          dispatch({ type: "USER", payload: data.user });
          M.toast({
            html: "sign in successful",
            classes: "#2e7d32 green darken-3",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const history = useHistory();
  return (
    <div className="card sign-card input-field input">
      <input
        type="text"
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value.toLowerCase())}
      />
      <input
        type="password"
        placeholder="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="waves-effect waves-light btn blue darken-1"
        style={{ display: "inline", width: "100%", marginTop: 20 }}
        onClick={() => {
          saveUser();
        }}
      >
        Sign in
      </button>
      <p
        style={{ color: "lightBlue", cursor: "pointer" }}
        onClick={() => history.push("/signup")}
      >
        doesn't have an account?
      </p>
      <p
        style={{ color: "lightBlue", cursor: "pointer" }}
        onClick={() => history.push("/forgotpassword")}
      >
        forget your password?
      </p>
    </div>
  );
}
