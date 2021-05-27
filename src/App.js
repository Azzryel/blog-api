import './App.css';
import { useState, useEffect } from 'react';
import axios from "axios";

function App() {

  const [ posts, setPosts ] = useState([]);
  const [ comments, setComments ] = useState([]);
  const [ comment, setComment ] = useState("");
  const [ user, setUser ] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/blog")
    .then((res) => {
        setPosts(res.data);
      })
      .catch((error) => {
        console.error(error)
      })

      axios.get("http://localhost:3001/blog/comments")
      .then((res) => {
          setComments(res.data);
        })
        .catch((error) => {
          console.error(error)
        })

  }, []);

  function handleChangeUser (e) {
    setUser(e.target.value);
  }

  function handleChangeComment (e) {
    setComment(e.target.value);
  }

  function handleSubmit (e) {
    e.preventDefault()

    axios.post("http://localhost:3001/blog/comments", {
      blogpost: e.target.dataset.blogpost,
      user,
      comment
    })
    .then( (res) => {
        console.log(res.data)
    })
    .catch( (err) => {
      console.log(err)
    });

    window.location.reload(); 

  }

  function createMarkup(markup) {
    return {__html: markup};
  }

  function htmlDecode(content) {
    let e = document.createElement('div');
    e.innerHTML = content;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
  }

  return (
    <div className="App">
      <p>Hello</p>
      <div>
        { posts.map( post => {
          return (
            <div>
              <h4> {post.title} </h4>
              <div dangerouslySetInnerHTML={(createMarkup(htmlDecode(post.text)))}></div>
              <div>
                { comments.map( comment => {
                  return (
                    (comment.blogpost._id === post._id) ? ( 
                    <div>
                      <h6>{comment.user}</h6>
                      <p>{comment.comment}</p>
                    </div>
                    ) : (
                      <></>
                    )
                    );
                } ) }
              </div>
              <form onSubmit={handleSubmit} data-blogpost={post._id}>
                <input onChange={handleChangeUser} type="text" id="user" name="user" placeholder="Optional username" />
                <input onChange={handleChangeComment} type="text" id="comment" name="comment" placeholder="Your comment" required />
                <button>OK</button>
              </form>
            </div>
          );
        }) }

      </div>

    </div>
  );
}

export default App;
