import React, { useState } from "react";
import { Box } from "grommet";
import { v4 as uuidv4 } from "uuid";


import 
  { addNewPage
  } from '../api'

const CreatePoll = ({ currentPage, userInfo }) => {

const [desc, setDesc] = useState("");

function addPage(newPage) {
    addNewPage(newPage, currentPage, userInfo)
    setDesc("")
  }

return (
  <Box direction="row" gap="xxsmall" justify="center" style={{ zIndex: "100"}}>
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
  </Box>
)}

export default CreatePoll;
