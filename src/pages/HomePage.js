import React, { useState, useEffect } from 'react';
import { dbStore, auth } from '../services/firebase';
import { v4 as uuidv4 } from "uuid";

function HomePage() {

    const currentPage = window.location.pathname.split("/")[1]

  const [pages, setPages] = useState([])
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [desc, setDesc] = useState("");

  const ref = dbStore.collection("pages")


  // get database stuff real time
  function getPages() {
    setLoading(true)
    ref.onSnapshot((querySnapshot) => {
      const items = []
      querySnapshot.forEach((doc) => {
          console.log(doc.data, "item")
            items.push(doc.data())
      })
      const pageExists = items.filter((page) => {
          return page.title === currentPage
      })
      setPages(pageExists)
      setLoading(false)
    })
  }

  useEffect (() => {
    getPages()
    //getPages2()
    auth().onAuthStateChanged((user) => {
            if (user) {
        setLoading(false)
        setAuthenticated(true)
        } else {
        setLoading(false)
        setAuthenticated(false)
      }
    })
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
         {pages.length === 0 
         ? <div className="inputContainer">
                    This page doesn't exist, want to start a subforum?

        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
        <button onClick={() => addPage({ title: currentPage, desc, id: uuidv4() })}>
          Submit
        </button>
      </div>
         : <div>
         {pages.map((page) => (
         <div key={page.id}>
             <h4>{page.title}</h4>
             <div>{page.desc}</div>
         <div>
           </div>
         </div>
        ))}
        </div>
         }

     </div>
    )
}

export default HomePage;