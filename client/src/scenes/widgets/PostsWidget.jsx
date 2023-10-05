import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPosts } from "state";
import PostWidget from "./PostWidget";
import EditPostWidget from "./EditPostWidget";
const BASE_URL = process.env.REACT_APP_BASE_URL;

const PostsWidget = ({ userId, isProfile = false }) => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts);
  const token = useSelector((state) => state.token);

  const getPosts = async () => {
    const response = await fetch(`${BASE_URL}/posts`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  const getUserPosts = async () => {
    const response = await fetch(
      `${BASE_URL}/posts/${userId}/posts`,
      {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    const data = await response.json();
    dispatch(setPosts({ posts: data }));
  };

  useEffect(() => {
    if (isProfile) {
      getUserPosts();
    } else {
      getPosts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProfile, userId]); // Updated the dependencies

  const [editPostId, setEditPostId] = useState(null);

  const handleEditClick = (postId) => {
    setEditPostId(postId);
  };

  const handleDeleteClick = async (postId) => {
    const response = await fetch(`${BASE_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.ok) {
      // Remove the deleted post from the Redux store
      const updatedPosts = posts.filter((post) => post._id !== postId);
      dispatch(setPosts({ posts: updatedPosts }));
    }
  };

  const handleEditClose = () => {
    setEditPostId(null);
  };

  return (
    <>
      {posts.map(
        ({
          _id,
          userId,
          firstName,
          lastName,
          description,
          location,
          picturePath,
          userPicturePath,
          likes,
          comments,
        }) => (
          <React.Fragment key={_id}>
            <PostWidget
              postId={_id}
              postUserId={userId}
              name={`${firstName} ${lastName}`}
              description={description}
              location={location}
              picturePath={picturePath}
              userPicturePath={userPicturePath}
              likes={likes}
              comments={comments}
              userId={userId}
              handleEditClick={handleEditClick} // Pass the handleEditClick function to PostWidget
              handleDeleteClick={handleDeleteClick} // Pass the handleDeleteClick function to PostWidget
            />
            {editPostId === _id && ( // Show the EditPostWidget if editPostId matches the current post id
              <EditPostWidget
                postId={_id}
                description={posts.find((post) => post._id === editPostId).description}
                picturePath={posts.find((post) => post._id === editPostId).picturePath}
                onClose={handleEditClose}
              />
            )}
          </React.Fragment>
        )
      )}
    </>
  );
};

export default PostsWidget;
