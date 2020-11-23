import React, { useState, useEffect, useRef } from "react";
import { dbStore, auth } from "../services/firebase";
import DateTimePicker from "react-datetime-picker";
import firebase from "firebase/app";
import 
  { addNewPoll,
    deletePoll,
    editPoll,
    addNewPage,
    voteYes,
    voteNo,
    logout,
    setAnswer
  } from '../api'
import { v4 as uuidv4 } from "uuid";

function HomePage() {
  const currentPage = window.location.pathname.split("/")[1];
  const currentTime = new Date();

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

  function addPoll(newPoll) {
    addNewPoll(newPoll)
    setQuestion("");
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
            <div className="inputContainer">
              This page doesn't exist, want to start a subforum?
              <textarea
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
              <button
                onClick={() =>
                  addPage({
                    title: currentPage,
                    desc,
                    id: uuidv4(),
                    creator: userInfo,
                  })
                }
              >
                Submit
              </button>
            </div>
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
            <div className="inputContainer">
              Create a poll
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <DateTimePicker onChange={setEndTime} value={endTime} />
              <button
                onClick={() =>
                  addPoll({
                    subforum: currentPage,
                    question,
                    id: uuidv4(),
                    yes: [],
                    no: [],
                    creator: userInfo,
                    endTime,
                  })
                }
              >
                Submit
              </button>
            </div>
          ) : (
            <div> create an account or log in to make a poll </div>
          )}
          {pages.map((page) => {
            console.log(pages, "pages inmap")
            return(
              <div key={page.id}>
              <h4>{page.title}</h4>
              <div>{page.desc}</div>
            </div>
            )

            })}
          {polls.map((poll, index) => {
            console.log(polls, "inmap")
            return (
              <div key={poll.id}>
                <h4>{poll.question}</h4>
                <div> yay: {poll.yes.length}</div>
                <div> nay: {poll.no.length}</div>
                {
                  poll.endTime.toDate() > currentTime 
                  ? <div>
                    <button onClick={() => voteYay(poll.id, index)}> vote yay</button>
                    <button onClick={() => voteNay(poll.id, index)}> vote nay</button>
                  </div>
                  : <div/>
                }
                <button onClick={() => deletePoll(poll)}>X</button>
                <div>{poll.endTime.toDate().toISOString()}</div>
                <div>
                  {poll.creator === userInfo && poll.endTime.toDate() < currentTime ? (
                    <div>
                      <button onClick={() => setAnswer("yes", poll.id, index, polls)}>
                        set answer yay
                      </button>
                      <button onClick={() => setAnswer("no", poll.id, index, polls)}>
                        set answer nay
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
                  <div>the answer was {poll.result}</div>
                <button onClick={() => editPoll(poll.id, question)}>Edit</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default HomePage;
