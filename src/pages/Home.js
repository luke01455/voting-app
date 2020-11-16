import React, { useState, useEffect } from 'react';
import { dbStore, auth } from '../services/firebase';
import { v4 as uuidv4 } from "uuid";

function Home() {

  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const ref = dbStore.collection("pages")


  // get database stuff real time
  function getPages() {
    setLoading(true)
    ref.onSnapshot((querySnapshot) => {
      const items = []
      querySnapshot.forEach((doc) => {
        items.push(doc.data())
      })
      setPages(items)
      setLoading(false)
    })
  }
  // get database stuff standard
  // function getPages2() {
  //   setLoading(true)
  //     ref.get().then((item) => {
  //       const items = item.docs.map((doc) => doc.data())
  //       setPages(items)
  //       setLoading(false)
  //     })
  // }
  useEffect (() => {
    getPages()
    //getPages2()
    // auth().onAuthStateChanged((user) => {
    //         if (user) {
    //     setLoading(false)
    //     setAuthenticated(true)
    //     } else {
    //     setLoading(false)
    //     setAuthenticated(false)
    //   }
    // })
  }, [])

  function addPage(newPage) {
    ref
      //.doc() use if for some reason you want that firestore generates the id
      .doc(newPage.id)
      .set(newPage)
      .catch((err) => {
        console.error(err);
      });
  }

  //DELETE FUNCTION
  function deletePage(page) {
    ref
      .doc(page.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }

  // EDIT FUNCTION
  function editPage(updatedPage) {
    setLoading();
    ref
      .doc(updatedPage.id)
      .update(updatedPage)
      .catch((err) => {
        console.error(err);
      });
  }
  if(loading) {
    return <h1> loading... </h1>
  }
  
    return  (
     <div>
       <h1> Pages </h1>
       <div className="inputContainer">
        <h3>Add New</h3>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button onClick={() => addPage({ title, desc, id: uuidv4() })}>
          Submit
        </button>
      </div>
       {pages.map((page) => (
         <div key={page.id}>
             <h4>{page.title}</h4>
             <div>{page.desc}</div>
       <div>
            <button onClick={() => deletePage(page)}>X</button>
            <button
              onClick={() =>
                editPage({ title: page.title, desc, id: page.id })
              }
            >
              Edit
            </button>
          </div>
        </div>
       ))}
     </div>
    )
}

export default Home;