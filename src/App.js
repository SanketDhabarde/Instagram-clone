
import React , { useState } from 'react';
import './App.css';
import Post from './Comps/Post';

function App() {

  const [posts, setPosts] = useState([{
    username: 'sankettt',
    caption: 'wow really cool',
    imageUrl: 'https://images.unsplash.com/photo-1618473962497-68e8d4e0680e?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDZ8NnNNVmpUTFNrZVF8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  },{
    username: 'sankettt',
    caption: 'wow really cool',
    imageUrl: 'https://images.unsplash.com/photo-1618473962497-68e8d4e0680e?ixid=MnwxMjA3fDB8MHx0b3BpYy1mZWVkfDZ8NnNNVmpUTFNrZVF8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'
  }]);

  return (
    <div className="app">
      <div className="app__header">
        <img className="app__headerImage"
            src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
            alt=""/>
      </div>
      <h1>welcome to instagram</h1>

      {
        posts.map(post => (
          <Post username={post.username} caption={post.caption} imageUrl={post.imageUrl}/>
        ))
      }
    </div>
  );
}

export default App;
