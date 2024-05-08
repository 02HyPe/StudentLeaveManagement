import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Table,
  Thead,
  TabList,
  Input,
  Button,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
} from "@chakra-ui/react";
import Header from "../Components/Header";
import Sidebar from "../Components/Sidebar";
import axios from "axios";
import "../Leaves/LeaveRequest.css";
import Spinner from "../Components/Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeaveRequest = () => {
  const headers = { authorization: `Bearer ` + localStorage.getItem(`token`) };
  const [loading, setLoading] = useState(true);
  const [leaves, setLeaves] = useState([]);
  const [count, setCount] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  const updateStatus = async (id, status) => {
    try {
      let approve;
      if (status === "Approved") {
        approve = true;
        toast.success("Approved");
      } else {
        approve = false;
        toast.success("Rejected");
      }
      const res = await axios.put(
        "http://localhost:9000/moderator/updateLeave",
        { leave_id: id, approve: approve },
        {
          headers: headers,
        }
      );
      console.log(res);
      if (res.status === 200) {
        setLeaves((prevLeaves) =>
          prevLeaves.map((leave) =>
            leave.leave_id === id ? { ...leave, leaveStatus: status } : leave
          )
        );
        const updatedCount = { ...count };
        updatedCount[status.toLowerCase()] += 1;
        updatedCount["pending"] -= 1;
        setCount(updatedCount);
        showToast(status);
      }
    } catch (err) {
      console.log("cannot update ", err);
    }
  };

  const mentorLeaves = () => {
    axios
      .get("http://localhost:9000/moderator/mentorLeaveList", {
        headers: headers,
      })
      .then((res) => {
        console.log(res.data);
        setLeaves(res.data.leaveData);
        setCount({
          pending: res.data.pendingLeaves,
          approved: res.data.approvedLeaves,
          rejected: res.data.rejectedLeaves,
        });
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  };

  const leaveList = () => {
    axios
      .get("http://localhost:9000/admin/leaveList", {
        headers: headers,
      })
      .then((res) => {
        console.log(res.data);
        setLeaves(res.data.leaveData);
        setCount({
          pending: res.data.pendingLeaves,
          approved: res.data.approvedLeaves,
          rejected: res.data.rejectedLeaves,
        });
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  };
  useEffect(() => {
    axios
      .get("http://localhost:9000/admin/leaveList", {
        headers: headers,
      })
      .then((res) => {
        console.log(res.data);
        setLoading(true);
        setLeaves(res.data.leaveData);
        setCount({
          pending: res.data.pendingLeaves,
          approved: res.data.approvedLeaves,
          rejected: res.data.rejectedLeaves,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  }, []);

  const token = localStorage.getItem(`token`);
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  console.log(tokenPayload);
  const userName = tokenPayload.name;
  const userType = tokenPayload.type;

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };

  return (
    <div className="grid-request">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />

      <main className="main-request">
        {loading ? (
          <Spinner />
        ) : (
          <div>
            {userType === "Admin" && (
              <VStack
                minH={"100vh"}
                className="w-100vw"
                spacing={4}
                bg={"rgb(250, 247, 247)"}
                p={"1rem"}
              >
                <Box
                  className="changeDir"
                  pt={"2rem"}
                  w={"100%"}
                  display={"flex"}
                  gap={4}
                >
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid green"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text fontWeight={"500"}>Pending Requests</Text>
                    <Text fontSize={"2.5rem"}>{count.pending}</Text>
                  </Box>
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid gray"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text>Approved Requests</Text>
                    <Text fontSize={"2.5rem"}>{count.approved}</Text>
                  </Box>
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid red"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text>Rejected Requests</Text>
                    <Text fontSize={"2.5rem"}>{count.rejected}</Text>
                  </Box>
                </Box>
                <Box
                  className="changeDir gap"
                  pt={"1rem"}
                  w={"100%"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Text fontWeight={"bold"} fontSize={"1.5rem"}>
                    Leaves Requests
                  </Text>
                  <Button
                    backgroundColor={"#e53e3e!important"}
                    borderRadius={0}
                    onClick={() => leaveList()}
                    minWidth={"max-content"}
                  >
                    Student-Leaves
                  </Button>
                  <Button
                    backgroundColor={"#e53e3e!important"}
                    borderRadius={0}
                    onClick={() => mentorLeaves()}
                    minWidth={"max-content"}
                  >
                    Mentor-Leaves
                  </Button>
                  <Box display={"flex"} gap={2}>
                    <Input placeholder={"Name"} borderRadius={0} type="text" />
                    <Button
                      backgroundColor={"#e53e3e!important"}
                      borderRadius={0}
                      onClick={() => handleClick()}
                      minWidth={"max-content"}
                    >
                      Search
                    </Button>
                  </Box>
                </Box>
                <Box
                  width={"100%"}
                  overflowX={"scroll"}
                  py={4}
                  // shadow="md"
                  borderWidth="1px"
                  boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                >
                  {/* <Text>{`Type: ${leave.type}, Status: ${leave.status}`}</Text> */}

                  <Table
                    width={"100%"}
                    backgroundColor={"#ffffff"}
                    borderWidth={"2px"}
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                  >
                    <Thead boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}>
                      <Tr>
                        <Th textAlign={"left"} padding="13px">
                          Student
                        </Th>
                        <Th textAlign={"left"}>Leave Type</Th>
                        <Th textAlign={"left"}>From</Th>
                        <Th textAlign={"left"}>To</Th>
                        <Th textAlign={"left"}>Mentor</Th>
                        <Th textAlign={"left"}>Documents</Th>
                        <Th textAlign={"left"}>Description</Th>
                        <Th textAlign={"left"}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {leaves.map((leave) => (
                        <Tr
                          key={Math.random()}
                          boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                        >
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {leave.userFirstName + " " + leave.userLastName}
                          </Td>

                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {leave.typeOfLeave}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {new Date(leave.dateFrom).toLocaleDateString()}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {new Date(leave.dateTo).toLocaleDateString()}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {leave.mentorFirstName + " " + leave.mentorLastName}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            inlineSize={"120px"}
                            hyphens={"manual"}
                            overflowWrap={"break-word"}
                          >
                            {!leave.attachment ? (
                              <span>None</span>
                            ) : (
                              <a href="">
                                <span>{leave.attachment["fileName"]}</span>
                              </a>
                            )}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            // display={"inline"}
                          >
                            {leave.description}
                          </Td>

                          {leave.leaveStatus === "Pending" && (
                            <Td
                              padding="20px"
                              boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                              color={"grey"}
                            >
                              {leave.leaveStatus}
                            </Td>
                          )}
                          {leave.leaveStatus === "Approved" && (
                            <Td
                              padding="20px"
                              boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                              color={"blue"}
                            >
                              {leave.leaveStatus}
                            </Td>
                          )}
                          {leave.leaveStatus === "Rejected" && (
                            <Td
                              padding="20px"
                              boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                              color={"red"}
                            >
                              {leave.leaveStatus}
                            </Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            )}
            {userType === "Moderator" && (
              <VStack
                minH={"100vh"}
                className="w-100vw"
                spacing={4}
                bg={"rgb(250, 247, 247)"}
                p={"1rem"}
              >
                <Box
                  className="changeDir"
                  pt={"2rem"}
                  w={"100%"}
                  display={"flex"}
                  gap={4}
                >
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid green"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text fontWeight={"500"}>Pending Requests</Text>
                    <Text fontSize={"2.5rem"}>{count.pending}</Text>
                  </Box>
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid gray"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text>Approved Requests</Text>
                    <Text fontSize={"2.5rem"}>{count.approved}</Text>
                  </Box>
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid red"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text>Rejected Requests</Text>
                    <Text fontSize={"2.5rem"}>{count.rejected}</Text>
                  </Box>
                </Box>
                <Box
                  className="changeDir gap"
                  pt={"1rem"}
                  w={"100%"}
                  display={"flex"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Text fontWeight={"bold"} fontSize={"1.5rem"}>
                    Leaves Requests
                  </Text>
                  <Button
                    backgroundColor={"#e53e3e!important"}
                    borderRadius={0}
                    onClick={() => leaveList()}
                    minWidth={"max-content"}
                  >
                    Student-Leaves
                  </Button>
                  <Button
                    backgroundColor={"#e53e3e!important"}
                    borderRadius={0}
                    onClick={() => mentorLeaves()}
                    minWidth={"max-content"}
                  >
                    Mentor-Leaves
                  </Button>
                  <Box display={"flex"} gap={2}>
                    <Input placeholder={"Name"} borderRadius={0} type="text" />
                    <Button
                      backgroundColor={"#e53e3e!important"}
                      borderRadius={0}
                      onClick={() => handleClick()}
                      minWidth={"max-content"}
                    >
                      Search
                    </Button>
                  </Box>
                </Box>
                <Box
                  width={"100%"}
                  overflowX={"scroll"}
                  py={4}
                  // shadow="md"
                  borderWidth="1px"
                  boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                >
                  {/* <Text>{`Type: ${leave.type}, Status: ${leave.status}`}</Text> */}

                  <Table
                    width={"100%"}
                    backgroundColor={"#ffffff"}
                    borderWidth={"2px"}
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                  >
                    <Thead boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}>
                      <Tr>
                        <Th textAlign={"left"} padding="13px">
                          Student
                        </Th>
                        <Th textAlign={"left"}>Leave Type</Th>
                        <Th textAlign={"left"}>From</Th>
                        <Th textAlign={"left"}>To</Th>
                        <Th textAlign={"left"}>Mentor</Th>
                        <Th textAlign={"left"}>Documents</Th>
                        <Th textAlign={"left"}>Description</Th>
                        <Th textAlign={"left"}>Status</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {leaves.map((leave) => (
                        <Tr
                          key={Math.random()}
                          boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                        >
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            inlineSize={"120px"}
                            overflowWrap={"break-word"}
                            hyphens={"manual"}
                          >
                            {leave.userFirstName + " " + leave.userLastName}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            inlineSize={"120px"}
                            hyphens={"manual"}
                            overflowWrap={"break-word"}
                          >
                            {leave.typeOfLeave}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            inlineSize={"120px"}
                            hyphens={"manual"}
                            overflowWrap={"break-word"}
                          >
                            {new Date(leave.dateFrom).toLocaleDateString()}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            inlineSize={"120px"}
                            overflowWrap={"break-word"}
                            hyphens={"manual"}
                          >
                            {new Date(leave.dateTo).toLocaleDateString()}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            inlineSize={"120px"}
                            hyphens={"manual"}
                            overflowWrap={"break-word"}
                          >
                            {leave.mentorFirstName + " " + leave.mentorLastName}
                          </Td>

                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            inlineSize={"120px"}
                            hyphens={"manual"}
                            overflowWrap={"break-word"}
                          >
                            {!leave.attachment ? (
                              <span>None</span>
                            ) : (
                              <a href="">
                                <span>{leave.attachment["fileName"]}</span>
                              </a>
                            )}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            // display={"inline"}
                          >
                            {leave.description}
                          </Td>

                          {leave.leaveStatus === "Pending" && (
                            <Td
                              padding="20px"
                              boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                            >
                              <Button
                                onClick={() =>
                                  updateStatus(
                                    leave.leave_id,
                                    "Approved",
                                    "Reason"
                                  )
                                }
                                boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                                backgroundColor={"#3182ce!important"}
                                borderRadius={0}
                                // flex={1}
                                isDisabled={
                                  leave.status == "Approved" ? true : ""
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                onClick={() =>
                                  updateStatus(
                                    leave.leave_id,
                                    "Rejected",
                                    "reason"
                                  )
                                }
                                boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                                backgroundColor={"#e53e3e!important"}
                                borderRadius={0}
                                flex={1}
                                isDisabled={
                                  leave.status == "Rejected" ? true : ""
                                }
                              >
                                Reject
                              </Button>

                              {leave.typeOfLeave === "NSS" ||
                                leave.typeOfLeave === "NCC" ||
                                (leave.typeOfLeave === "Sports" &&
                                  (leave.coOrdinatorStatus === "approved" ? (
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "grey",
                                        display: "flex",
                                        alignSelf: "baseline",
                                        textAlign: "center",
                                        flexDirection: "column-reverse",
                                        alignItems: "flex-end",
                                      }}
                                    >
                                      Co-Ordinator status approved
                                    </span>
                                  ) : leave.coOrdinatorStatus === "rejected" ? (
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "grey",
                                        display: "flex",
                                        alignSelf: "baseline",
                                        textAlign: "center",
                                        flexDirection: "column-reverse",
                                        alignItems: "flex-end",
                                      }}
                                    >
                                      Co-Ordinator status rejected
                                    </span>
                                  ) : (
                                    <span
                                      style={{
                                        fontSize: "12px",
                                        color: "grey",
                                        display: "flex",
                                        alignSelf: "baseline",
                                        textAlign: "center",
                                        flexDirection: "column-reverse",
                                        alignItems: "flex-end",
                                      }}
                                    >
                                      Co-Ordinator leave pending
                                    </span>
                                  )))}
                            </Td>
                          )}

                          {leave.leaveStatus === "Approved" && (
                            <Td
                              padding="20px"
                              boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                              color={"blue"}
                            >
                              {leave.leaveStatus}
                              {leave.typeOfLeave === "NSS" ||
                                leave.typeOfLeave === "NCC" ||
                                (leave.typeOfLeave === "Sports" && (
                                  <text>
                                    {leave.coOrdinatorStatus === "Pending" &&
                                      "Co-Ordinator response Pending"}
                                  </text>
                                ))}
                            </Td>
                          )}
                          {leave.leaveStatus === "Rejected" && (
                            <Td
                              padding="20px"
                              boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                              color={"red"}
                            >
                              {leave.leaveStatus}
                            </Td>
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            )}
          </div>
        )}
      </main>
      <ToastContainer />
    </div>
  );
};

export default LeaveRequest;
