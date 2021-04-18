
import { Avatar, Button, Input, Modal } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React , { useState, useEffect } from 'react';
import './App.css';
import ImageUpload from './Comps/ImageUpload';
import Post from './Comps/Post';
import {db, auth} from './firebase';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function App() {
  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [uploadStyle, setUploadStyle] = useState({
    display: 'none'
  });
  const [show, setShow] = useState(true);

  useEffect(() => {
   const unSubscribe=  auth.onAuthStateChanged((authUser) => {
      if(authUser){
        setUser(authUser);
      }else{
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup action here...
      unSubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot( snap => {
      setPosts(snap.docs.map( doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, [])

  const signup = (event) => {
    event.preventDefault();

    auth.createUserWithEmailAndPassword(email, password)
    .then((authUser) => {
      return authUser.user.updateProfile({
        displayName: username
      })
    })
    .catch(error => alert(error.message))

    setOpen(false);
  }

  const signin = (event) => {
    event.preventDefault();

    auth.signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message))

    setOpenSignIn(false);
  }

  const uploadHandler = () => {
    if(show){
      setUploadStyle({display: 'flex'});
    }else{
      setUploadStyle({display: 'none'});
    } 
    setShow(!show);
  }
  
  
  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""/>
            </center>
            <Input 
              className="app__input"
              placeholder="username" 
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}/>
            <Input 
              className="app__input"
              placeholder="email" 
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}/>
            <Input 
              className="app__input"
              placeholder="password" 
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}/>
            <Button type="submit" onClick={signup}>Sign up</Button>
          </form>
          
        </div>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
      >
        <div style={modalStyle} className={classes.paper}>
          <form className="app__signup">
            <center>
              <img className="app__headerImage"
                src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
                alt=""/>
            </center>
            <Input 
              className="app__input"
              placeholder="email" 
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}/>
            <Input 
              className="app__input"
              placeholder="password" 
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}/>
            <Button type="submit" onClick={signin}>Sign in</Button>
          </form>
          
        </div>
      </Modal>
      <div className="app__header">
        <img className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""/>

        {user ? 
        <div className="app__logoutContainer">
          <Button onClick={uploadHandler}>Upload</Button>
          <Button onClick={() => auth.signOut()}>logout</Button> 
          <Avatar className="post__avatar" alt={user.displayName} src="/static/images/avatar/1.jpg" />
        </div>
          : 
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)}>sign In</Button>
            <Button onClick={() => setOpen(true)}>sign up</Button>
          </div>
        }
      </div>
      
      <div className="app__posts">
        <div className="app__postsLeft">
          {
            posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
            ))
          }
        </div>
        <div className="app__postsRight">
          { user && 
              <div className="post__header">
                  <Avatar className="post__avatar" alt={user.displayName} src="/static/images/avatar/1.jpg" />
                  <h3>{user.displayName}</h3>
              </div>
          }
           
        </div>
      </div>

      

    {user ? <ImageUpload style={uploadStyle} username={user.displayName} setUploadStyle={setUploadStyle} setShow={setShow}/> : <h3 style={{textAlign: 'center', borderTop: '1px solid lightgray', padding: '15px', position: 'sticky', bottom: '0', backgroundColor: 'white'}}>please login to upload image</h3>}
    </div>
  );
}

export default App;
