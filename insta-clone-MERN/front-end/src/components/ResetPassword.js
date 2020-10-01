import React, { useState, useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import M from "materialize-css";

export default function ForgotPassword() {
  const usertoken = useParams();
  const [password, setPassword] = useState("");
  const resetPassword = () => {
    fetch(`/resetpass`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token: usertoken,
        password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({
            html: "password changed successfully, please log in",
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
        placeholder="new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        className="waves-effect waves-light btn blue darken-1"
        style={{ display: "inline", width: "100%", marginTop: 20 }}
        onClick={() => {
          resetPassword();
        }}
      >
        reset password
      </button>
    </div>
  );
}
