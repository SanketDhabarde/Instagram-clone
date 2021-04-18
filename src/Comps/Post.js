import React, { useEffect, useState } from 'react';
import './Post.css';
import { Avatar } from '@material-ui/core';
import { db } from '../firebase';
import firebase from 'firebase/app';


function Post({postId, user, username, caption, imageUrl}) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');

    useEffect(() => {
        let unSubscribe;
        if(postId){
            unSubscribe = db.collection('posts')
            .doc(postId)
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map( doc => doc.data()));
            });
        };

        return () => {
            unSubscribe();
        }
    }, [postId]);

   const commentHandler = (event) => {
       event.preventDefault();
       db.collection('posts').doc(postId)
       .collection('comments')
       .add({
           text: comment,
           username: user.displayName,
           timestamp: firebase.firestore.FieldValue.serverTimestamp()
       });
       setComment('');
   }; 

    return (
        <div className="post">
            <div className="post__header">
                <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg" />
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} alt=""/>
            <h4 className="post__text"><strong>{username}</strong> {caption} </h4>
            
            <div className="post__comments">
                { comments.map( comment => (
                    <p key={comment.timestamp}>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>  
                ))}
            </div>
            
            {user && 
                <form className="post__commentBox">
                    <input 
                        className="post__input"
                        type="text"
                        value={comment}
                        placeholder="Add a comment..."
                        onChange={(e) => setComment(e.target.value)}/>
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={commentHandler}
                    >Post</button>
                </form>  
            }
            
        
        </div>
    )
}

export default Post;
