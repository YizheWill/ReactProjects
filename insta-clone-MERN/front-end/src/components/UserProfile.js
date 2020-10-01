import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";

export default function Profile() {
  const { state, dispatch } = useContext(UserContext);
  const [userProfile, setUser] = useState({});
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [follower, setFollower] = useState([]);
  const [followed, setFollowed] = useState(false);
  const [avatar, setAvatar] = useState("");
  const { userid } = useParams();
  useEffect(() => {
    state
      ? fetch(`/user/${userid}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        })
          .then((res) => res.json())
          .then((result) => {
            console.log("result is ", result);
            setPosts(result.posts);
            setUser(result.user);
            setFollower(result.user.followers);
            setFollowing(result.user.following);
            setFollowed(
              result.user.followers.some((item) => item._id === state._id)
            );
            setAvatar(result.user.pic);
          })
      : console.log("loading");
  }, [state]);
  const followUser = () => {
    setFollowed(true);
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        toFollow: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setFollower(result.followers);
        setFollowing(result.following);
      });
  };

  const unfollowUser = () => {
    setFollowed(false);
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        toFollow: userid,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setFollower(result.followers);
        setFollowing(result.following);
      });
  };

  return (
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
        <img
          className="item"
          style={{ width: 180, height: 180, borderRadius: 90 }}
          src={
            avatar
              ? avatar
              : "https://images.unsplash.com/photo-1586287011575-a23134f797f9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1400&q=80"
          }
          alt="avatar"
        />
        <div>
          <h4>{userProfile.name}</h4>
          <h5>{userProfile.email}</h5>
          <div
            style={{
              display: "flex",
              width: "109%",
              justifyContent: "space-between",
            }}
          >
            {followed ? (
              <button className="btn" onClick={() => unfollowUser()}>
                Unfollow
              </button>
            ) : (
              <button className="btn" onClick={() => followUser()}>
                Follow
              </button>
            )}

            <h6>{posts.length} posts</h6>
            <h6>
              {follower.length + " "}
              followers
            </h6>
            <h6>
              {following.length + " "}
              following
            </h6>
          </div>
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
            <img key={item._id} className="item" src={item.photo} alt="pic" />
          );
        })}
      </div>
    </div>
  );
}
