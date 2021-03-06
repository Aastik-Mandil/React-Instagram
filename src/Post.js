import React, { useEffect, useState } from 'react';
import "./Post.css";
import { Avatar } from '@material-ui/core';
import { db } from './firebase';
import firebase from 'firebase';

function Post({ imageUrl, user, username, caption, postId }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db.collection("posts").doc(postId).collection("comments").orderBy("timestamp", "desc").onSnapshot(snapshot => {
                setComments(snapshot.docs.map(doc => doc.data()));
            });
        }
        return () => {
            unsubscribe();
        }
    }, [postId]);

    const postComment = (e) => {
        e.preventDefault();
        db.collection("posts").doc(postId).collection("comments").add({
            username: user?.displayName, text: comment, timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        setComment("");
    }

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt="Ak" src="">A</Avatar>
                <h3>{username}</h3>
            </div>

            <img src={imageUrl} alt="Post img" className="post__image" />
            <h4 className="post__text"><strog>{username}: </strog>{caption}</h4>

            <div className="post__comments">
                {comments.map((com) => (
                    <p><strong>{com.username}</strong> {com.text}</p>
                ))}
            </div>

            {user && <form className="post__commentBox">
                <input type="text" className="post__input" placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} />
                <button className="post__button" disabled={!comment} type="submit" onClick={postComment}>Post</button>
            </form>}
        </div>
    )
}

export default Post
