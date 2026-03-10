import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const ChequeDesign = React.forwardRef((props, ref) => {
  return (
    <div style={{ padding: "20px" }}>
      {/* This style block is the "Magic". 
         It only triggers when the print button is pressed.
      */}
      <style>
        {`
          @media print {
  @page {
    size: landscape; /* This tells the printer to rotate the paper */
    margin: 0mm;      /* Removes the "Date/URL" headers from the edges */
  }
  body {
    margin: 0;
  }
}
        `}
      </style>

      <div
        ref={ref}
        className="printable-cheque"
        style={{
          width: "800px",
          height: "350px",
          border: "2px dashed #333", // Dashed border so you can see the edges on screen
          margin: "0 auto",
          position: "relative",
          backgroundColor: "#fff", // Ensures it's white even if your site has dark mode
          color: "#000", // Ensures text is black
          fontFamily: "'Courier New', Courier, monospace",
          textAlign: "left",
        }}
      >
        {/* Absolute Positioning for precision */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "40px",
            fontSize: "1.2rem",
          }}
        >
          Date: 10/03/2026
        </div>

        <div style={{ position: "absolute", top: "100px", left: "60px" }}>
          <span style={{ fontSize: "0.8rem" }}>PAY:</span>
          <span
            style={{
              marginLeft: "20px",
              fontSize: "1.2rem",
              fontWeight: "bold",
            }}
          >
            JOHN DOE (TEST RUN)
          </span>
        </div>

        <div style={{ position: "absolute", top: "160px", left: "60px" }}>
          <span style={{ fontSize: "0.8rem" }}>AMOUNT IN WORDS:</span>
          <span style={{ marginLeft: "20px", fontSize: "1rem" }}>
            One Thousand Two Hundred Dollars Only
          </span>
        </div>

        <div
          style={{
            position: "absolute",
            top: "150px",
            right: "50px",
            border: "2px solid #000",
            padding: "10px",
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
           1,200.00
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "60px",
            borderTop: "1px solid #000",
            width: "200px",
            textAlign: "center",
          }}
        >
          Authorized Signatory
        </div>
      </div>
    </div>
  );
});

const PrintTest = () => {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: "Cheque_Print_Job",
  });

  return (
    <div
      style={{
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#222",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <h1 style={{ marginBottom: "20px" }}>Cheque Software Test</h1>

      <button
        onClick={() => handlePrint()}
        style={{
          padding: "12px 24px",
          fontSize: "16px",
          cursor: "pointer",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "8px",
          marginBottom: "40px",
        }}
      >
        Print Cheque
      </button>

      {/* This will now be visible on screen because of the explicit background and text colors */}
      <div
        style={{
          backgroundColor: "#444",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <h3 style={{ color: "#aaa", marginBottom: "10px" }}>Preview:</h3>
        <ChequeDesign ref={componentRef} />
      </div>
    </div>
  );
};

export default PrintTest;
