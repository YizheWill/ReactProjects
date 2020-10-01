import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [photo, setPhoto] = useState("");
  const history = useHistory();
  useEffect(() => {
    if (photo) {
      fetch("/createpost", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          photo,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error });
          } else {
            M.toast({ html: "success" });
            history.push("/");
          }
        });
    }
  }, [photo]);
  const postDetails = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "willwang");
    fetch("https://api.cloudinary.com/v1_1/willwang/image/upload", {
      method: "post",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        setPhoto(data.url);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div
      className="card"
      style={{ width: 500, margin: "30px auto", padding: 30 }}
    >
      <h5>Upload your own image</h5>
      <input
        type="text"
        placeholder="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="body"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <div className="file-field input-field">
        <div className="waves-effect waves-light btn blue darken-1">
          <span>Upload Image</span>
          <input
            type="file"
            multiple
            onChange={(e) => {
              setImage(e.target.files[0]);
            }}
          />
        </div>
        <div className="file-path-wrapper">
          <input
            className="file-path validate"
            type="text"
            placeholder="Upload one or more files"
          />
        </div>
      </div>
      <button
        onClick={() => {
          postDetails();
        }}
        className="waves-effect waves-light btn blue darken-1"
        style={{ display: "inline", width: "100%", marginTop: 20 }}
      >
        Submit
      </button>
    </div>
  );
}
