import React, { useState, useEffect } from "react";
import { dbStore, auth } from "../services/firebase";
import { v4 as uuidv4 } from "uuid";

function HomePage() {
  const currentPage = window.location.pathname.split("/")[1];

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [desc, setDesc] = useState("");
  const [subCollection, setSubCollection] = useState("");

  const ref = dbStore.collection("pages");

  // get database stuff real time
  function getPages() {
    setLoading(true)
    dbStore.collection("pages").onSnapshot((querySnapshot) => {
      const items = []
      querySnapshot.forEach((doc) => {
        items.push(doc.data())
      });
      console.log(items, "1234")
      const pageExists = items.filter((page) => {
        return page.title === currentPage;
      });
      setPages(pageExists)
      setLoading(false)
    });
  }

  function getSubCollection() {
    setLoading(true);
    dbStore
      .collection("pages")
      .doc(currentPage)
      .collection("polls")
      .onSnapshot((querySnapshot) => {
        const items = []
        querySnapshot.forEach((doc) => {
          console.log(doc.data(), "subcolData")
          items.push(doc.data())
        });
        setSubCollection(items)
        setLoading(false)
      });
  }

  useEffect(() => {
    getSubCollection();
    getPages();
    //getPages2()
    auth().onAuthStateChanged((user) => {
      if (user) {
        setLoading(false);
        setAuthenticated(true);
      } else {
        setLoading(false);
        setAuthenticated(false);
      }
    });
  }, []);

  function addPage(newPage) {
    ref
      //.doc() use if for some reason you want that firestore generates the id
      .doc(currentPage)
      .set(newPage)
      .catch((err) => {
        console.error(err);
      });

      const cityRef = dbStore.collection('pages').doc(currentPage).collection('polls')

      cityRef.add({
        question: 'Will this subreddit take off?',
        yay: 0,
        nay: 0,
        id: uuidv4()
    }, { merge: true })
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
    ref
      .doc(updatedPage.id)
      .update(updatedPage)
      .catch((err) => {
        console.error(err);
      });
  }
  if (loading) {
    return <h1> loading... </h1>;
  }
  console.log(subCollection, "1234456sub")
  return (
    <div>
      {pages.length === 0 ? (
        <div className="inputContainer">
          This page doesn't exist, want to start a subforum?
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button
            onClick={() => addPage({ title: currentPage, desc, id: uuidv4() })}
          >
            Submit
          </button>
        </div>
      ) : (
        <div>
          {pages.map((page) => (
            <div key={page.id}>
              <h4>{page.title}</h4>
              <div>{page.desc}</div>
              <div></div>
            </div>
          ))}
          {subCollection.map((subCollection) => (
            <div key={subCollection.id}>
              <h4>{subCollection.question}</h4>
              <div> yay: {subCollection.yay}</div>
              <div> nay: {subCollection.nay}</div>
              <div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
