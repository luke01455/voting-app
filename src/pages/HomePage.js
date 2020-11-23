import React, { useState, useEffect, useRef } from "react";
import { dbStore, auth } from "../services/firebase";

import Poll from '../components/Poll'
import CreatePoll from '../components/CreatePoll'
import CreatePage from '../components/CreatePage'
import PageHeading from '../components/PageHeading'
import firebase from "firebase/app";

import 
  { addNewPage,
    voteYes,
    voteNo
  } from '../api'

import { v4 as uuidv4 } from "uuid";

function HomePage() {
  const currentPage = window.location.pathname.split("/")[1];

  const [pages, setPages] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

  const [authenticated, setAuthenticated] = useState(false);
  const [userInfo, setUserInfo] = useState("");

  const [desc, setDesc] = useState("");
  const [question, setQuestion] = useState("");
 
  const [endTime, setEndTime] = useState(new Date());


function getPages () {
    setLoading(true)
    dbStore
      .collection("pages")
      .where("title", "==", currentPage)
      .onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        })
        // const pageExists = items.filter((page) => {
        //   return page.title === currentPage;
        // });
        setPages(items)
      });
      setLoading(false)
  }
  
  function getPolls () {
    setLoading(true)
    dbStore
      .collection("polls")
      .where("subforum", "==", currentPage)
      .onSnapshot((querySnapshot) => {
        const items = [];
        querySnapshot.forEach((doc) => {
          items.push(doc.data());
        });
        console.log(items, "polls");
        setPolls(items)
      });
      setLoading(false)
  }

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user) {
        setLoading(false)
        setAuthenticated(true)
      } else {
        setLoading(false)
        setAuthenticated(false)
      }
      setUserInfo(auth().currentUser.uid)
    })
    getPages()
    getPolls()
  }, []);

  function addPage(newPage) {
    console.log(newPage, "new")
    addNewPage(newPage, currentPage, userInfo)
  }

  function voteYay(poll, index) {
    if (
      polls[index].no.includes(userInfo) ||
      polls[index].yes.includes(userInfo)
    ) {
      console.log("already voted");
    } else {
      voteYes(poll, userInfo)
    }
  }

  function voteNay(poll, index) {
    if (
      polls[index].no.includes(userInfo) ||
      polls[index].yes.includes(userInfo)
    ) {
      console.log("already voted")
    }  else {    
      voteNo(poll, userInfo)
    }
  }

  if (loading) {
    return <h1> loading... </h1>;
  }

  return (
    <div>
      {pages.length === 0 ? (
        <div>
          {authenticated ? (
            <CreatePage currentPage={currentPage} userInfo={userInfo} />
          ) : (
            <div>
              {" "}
              Log in or create an account to make this page into a subforum{" "}
            </div>
          )}
        </div>
      ) : (
        <div>
          {authenticated ? (
            <CreatePoll currentPage={currentPage} userInfo={userInfo} />
          ) : (
            <div> create an account or log in to make a poll </div>
          )}
          {pages.map((page) => {
            console.log(pages, "pages inmap")
            return(
              <PageHeading key={page.id} page={page} />
            )

            })}
          {polls.length !== 0 
          ? polls.map((poll, index) => {
            console.log(polls, "inmap")
            return (
              <Poll key={poll.id} poll={poll} index={index} polls={polls}
              userInfo={userInfo} question={question}>
                    <button onClick={() => voteYay(poll.id, index)}> vote yay</button>
                    <button onClick={() => voteNay(poll.id, index)}> vote nay</button>
              </Poll>
            );
          }) 
          : null}
        </div>
      )}
    </div>
  );
}

export default HomePage;
