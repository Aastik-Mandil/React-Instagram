import React, { useState } from 'react';
import "./ImageUpload.css";
import { Button } from '@material-ui/core';
import { db, storage } from './firebase';
import firebase from 'firebase';

function ImageUpload({ username }) {
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0)
    const [caption, setCaption] = useState("");

    const handleChange = (e) => {
        const img = e.target.files[0];
        console.log(img);
        if (img) {
            setImage(img);
        } else {
            console.log("Some error");
        }
    }
    const handleUpload = (e) => {
        e.preventDefault();
        console.log(image);
        const uploadTask = storage.ref(`images/${image?.name}`).put(image);
        uploadTask.on("state_changed", (snapshot) => {
            const progressVal = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            setProgress(progressVal);
        }, (error) => {
            console.log(error);
            alert(error.message);
        }, () => {
            storage.ref("images").child(image.name).getDownloadURL().then(url => {
                db.collection("posts").add({ timestamp: firebase.firestore.FieldValue.serverTimestamp(), caption: caption, imageUrl: url, username: username });
                setProgress(0);
                setCaption("");
                setImage(null);
            }).catch(err => console.log("error", err));
        });
    }

    return (
        <div className="imageUpload">
            <progress className="imageUpload__progress" value={progress} max="100" />
            <form onSubmit={handleUpload}>
                <input type="text" value={caption} placeholder="Write caption here..." onChange={(e) => setCaption(e.target.value)} />
                <input type="file" onClick={handleChange} />
                <button>Upload</button>
            </form>
        </div>
    )
}

export default ImageUpload
