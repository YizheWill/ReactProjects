import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [photo, setPhoto] = useState("");
  const [image, setImage] = useState("");
  //如果不写这个if（photo）就确实会有问题，photo从无到有似乎也会出发一次submitInfo，这样
  //就会导致在页面刚刚load的时候就会signup，而所有的field都是空的，服务器会发送警告。
  useEffect(() => {
    console.log("photo", photo);
    if (photo) submitInfo();
  }, [photo]);
  const submitInfo = () => {
    fetch("/signup", {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        password,
        pic: photo
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({
            html: data.message,
            classes: "#2e7d32 green darken-3"
          });
          history.push("/signin");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };
  const updatePhotoUrl = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "willwang");
    fetch("https://api.cloudinary.com/v1_1/willwang/image/upload", {
      method: "post",
      body: data
    })
      .then(res => res.json())
      .then(data => {
        setPhoto(data.url);
      })
      .catch(err => console.log(err));
  };

  const history = useHistory();
  return (
    <div className="card sign-card input-field input">
      <input type="text" placeholder="username" value={name} onChange={e => setName(e.target.value)} />
      <input type="text" placeholder="email" value={email} onChange={e => setEmail(e.target.value.toLowerCase())} />
      <input type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
      <div className="file-field input-field">
        <div className="waves-effect waves-light btn blue darken-1">
          <span>Upload Image</span>
          <input
            type="file"
            multiple
            onChange={e => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div className="file-path-wrapper">
          <input className="file-path validate" type="text" placeholder="Upload one or more files" />
        </div>
      </div>
      <button
        className="waves-effect waves-light btn blue darken-1"
        style={{ display: "inline", width: "100%", marginTop: 20 }}
        onClick={() => {
          updatePhotoUrl();
        }}
      >
        Sign up
      </button>
      <p onClick={() => history.push("/signin")} style={{ color: "lightBlue" }}>
        already have an account?
      </p>

      <p style={{ color: "lightBlue", cursor: "pointer" }} onClick={() => history.push("/forgotpassword")}>
        forget your password?
      </p>
    </div>
  );
}
