import React from "react";
import { Box } from "grommet";

import 
  { deletePoll,
    editPoll,
    setAnswer
  } from '.././api'

const Poll = ({ poll, index, polls, question, userInfo, children }) => {
  const currentTime = new Date();
return (
  <Box direction="row" gap="xxsmall" justify="center" style={{ zIndex: "100"}}>
                <h4>{poll.question}</h4>
                <div> yay: {poll.yes.length}</div>
                <div> nay: {poll.no.length}</div>
                {
                  poll.endTime.toDate() > currentTime 
                  ? <div>
                    {children}
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
  </Box>
)}

export default Poll;
