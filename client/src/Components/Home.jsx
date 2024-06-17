import React, { useState, useEffect } from "react";
import "./Styles.css";
import { Chart as ChartJS, defaults } from "chart.js/auto";
import { Doughnut } from "react-chartjs-2";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import { ThemeProvider } from "@mui/material";
import { FcLeave } from "react-icons/fc";
import axios from "axios";
import DataTable from "react-data-table-component";
import Spinner from "./Spinner";
import PDFViewer from "../Files/holidays-list.pdf";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Home(props) {
  const token = localStorage.getItem(`token`);
  const tokenPayload = JSON.parse(atob(token.split(".")[1]));
  const [userName, setUserNane] = useState("");
  const [userType, setUserType] = useState("");
  const headers = { authorization: `Bearer ` + localStorage.getItem(`token`) };
  const [loading, setLoading] = useState(true);
  const [table, setTable] = useState([]);
  const [data, setData] = useState({
    pendingLeaves: 0,
    approvedLeaves: 0,
    rejectedLeaves: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [holiday, setHoliday] = useState([]);

  console.log(tokenPayload);
  console.log(token, "hghg");
  useEffect(() => {
    if (token) {
      const tokenPayload = JSON.parse(atob(token.split(".")[1]));
      setUserNane(tokenPayload.name);
      setUserType(tokenPayload.type);
    }
  }, [token]);

  useEffect(() => {
    axios
      .get("http://localhost:9000/user/dashboardDtls", { headers })
      .then((response) => {
        console.log(response.data);
        setChartData(response.data.leavesType);
        setHoliday(response.data.holidayLeaves);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching chart data:", error);
      });
  }, []);
  console.log(holiday);

  useEffect(() => {
    if (userType === "Admin") {
      props.setProgress(10);
      axios
        .get("http://localhost:9000/admin/leaveList", { headers })
        .then((result) => {
          setLoading(true);
          props.setProgress(30);
          setLoading(false);
          props.setProgress(50);
          setTable(result.data.leaveData);
          props.setProgress(70);
          setData({
            pendingLeaves: result.data.pendingLeaves,
            approvedLeaves: result.data.approvedLeaves,
            rejectedLeaves: result.data.rejectedLeaves,
          });
          props.setProgress(100);
        })
        .catch((error) => {
          console.log("Error fetching data", error);
        });
    } else if (userType === "Student") {
      props.setProgress(10);
      axios
        .get("http://localhost:9000/student/leaveList", { headers })
        .then((result) => {
          setLoading(true);
          props.setProgress(30);
          setTable(result.data.leaves);
          setData({
            pendingLeaves: result.data.pendingLeaves,
            approvedLeaves: result.data.approvedLeaves,
            rejectedLeaves: result.data.rejectedLeaves,
          });
          props.setProgress(70);
          setLoading(false);
          props.setProgress(100);
        })
        .catch((error) => {
          console.log("Error fetching data", error);
        });
    } else if (userType === "Moderator") {
      props.setProgress(10);
      axios
        .get("http://localhost:9000/moderator/myLeaveList", { headers })
        .then((result) => {
          setLoading(true);
          props.setProgress(30);
          setTable(result.data.leaves);
          setData({
            pendingLeaves: result.data.pendingLeaves,
            approvedLeaves: result.data.approvedLeaves,
            rejectedLeaves: result.data.rejectedLeaves,
          });
          props.setProgress(70);
          setLoading(false);
          props.setProgress(100);
        })
        .catch((error) => {
          console.log("Error fetching data", error);
        });
    }
  }, [userType]);

  const title = "Student Leave History";

  const columns = [
    {
      name: "Name",
      selector: (row) => row.userFirstName + " " + row.userLastName,
      style: {
        backgroundColor: "#4b4b4b",
        color: "#face4d",
      },
    },
    {
      name: "Enrollment No",
      selector: (row) => row.enrollno,
      style: {
        backgroundColor: "#4b4b4b",
        color: "#face4d",
      },
    },
    {
      name: "Leave Type",
      selector: (row) => row.typeOfLeave,
      style: {
        backgroundColor: "#4b4b4b",
        color: "#face4d",
      },
    },
    {
      name: "Leave Days",
      selector: (row) => row.ttlLeaves,
      style: {
        backgroundColor: "#4b4b4b",
        color: "#face4d",
      },
    },
    {
      name: "Attachment",
      selector: (row) => {
        if (row.attachment && row.attachment.fileName) {
          return row.attachment.fileName;
        } else {
          return "None";
        }
      },
      style: {
        backgroundColor: "#4b4b4b",
        color: "#face4d",
      },
    },
    {
      name: "Mentor",
      selector: (row) => row.mentorFirstName + " " + row.mentorLastName,
      style: {
        backgroundColor: "#4b4b4b",
        color: "#face4d",
      },
    },
    {
      name: "Status",
      selector: (row) => row.leaveStatus,
      style: {
        backgroundColor: "#4b4b4b",
        color: "#face4d",
      },
    },
  ];

  return (
    <main className="main-container">
      {loading ? (
        <Spinner />
      ) : (
        <div>
          <div className="container">
            <h3> {userName}</h3>
          </div>
          <div className="main-cards">
            <div className="card">
              <div className="card-inner">
                <h3>Approved Leaves</h3>
                <h1>{data.approvedLeaves}</h1>
              </div>
              <div className="card-inner">
                <h3>Rejected Leaves</h3>
                <h1>{data.rejectedLeaves}</h1>
              </div>
              <div className="card-inner">
                <h3>Pending Leaves</h3>
                <h1>{data.pendingLeaves}</h1>
              </div>
            </div>
            <div className="card2">
              <div className="card-inner">
                <h2>UPCOMING HOLIDAYS LIST</h2>
              </div>

              <h2>
                <ul className="ucard2">
                  {holiday.map((holiday, index) => (
                    <li key={index}>
                      <span>{holiday.name}</span>
                      <span className="date">
                        {holiday.date.substring(5, 10)}
                      </span>
                    </li>
                  ))}
                </ul>
              </h2>
              <button
                onClick={() => window.open(PDFViewer, "_blank")}
                rel="noreferrer"
                className="btn_viewHolidayList"
              >
                View Holiday List
              </button>
            </div>

            <div className="card3">
              <div className="card-inner2">
                <h3>Types Of Leaves</h3>
                <Doughnut
                  data={{
                    labels: chartData.map((data) => data.name),
                    datasets: [
                      {
                        label: "Count",
                        data: chartData.map((data) => data.days),
                        backgroundColor: [
                          "rgb(255, 182, 104)",
                          "rgb(250, 206, 77)",
                        ],
                        borderColor: ["rgba(25, 19, 1)"],
                        borderRadius: 5,
                      },
                    ],
                  }}
                  options={{
                    plugins: {
                      legend: {
                        labels: {
                          color: "#face4d",
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div className="main-card2">
            <div style={{ width: "auto" }}>
              <DataTable
                title={title}
                columns={columns}
                data={table}
                selectableRowsHighlight
                highlightOnHover
                pagination
                fixedHeader
                fixedHeaderScrollHeight="350px"
              ></DataTable>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Home;
