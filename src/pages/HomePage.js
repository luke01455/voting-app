import React, { useState, useEffect } from "react";
import { dbStore, auth } from "../services/firebase";
import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";

function HomePage() {
  const currentPage = window.location.pathname.split("/")[1];

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  const [desc, setDesc] = useState("");
  const [question, setQuestion] = useState("");
  const [polls, setPolls] = useState([]);

  // get database stuff real time
  function getPages() {
    setLoading(true);
    dbStore
      .collection("pages")
      .where("title", "==", currentPage)
      .onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        console.log(items, "pages");
        // const pageExists = items.filter((page) => {
        //   return page.title === currentPage;
        // });
        setPages(items);
        setLoading(false);
      });
  }
  function getPolls() {
    setLoading(true);
    dbStore
      .collection("polls")
      .where("subforum", "==", currentPage)
      .onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        console.log(items, "polls");
        setPolls(items);
        setLoading(false);
      });
  }

  useEffect(() => {
    getPages();
    getPolls();
    //getPages2()
    auth().onAuthStateChanged((user) => {
      if (user) {
        setLoading(false);
        setAuthenticated(true);
      } else {
        setLoading(false);
        setAuthenticated(false);
      }
      setUserInfo(auth().currentUser.uid);
    });
  }, []);

  function addPage(newPage) {
    dbStore
      .collection("pages")
      //.doc() use if for some reason you want that firestore generates the id
      .doc(currentPage)
      .set(newPage)
      .catch((err) => {
        console.error(err);
      });
  }

  function addPoll(newPoll) {
    dbStore
      .collection("polls")
      //.doc() use if for some reason you want that firestore generates the id
      .doc(newPoll.id)
      .set(newPoll)
      .catch((err) => {
        console.error(err);
      });
    setQuestion("");
  }

  //DELETE FUNCTION
  function deletePage(page) {
    dbStore
      .collection("pages")
      .doc(page.id)
      .delete()
      .catch((err) => {
        console.error(err);
      });
  }

  // EDIT FUNCTION
  function editPage(updatedPage) {
    dbStore
      .collection("pages")
      .doc(updatedPage.id)
      .update(updatedPage)
      .catch((err) => {
        console.error(err);
      });
  }
  function voteYay(poll, index) {
    if (
      polls[index].no.includes(userInfo) ||
      polls[index].yes.includes(userInfo)
    ) {
      console.log("already voted")
    } else {
      dbStore
        .collection("polls")
        .doc(poll)
        .update({ yes: firebase.firestore.FieldValue.arrayUnion(userInfo) })
        .catch((err) => {
          console.error(err);
        });
    }
  }
  function voteNay(poll, index) {
    if (
      polls[index].no.includes(userInfo) ||
      polls[index].yes.includes(userInfo)
    ) {
      console.log("already voted")
    } else {
      dbStore
        .collection("polls")
        .doc(poll)
        .update({ no: firebase.firestore.FieldValue.arrayUnion(userInfo) })
        .catch((err) => {
          console.error(err);
        });
    }
  }
  if (loading) {
    return <h1> loading... </h1>;
  }

  return (
    <div>
      {pages.length === 0 ? (
        <div>
          { authenticated 
          ? <div className="inputContainer">
          This page doesn't exist, want to start a subforum?
          <textarea value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button
            onClick={() => addPage({ title: currentPage, desc, id: uuidv4(), creator: userInfo })}
          >
            Submit
          </button>
        </div> : <div> Log in or create an account to make this page into a subforum </div>}
        </div>
      ) : (
        <div>
          { authenticated 
          ?   <div className="inputContainer">
          Create a poll
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            onClick={() =>
              addPoll({
                subforum: currentPage,
                question,
                id: uuidv4(),
                yes: [],
                no: [],
              })
            }
          >
            Submit
          </button>
        </div>
        : <div> create an account or log in to make a poll </div>}
          {pages.map((page) => (
            <div key={page.id}>
              <h4>{page.title}</h4>
              <div>{page.desc}</div>
            </div>
          ))}
          {polls.map((poll, index) => (
            <div key={poll.id}>
              <h4>{poll.question}</h4>
              <div> yay: {poll.yes.length}</div>
              <button onClick={() => voteYay(poll.id, index)}>yay</button>
              <div> nay: {poll.no.length}</div>
              <button onClick={() => voteNay(poll.id, index)}>nay</button>
              <div></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HomePage;
