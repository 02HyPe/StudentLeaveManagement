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
import { HiUserAdd } from "react-icons/hi";
import Header from "./Header";
import Sidebar from "./Sidebar";
import "./Users.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Spinner from "./Spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Users() {
  const token = localStorage.getItem(`token`);
  const navigate = useNavigate();
  const headers = { authorization: `Bearer ` + token };
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  console.log(tokenPayload);
  const userName = tokenPayload.name;
  const userType = tokenPayload.type;
  const [user, setUser] = useState([]);
  const [count, setCount] = useState({
    student: 0,
    moderator: 0,
    admin: 0,
  });
  const [loading, setLoading] = useState(true);

  const getUsers = () => {
    axios
      .get("http://localhost:9000/admin/userDetail", {
        headers: headers,
      })
      .then((res) => {
        console.log(res.data);
        setLoading(true);
        setUser(res.data.usersInfo);
        setCount({
          student: res.data.studentCount,
          moderator: res.data.moderatorCount,
          admin: res.data.adminCount,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  };
  useEffect(() => {
    getUsers();
  }, []);

  const users = (type) => {
    axios
      .get("http://localhost:9000/admin/userType", {
        params: {
          type: type,
        },
        headers: headers,
      })
      .then((res) => {
        console.log(res.data); 
        setUser(res.data);
      })
      .catch((error) => {
        console.log("Error fetching data", error);
      });
  };

  const deleteUser = async (user_id) => {
    try {
      const confirmation = window.confirm(
        "Are You Sure You Want To Delete This Record ?"
      );
      if (confirmation) {
        console.log(user_id);
        const res = await axios.post(
          "http://localhost:9000/admin/user/delete",
          {
            user_id: user_id,
          },
          {
            headers: headers,
          }
        );
        if (res.status === 200) {
          console.log("deleted successfully");
          toast.success("Deleted Successfully", {
            position: "top-right",
            autoClose: 2500,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          getUsers();
        }
      }
    } catch (err) {
      console.log(err, "deleting user");
    }
  };

  const [openSidebarToggle, setOpenSidebarToggle] = useState(false);

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle);
  };
  return (
    <div className="grid-user">
      <Header OpenSidebar={OpenSidebar} />
      <Sidebar
        openSidebarToggle={openSidebarToggle}
        OpenSidebar={OpenSidebar}
      />

      <main className="main-user">
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
                    <Text fontWeight={"500"}>Student</Text>
                    <Text fontSize={"2.5rem"}>{count.student}</Text>
                    <Button
                      left={"80%"}
                      onClick={() => {
                        navigate("/register");
                      }}
                    >
                      <HiUserAdd size={"20px"} />
                    </Button>
                  </Box>
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid gray"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text>Moderator</Text>
                    <Text fontSize={"2.5rem"}>{count.moderator}</Text>
                    <Button
                      left={"80%"}
                      onClick={() => {
                        navigate("/register");
                      }}
                    >
                      <HiUserAdd size={"20px"} />
                    </Button>
                  </Box>
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid red"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text>Admin</Text>
                    <Text fontSize={"2.5rem"}>{count.admin}</Text>
                    <Button
                      left={"80%"}
                      onClick={() => {
                        navigate("/register");
                      }}
                    >
                      <HiUserAdd size={"20px"} />
                    </Button>
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
                    Users List
                  </Text>

                  <Button
                    backgroundColor={"#e53e3e!important"}
                    borderRadius={0}
                    onClick={() => users("Moderator")}
                    minWidth={"max-content"}
                  >
                    Faculty
                  </Button>
                  <Button
                    backgroundColor={"#e53e3e!important"}
                    borderRadius={0}
                    onClick={() => users("Student")}
                    minWidth={"max-content"}
                  >
                    Students
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
                  borderWidth="1px"
                  boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                >
                  <Table
                    width={"100%"}
                    backgroundColor={"#ffffff"}
                    borderWidth={"2px"}
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                  >
                    <Thead boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}>
                      <Tr>
                        <Th textAlign={"left"} padding="13px">
                          Name
                        </Th>
                        <Th textAlign={"left"}>User</Th>
                        <Th textAlign={"left"}>Authority</Th>
                        <Th textAlign={"left"}>Email</Th>
                        <Th textAlign={"left"}>Department</Th>
                        <Th>Operation</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {user.map((user) => (
                        <Tr
                          key={Math.random()}
                          boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                        >
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.firstName + " " + user.lastName}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.type}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.authority}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.email}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.department}
                          </Td>

                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            <Button
                              onClick={() => {
                                navigate(`/updateProfile/${user.user_id}`);
                              }}
                              boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                              backgroundColor={"#3182ce!important"}
                              borderRadius={0}
                              flex={1}
                            >
                              Update
                            </Button>
                            <Button
                              onClick={() => deleteUser(user.user_id)}
                              boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                              backgroundColor={"#e53e3e!important"}
                              borderRadius={0}
                              flex={1}
                            >
                              Delete
                            </Button>
                          </Td>
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
                    <Text fontWeight={"500"}>Student</Text>
                    <Text fontSize={"2.5rem"}>{count.student}</Text>
                  </Box>
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid gray"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text>Moderator</Text>
                    <Text fontSize={"2.5rem"}>{count.moderator}</Text>
                  </Box>
                  <Box
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                    bg={"white"}
                    borderTop={"3px solid red"}
                    p={"2rem"}
                    flex={1}
                  >
                    <Text>Admin</Text>
                    <Text fontSize={"2.5rem"}>{count.admin}</Text>
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
                    Users List
                  </Text>
                  <Button
                    backgroundColor={"#e53e3e!important"}
                    borderRadius={0}
                    onClick={() => users("Moderator")}
                    minWidth={"max-content"}
                  >
                    Faculty
                  </Button>
                  <Button
                    backgroundColor={"#e53e3e!important"}
                    borderRadius={0}
                    onClick={() => users("Student")}
                    minWidth={"max-content"}
                  >
                    Students
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
                  borderWidth="1px"
                  boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                >
                  <Table
                    width={"100%"}
                    backgroundColor={"#ffffff"}
                    borderWidth={"2px"}
                    boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                  >
                    <Thead boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}>
                      <Tr>
                        <Th textAlign={"left"} padding="13px">
                          Name
                        </Th>
                        <Th textAlign={"left"}>User</Th>
                        <Th textAlign={"left"}>Authority</Th>
                        <Th textAlign={"left"}>Email</Th>
                        <Th textAlign={"left"}>Department</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {user.map((user) => (
                        <Tr
                          key={Math.random()}
                          boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                        >
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.firstName + " " + user.lastName}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.type}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.authority}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.email}
                          </Td>
                          <Td
                            padding="20px"
                            boxShadow={"0 6px 7px -3px rgba(0, 0, 0, 0.35)"}
                          >
                            {user.department}
                          </Td>
                         
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              </VStack>
            )}
          </div>
        )}
        <ToastContainer
          position="top-right"
          autoClose={2500}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
      </main>
    </div>
  );
}

export default Users;
