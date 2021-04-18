import { Button, Input } from '@material-ui/core';
import React, { useState } from 'react';
import { db, storage } from '../firebase';
import firebase from 'firebase/app';
import './ImageUpload.css';

function ImageUpload({ username, style, setUploadStyle, setShow }) {
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
    const [image, setImage] = useState(null);



    const imageHandler = (event) => {
        const uploadedImage= event.target.files[0];
        setImage(uploadedImage);
    };

    const clickHandler = (event) => {
        event.preventDefault();
        const storageRef = storage.ref(`images/${image.name}`);

        storageRef.put(image).on('state_changed', (snaps) => {
            let percentage= (snaps.bytesTransferred/snaps.totalBytes) * 100;
            setProgress(percentage);
        }, (error) => {
            console.log(error.message);
        }, async () => {
            const url = await storageRef.getDownloadURL();
            db.collection('posts').add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: caption,
                imageUrl: url,
                username: username
            })
            setProgress(0);
            setCaption('');
            setImage(null);
            setUploadStyle({display: 'none'});
            setShow(true);
        })
    }

    return (
        <div className="ImageUpload" style={style}>
            <form className="ImageUpload__form">
                <progress className="ImageUpload__progressBar" value={progress} max="100"/>
                <Input className="ImageUpload__inputField" type="text" placeholder="caption..." value={caption} onChange={(event) => setCaption(event.target.value)}/>
                <Input className="ImageUpload__inputField" type="file" onChange={imageHandler}/>
                <Button type="submit" onClick={clickHandler}>Upload</Button>
            </form>
            
        </div>
    )
}

export default ImageUpload;
