import { dbStore, auth } from "./services/firebase";
import firebase from "firebase/app";

async function getPages(currentPage) {
  const items = [];
  dbStore
    .collection("pages")
    .where("title", "==", currentPage)
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      })
      // const pageExists = items.filter((page) => {
      //   return page.title === currentPage;
      // });
    });
    console.log(items, "items")
  return items
}

function getPolls(currentPage) {
    const items = [];
  dbStore
    .collection("polls")
    .where("subforum", "==", currentPage)
    .onSnapshot((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      console.log(items, "polls");
    });
    return items
}

function addNewPoll(newPoll) {
  dbStore
    .collection("polls")
    //.doc() use if for some reason you want that firestore generates the id
    .doc(newPoll.id)
    .set(newPoll)
    .catch((err) => {
      console.error(err);
    });
}

function deletePoll(poll) {
  dbStore
    .collection("polls")
    .doc(poll.id)
    .delete()
    .catch((err) => {
      console.error(err);
    });
}

function editPoll(pollId, question) {
  dbStore
    .collection("polls")
    .doc(pollId)
    .update({ question })
    .catch((err) => {
      console.error(err);
    });
}

function addNewPage(newPage, currentPage, userInfo) {
  console.log(newPage, currentPage, userInfo)
  dbStore
    .collection("pages")
    //.doc() use if for some reason you want that firestore generates the id
    .doc(currentPage)
    .set(newPage)
    .catch((err) => {
      console.error(err);
    });
  dbStore
    .collection("users")
    .doc(userInfo)
    .update({ pages: firebase.firestore.FieldValue.arrayUnion(newPage.id) })
    .catch((err) => {
      console.error(err);
    });
}
function voteYes(poll, userInfo) {
    dbStore
      .collection("polls")
      .doc(poll)
      .update({ yes: firebase.firestore.FieldValue.arrayUnion(userInfo) })
      .catch((err) => {
        console.error(err);
      });
}

function voteNo(poll, userInfo) {
  dbStore
    .collection("polls")
    .doc(poll)
    .update({ no: firebase.firestore.FieldValue.arrayUnion(userInfo) })
    .catch((err) => {
      console.error(err);
    });
}

function setAnswer(result, pollId, index, polls) {

  if (polls[index].answer) {
    console.log("result already set");
  } else {
    // set answer
    dbStore
      .collection("polls")
      .doc(pollId)
      .update({ answer: result })
      .catch((err) => {
        console.error(err);
      });
    
    // find score
    let yes = polls[index].yes.length
    let no = polls[index].no.length
    let total = yes+no

    let pointsToGive = result === "yes" ? Math.floor(total / yes) : Math.floor(total / no)
    let pointsToDeduct = result === "yes" ? Math.floor(total / no) : Math.floor(total / yes)
    
    if(pointsToGive === Number.POSITIVE_INFINITY ) {
      pointsToGive = 1
    } 
    if(pointsToDeduct === Number.POSITIVE_INFINITY ) {
      pointsToDeduct = 1
    } 

    if(result === "yes") {
      polls[index].yes.forEach(user => {
        dbStore
        .collection("users")
        .doc(user)
        .update({ rating: firebase.firestore.FieldValue.increment(pointsToGive) })
        .catch((err) => {
          console.error(err);
        });
      })
      polls[index].no.forEach(user => {
        dbStore
        .collection("user")
        .doc(user)
        .update({ rating: firebase.firestore.FieldValue.decrement(pointsToDeduct) })
        .catch((err) => {
          console.error(err);
        });
      })
    } else {
      polls[index].no.forEach(user => {
        dbStore
        .collection("user")
        .doc(user)
        .update({ rating: firebase.firestore.FieldValue.increment(pointsToGive) })
        .catch((err) => {
          console.error(err);
        });
      })
      polls[index].yes.forEach(user => {
        dbStore
        .collection("user")
        .doc(user)
        .update({ rating: firebase.firestore.FieldValue.decrement(pointsToGive) })
        .catch((err) => {
          console.error(err);
        });
      })
    }

      }
}

function logout() {
  firebase.auth().signOut();
}

export { getPages,
  getPolls,
  addNewPoll,
  deletePoll,
  editPoll,
  addNewPage,
  voteYes,
  voteNo,
  logout,
  setAnswer
}
