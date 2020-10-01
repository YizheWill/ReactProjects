import React, { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import M from "materialize-css";
import { UserContext } from "../App";

export default function Profile() {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [avatar, setAvatar] = useState("");
  const [image, setImage] = useState("");
  const [photo, setPhoto] = useState("");
  useEffect(() => {
    state
      ? fetch(`/user/${state._id}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((result) => {
            console.log(result);
            setPosts(result.posts);
            setUser(result.user);
            setFollowers(result.user.followers);
            setAvatar(result.user.pic);
            setFollowing(result.user.following);
          })
      : console.log("loading");
  }, [state]);
  useEffect(() => {
    if (photo) submitInfo();
    setAvatar(photo);
  }, [photo]);
  useEffect(() => {
    if (image) updatePhotoUrl();
  }, [image]);
  const submitInfo = () => {
    console.log("submiting info");
    fetch("/updatephoto", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        pic: photo,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          M.toast({
            html: data.message,
            classes: "#2e7d32 green darken-3",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const deleteUser = () => {
    fetch(`/deleteuser`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => {
        fetch(`/deleteuserposts/${state._id}`, {
          method: "delete",
        }).catch((err) => console.log(err));
        console.log(res);
        dispatch({ type: "USER", payload: null });
        localStorage.clear();
        history.push("/");
      })
      .catch((err) => console.log(err));
  };
  const updatePhotoUrl = () => {
    console.log("updating url");
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
    <>
      {user && followers && following ? (
        <div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "30px auto",
              borderBottom: "1px solid lightgrey",
              padding: 30,
              maxWidth: 850,
            }}
          >
            <div className="image-upload">
              <label htmlFor="file-input">
                <img
                  src={
                    avatar
                      ? avatar
                      : "https://images.unsplash.com/photo-1567336273898-ebbf9eb3c3bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1386&q=80"
                  }
                  style={{
                    cursor: "pointer",
                    width: 180,
                    height: 180,
                    borderRadius: 90,
                  }}
                />
              </label>
              <input
                id="file-input"
                type="file"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
            </div>

            <div>
              <h4>{state ? state.name : "loading"}</h4>
              <div
                style={{
                  display: "flex",
                  width: "109%",
                  justifyContent: "space-between",
                }}
              >
                <h6>{posts.length} posts</h6>
                <h6>{followers.length + " "} followers</h6>
                <h6>
                  {following.length + " "}
                  following
                </h6>
              </div>
              <button
                className="btn"
                onClick={() => {
                  deleteUser();
                }}
              >
                delete user
              </button>
            </div>
          </div>
          <div
            className="gallery"
            style={{
              margin: "20px auto",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt="pic"
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>Loading... </h2>
      )}
    </>
  );
}
