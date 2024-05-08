import React, { useState } from "react";
import { Document, Page,pdfjs } from "react-pdf";
import  "../Files/PDFViewer.css"
import pdfView from "../Files/holidays-list.pdf"

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`; 

const PDFViewer = (onClose) => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const nextPage=()=>{
    if(pageNumber<numPages){
      setPageNumber(pageNumber+1)
    }
  }

  const prevPage=()=>{
    if(pageNumber>1){
      setPageNumber(pageNumber-1)
    }
  }

  return (
    <>
    {/* <div className="wrap"> */}
    <div style={{display:"flex", justifyContent:"center"}}>
    {/* <div className="controls"> */}
    <div style={{width:"200px",border:"3px solid gray"}}>
    <button className="close-btn" onClick={onClose}>Close</button>
      <button onClick={prevPage} disabled={pageNumber===1}>Prev</button>
      <button onClick={nextPage} disabled={pageNumber===numPages}>Next</button>
      <Document file={pdfView} onLoadSuccess={onDocumentLoadSuccess} onContextMenu={(e)=>e.preventDefault()} className="pdf-container">
        
        <Page pageNumber={pageNumber}/>
      </Document>
      {/* <p>
        Page {pageNumber} of {numPages}
      </p> */}
      </div>
    </div>
    </>
  );
};

export default PDFViewer;


// import React,{useState} from "react";

// const PDFViewer =({pdfURL,imageURL})=>{
//   const[isVisible,setIsVisible]=useState(false)

//   const onDocumentLoadSuccess=()=>{
//     setIsVisible(!isVisible);
//   }
//   return(
//     <div>
//       <button onClick={onDocumentLoadSuccess}></button>
//       {isVisible &&(
//         <div className="overlay">
//           {pdfURL && <embed src={pdfUrl} type="application/pdf"/>}
//           {imageURL && <img src={imageURL} alt="Preview"/>}
//         </div>
//       )}
//     </div>
//   )
// }
// export default PDFViewer;

// import React from "react";
// import Home from "../Components/Home";
// import "../Files/PDFViewer.css"

// const PDFViewer=()=>{

//   const pdfURL = "holiday-list.pdf"

//   return(
//     <div><h1>PDF Viewer</h1>
//     <Home pdfURL={pdfURL} imageURL={imageURL}/></div>
//   )
// }
// export default PDFViewer;