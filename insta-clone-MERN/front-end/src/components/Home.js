import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";
export default function Home() {
  const { state, dispatch } = useContext(UserContext);
  const [data, setData] = useState([]);
  const deleteComment = (postId, commentId) => {
    fetch(`/deletecomment`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId,
        commentId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          return item._id === result._id ? result : item;
        });
        setData(newData);
      });
  };
  const deletePost = (postid) => {
    fetch(`/deletepost/${postid}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.filter((item) => {
          return item._id !== result._id;
        });
        setData(newData);
        console.log(result);
      });
  };
  useEffect(() => {
    fetch("/allposts", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setData(result.posts);
      });
  }, []);
  const likePost = (id) => {
    fetch("/like", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };

  const unLikePost = (id) => {
    fetch("/unlike", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        postId: id,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        // console.log(result);
        //这个地方逻辑稍微有点复杂，后段会返回一个post的object，
        //这个object实际上是我们向其内部加了一个like的object，
        //也就是改后版本，而这个版本，我们在后端已经做完了修改，但是还要在前端
        //有所体现，这就涉及setState的问题，那么，我们能修改的只有data这个变量，
        //用setData来修改data也会造成一次re=render,这样我们后端更新的数据也会在
        //前端体现出来。
        const newData = data.map((item) => {
          if (item._id === result._id) {
            return result;
          } else {
            return item;
          }
        });
        setData(newData);
      })
      .catch((err) => console.log(err));
  };
  const makeComment = (text, postId) => {
    fetch("/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        // postedBy: state._id,
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        const newData = data.map((item) => {
          return item._id === result._id ? result : item;
        });
        setData(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      {state && state._id ? (
        <div className="home">
          {data.map((item) => {
            return (
              <div key={item._id} className="card home-card">
                <h5>
                  <Link
                    to={
                      item.postedBy
                        ? state._id === item.postedBy._id
                          ? "/profile"
                          : `/profile/${item.postedBy._id}`
                        : "/signup"
                    }
                  >
                    {item.postedBy ? item.postedBy.name : ""}
                  </Link>
                  <span style={{ float: "right" }}>
                    {item.postedBy ? (
                      item.postedBy._id === state._id ? (
                        <i
                          onClick={() => {
                            deletePost(item._id);
                          }}
                          className="material-icons"
                          style={{ color: "red" }}
                        >
                          delete
                        </i>
                      ) : (
                        <span></span>
                      )
                    ) : (
                      <span></span>
                    )}
                  </span>
                </h5>
                <img className="card-image" src={item.photo} alt={item.title} />
                <div className="card-content">
                  <i className="material-icons" style={{ color: "red" }}>
                    favorite
                  </i>
                  {item.likes.includes(state._id) ? (
                    <i
                      style={{ color: "blue" }}
                      className="material-icons"
                      onClick={() => unLikePost(item._id)}
                    >
                      thumb_down
                    </i>
                  ) : (
                    <i
                      style={{ color: "red" }}
                      className="material-icons"
                      onClick={() => likePost(item._id)}
                    >
                      thumb_up
                    </i>
                  )}

                  <h6>{item.likes.length} likes</h6>
                  <p>{item.title}</p>
                  <p>{item.body}</p>
                  <h6 style={{ fontWeight: 500 }}>COMMENTS</h6>
                  {item.comments.map((comment) => {
                    return (
                      <h6 key={Math.random()}>
                        <span style={{ fontWeight: 500 }}>
                          {comment.commentPostedBy
                            ? comment.commentPostedBy.name
                            : "deleted user"}
                          {" : "}
                        </span>
                        <span>{comment.text}</span>
                        <span style={{ float: "right" }}>
                          {comment.commentPostedBy &&
                          comment.commentPostedBy._id ? (
                            comment.commentPostedBy._id.toString() ===
                              state._id.toString() && (
                              <i
                                onClick={() => {
                                  deleteComment(item._id, comment._id);
                                }}
                                className="material-icons"
                                style={{ color: "red" }}
                              >
                                delete
                              </i>
                            )
                          ) : (
                            <span></span>
                          )}
                        </span>
                      </h6>
                    );
                  })}
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      //prevent auto rerender
                      console.log(e.target[0].value);
                      makeComment(e.target[0].value, item._id);
                      //e.target返回的是一个array，就是里面所有的input，
                      //目前只有一个，所以也就是0号元素
                      e.target[0].value = "";
                    }}
                  >
                    <input type="text" placeholder="comments" />

                    <button className="btn" type="submit">
                      submit
                    </button>
                  </form>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <h2>Loading...</h2>
      )}
    </>
  );
}
