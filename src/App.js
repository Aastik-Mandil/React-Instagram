import React, { useState, useEffect } from 'react';
import './App.css';
import Post from './Post';
import ImageUpload from './ImageUpload';
import { auth, db } from './firebase';
import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';

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
    boxShadow: theme.shadows,
    padding: theme.spacing(2, 4, 3),
  },
}));

function App() {
  const classes = useStyles();
  const { modalStyle } = useState(getModalStyle);

  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log(authUser);
        setUser(authUser);
      } else {
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    }
  }, [user, username]);

  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, post: doc.data()
      })));
    });
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
      .then(authUser => (authUser.user.updateProfile({ displayName: username })))
      .catch(err => (alert(err.message)));
    setOpen(false);
  };
  const handleSignin = (e) => {
    e.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
      .catch(err => (alert(err.message)));
    setOpenSignIn(false);
  }

  return (
    <div className="app">

      <Modal open={open} onClose={() => setOpen(false)}>
        <div className={classes.paper} style={modalStyle}>
          <form className="app__signup">
            <center>
              <img src="" alt="" className="app__headerImage" />
            </center>
            <Input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" />
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            <Button onClick={handleLogin}>Register</Button>
          </form>
        </div>
      </Modal>

      <Modal open={openSignIn} onClose={() => setOpenSignIn(false)}>
        <div className={classes.paper} style={modalStyle}>
          <form className="app__signup">
            <center>
              <img src="" alt="" className="app__headerImage" />
            </center>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" />
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
            <Button onClick={handleSignin}>Login</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img src="" alt="Instragram Logo" className="app__headerImage" />
        {user ? (
          <Button onClick={() => auth.signOut()}>Logout</Button>
        ) : (
            <div className="app__loginContainer">
              <Button onClick={() => setOpenSignIn(true)}>Sign in</Button>
              <Button onClick={() => setOpen(true)}>Sign up</Button>
            </div>
          )}
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          
          {posts.map(({ id, post }) => (
            <Post imageUrl={post.imageUrl} username={post.username} caption={post.caption} key={id} postId={id} user={user} />
          ))}
        </div>
        <div className="app__postsRight">
          <InstagramEmbed url={`https:/www.instagram.com/p/B_uf9dmAGPw/`} maxWidth={320} hideCaption={false} containerTagName="div" protocol="" injectScript onLoading={() => { }} onSuccess={() => { }} onAfterRender={() => { }} onFailure={() => { }} />
        </div>
      </div>

      {user?.displayName ? (
        <ImageUpload username={user?.displayName} />
      ) : (
          <h3>Sorry you need to login to upload</h3>
        )}

    </div>
  );
}

export default App;
