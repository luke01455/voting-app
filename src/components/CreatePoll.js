import React, { useState } from "react";
import { Box } from "grommet";
import DateTimePicker from "react-datetime-picker";
import { v4 as uuidv4 } from "uuid";


import 
  { addNewPoll
  } from '../api'

const CreatePoll = ({ currentPage, userInfo }) => {

const [endTime, setEndTime] = useState(new Date());
const [question, setQuestion] = useState("");

function addPoll(newPoll) {
    addNewPoll(newPoll)
    setQuestion("");
  }

return (
  <Box direction="row" gap="xxsmall" justify="center" style={{ zIndex: "100"}}>
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
  </Box>
)}

export default CreatePoll;
