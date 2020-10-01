import React, { useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const saveUser = () => {
    fetch("/backend-reset-password", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({
            html: "Check Your email inbox",
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
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        className="waves-effect waves-light btn blue darken-1"
        style={{ display: "inline", width: "100%", marginTop: 20 }}
        onClick={() => {
          saveUser();
        }}
      >
        send reset password link
      </button>
    </div>
  );
}
