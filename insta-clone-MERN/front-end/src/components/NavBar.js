import React, { useContext, useRef, useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import M from "materialize-css";
export default function NavBar() {
  const [users, setUsers] = useState([]);
  const [username, setUsername] = useState("");
  const fetchUsers = () => {
    fetch(`/fetchusers/${username}`, {
      method: "post",
    })
      .then((res) => res.json())
      .then((result) => {
        console.log(result);
        setUsers(result);
      });
  };
  useEffect(() => {
    fetchUsers();
  }, [username]);
  useEffect(() => {
    M.Modal.init(searchModal.current);
    // initialize the modal, read the document
  }, []);
  const searchModal = useRef(null);
  //useRef 还是理解的非常不透彻。这是做什么用的，什么时候用，真的不知道！！！！

  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  //一定要注意，非常基础的东西： 【】而不是{}在我们setState的时候。
  const renderList = () => {
    if (state) {
      return [
        <li key="search">
          <i
            style={{ color: "black" }}
            data-target="modal1"
            className="large material-icons modal-trigger"
          >
            search
          </i>
        </li>,
        <li key="profile">
          <Link className="navbarlink" to="/profile">
            Profile
          </Link>
        </li>,
        <li key="createPost">
          <Link className="navbarlink" to="/createpost">
            Create Post
          </Link>
        </li>,
        <li key="myfollowing">
          <Link className="navbarlink" to="/myfollowing">
            My Following
          </Link>
        </li>,
        <li key="signoutButton">
          <button
            className="btn"
            onClick={() => {
              dispatch({ type: "USER", payload: null });
              localStorage.clear();
              history.push("/");
            }}
          >
            sign out
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="signup">
          <Link className="navbarlink" to="/signup">
            Sign up
          </Link>
        </li>,
        <li key="signin">
          <Link className="navbarlink" to="/signin">
            Sign in
          </Link>
        </li>,
      ];
    }
  };
  return (
    <nav>
      <div className={`nav-wrapper white`} style={{ paddingLeft: 30 }}>
        <Link className="brand-logo navbarlink" to={state ? "/" : "/signin"}>
          Instagram
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div
        id="modal1"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            placeholder="search user"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <div className="collection">
            {users.map((item) => (
              <a
                key={item._id}
                href={
                  item._id === state._id ? "/profile" : `/profile/${item._id}`
                }
                className="collection-item"
              >
                <img
                  src={item.pic}
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    marginRight: 10,
                  }}
                ></img>
                {item.name}
              </a>
            ))}
          </div>
        </div>
        <div className="modal-footer">
          <a
            href="#!"
            className="modal-close waves-effect waves-green btn-flat"
          >
            Ok
          </a>
        </div>
      </div>
    </nav>
  );
}
