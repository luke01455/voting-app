import React, { useState, useEffect } from "react";
import { dbStore, auth } from "../services/firebase";
import firebase from "firebase/app";
import { v4 as uuidv4 } from "uuid";

function HomePage() {

  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  const [polls, setPolls] = useState([]);

  // get database stuff real time
  function getPages() {
    setLoading(true);
    dbStore
      .collection("pages")
      .where("creator", "==", userInfo)
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
      .where("creator", "==", userInfo)
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
    
    getPages();
    getPolls();
  }, []);


  if (loading) {
    return <h1> loading... </h1>;
  }
  return (
    <div>
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
              <div> nay: {poll.no.length}</div>
       
            </div>
          ))}
    </div>
    )
}

export default HomePage;
