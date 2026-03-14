import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Eye, EyeOff, Layers } from "lucide-react";
import template from "./template.json";

const FIELD_ORDER = ["date", "payee", "name", "name2", "amountWords", "amountWords2", "amount"];

const ChequeDesign = React.forwardRef((props, ref) => {
  const cmToPx = (cm) => cm * 37.8;

  const [positions, setPositions] = React.useState({
    date:         { x: template.DatePosition.x,         y: template.DatePosition.y,         fontSize: 1.2, visible: true },
    payee:        { x: template.ACPayeePosition.x,      y: template.ACPayeePosition.y,      fontSize: 1.0, visible: true },
    name:         { x: template.NamePosition.x,         y: template.NamePosition.y,         fontSize: 1.2, visible: true },
    name2:        { x: template.Name2Position.x,        y: template.Name2Position.y,        fontSize: 1.2, visible: true },
    amountWords:  { x: template.AmountWordsPosition.x,  y: template.AmountWordsPosition.y,  fontSize: 1.0, visible: true },
    amountWords2: { x: template.AmountWords2Position.x, y: template.AmountWords2Position.y, fontSize: 1.0, visible: true },
    amount:       { x: template.AmountPosition.x,       y: template.AmountPosition.y,       fontSize: 1.5, visible: true },
  });

  const [activeField, setActiveField] = React.useState(null);
  const isDraggingRef  = React.useRef(false);
  const dragStartRef   = React.useRef({ mouseX: 0, mouseY: 0, fieldX: 0, fieldY: 0 });
  const activeFieldRef = React.useRef(null);

  React.useEffect(() => { activeFieldRef.current = activeField; }, [activeField]);

  // ── Drag ────────────────────────────────────────────────────────────────
  const handleMouseDown = React.useCallback((e, field) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveField(field);
    isDraggingRef.current = true;
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      fieldX: positions[field].x,
      fieldY: positions[field].y,
    };
  }, [positions]);

  React.useEffect(() => {
    const onMove = (e) => {
      if (!isDraggingRef.current) return;
      const key = activeFieldRef.current;
      if (!key) return;
      const { mouseX, mouseY, fieldX, fieldY } = dragStartRef.current;
      const dx = (e.clientX - mouseX) / 37.8;
      const dy = (e.clientY - mouseY) / 37.8;
      setPositions(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          x: parseFloat(Math.max(0, fieldX + dx).toFixed(2)),
          y: parseFloat(Math.max(0, fieldY + dy).toFixed(2)),
        },
      }));
    };
    const onUp = () => { isDraggingRef.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup",   onUp);
    };
  }, []);

  const updateField = (key, prop, value) =>
    setPositions(prev => ({ ...prev, [key]: { ...prev[key], [prop]: value } }));

  // ── Active field highlight style ─────────────────────────────────────────
  const activeStyle = (key) => ({
    border:          activeField === key ? "1.5px solid #3b82f6" : "1.5px dashed transparent",
    borderRadius:    3,
    padding:         "1px 3px",
    backgroundColor: activeField === key ? "rgba(59,130,246,0.06)" : "transparent",
    cursor:          "grab",
    userSelect:      "none",
  });

  return (
    <div style={{ display: "flex", gap: 0, alignItems: "flex-start", textAlign: "left" }}>

      {/* ════════════════════════════════════════════════════════════════════
          LEFT SIDEBAR — exact MyTemplateDesigner style
          ════════════════════════════════════════════════════════════════════ */}
      <div className="w-72 bg-white rounded-2xl border border-slate-200 flex flex-col shadow-sm overflow-hidden"
        style={{
          width: 288,
          minWidth: 288,
          marginRight: 20,
          backgroundColor: "#fff",
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 1px 3px rgba(0,0,0,0.07)",
          overflow: "hidden",
          height: 390
        }}>

        {/* Header */}
        <div style={{ padding: "16px", borderBottom: "1px solid #e2e8f0" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 700, color: "#1e293b", fontSize: 14, margin: 0 }}>
            <Layers size={16} /> Fields
          </h4>
        </div>

        {/* Field cards */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px", display: "flex", flexDirection: "column", gap: 0 }}>
          {FIELD_ORDER.map((key) => {
            const field = positions[key];
            const isActive = activeField === key;
            return (
              <div
                key={key}
                onClick={() => setActiveField(key)}
                style={{
                  padding: "12px",
                  borderRadius: 12,
                  border: isActive ? "1px solid #3b82f6" : "1px solid #e2e8f0",
                  backgroundColor: isActive ? "#eff6ff" : "transparent",
                  marginBottom: 8,
                  cursor: "pointer",
                  transition: "all 0.15s",
                  boxShadow: isActive ? "0 1px 4px rgba(59,130,246,0.10)" : "none",
                }}
              >
                {/* Field label row */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: field.visible ? 8 : 0 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", color: "#374151", letterSpacing: "0.04em" }}>
                    {key}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); updateField(key, "visible", !field.visible); }}
                    style={{ background: "none", border: "none", cursor: "pointer", padding: "2px 4px", borderRadius: 6, display: "flex", alignItems: "center" }}
                  >
                    {field.visible
                      ? <Eye size={14} style={{ color: "#3b82f6" }} />
                      : <EyeOff size={14} style={{ color: "#94a3b8" }} />}
                  </button>
                </div>

                {field.visible && (
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {/* X */}
                    <div>
                      <label style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.08em", display: "block", marginBottom: 3 }}>x mm</label>
                      <input
                        type="number" step="0.1"
                        value={field.x}
                        onChange={e => updateField(key, "x", parseFloat(e.target.value) || 0)}
                        onClick={e => e.stopPropagation()}
                        className="w-full text-xs border border-slate-200 p-1.5 rounded-lg outline-none focus:ring-2 ring-blue-400 font-mono"
                        style={{ width: "100%", boxSizing: "border-box", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px", outline: "none", fontFamily: "monospace", color: "#1e293b" }}
                      />
                    </div>
                    {/* Y */}
                    <div>
                      <label style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.08em", display: "block", marginBottom: 3 }}>y mm</label>
                      <input
                        type="number" step="0.1"
                        value={field.y}
                        onChange={e => updateField(key, "y", parseFloat(e.target.value) || 0)}
                        onClick={e => e.stopPropagation()}
                        className="w-full text-xs border border-slate-200 p-1.5 rounded-lg outline-none focus:ring-2 ring-blue-400 font-mono"
                        style={{ width: "100%", boxSizing: "border-box", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px", outline: "none", fontFamily: "monospace", color: "#1e293b" }}
                      />
                    </div>
                    {/* Font Size */}
                    <div style={{ gridColumn: "1 / -1" }}>
                      <label style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8", letterSpacing: "0.08em", display: "block", marginBottom: 3 }}>Font Size</label>
                      <input
                        type="number" step="0.1" min="0.6" max="3"
                        value={field.fontSize}
                        onChange={e => updateField(key, "fontSize", parseFloat(e.target.value) || 1)}
                        onClick={e => e.stopPropagation()}
                        className="w-full text-xs border border-slate-200 p-1.5 rounded-lg outline-none focus:ring-2 ring-blue-400 font-mono"
                        style={{ width: "100%", boxSizing: "border-box", fontSize: 12, border: "1px solid #e2e8f0", borderRadius: 8, padding: "6px", outline: "none", fontFamily: "monospace", color: "#1e293b" }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          CHEQUE PREVIEW — original PrintTest code, fields made draggable
          ════════════════════════════════════════════════════════════════════ */}
      <div style={{ padding: "20px" }}>
        <style>
          {`
            @media print {
              @page { size: landscape; margin: 0mm; }
              body { margin: 0; }
            }
          `}
        </style>

        <div
          ref={ref}
          className="printable-cheque"
          style={{
            width: cmToPx(template.Width),
            height: cmToPx(template.Height),
            border: "2px dashed #333",
            margin: "0 auto",
            position: "relative",
            backgroundColor: "#fff",
            color: "#000",
            fontFamily: "'Courier New', Courier, monospace",
            textAlign: "left",
          }}
        >
        {/* A/C PAYEE ONLY */}
        {/* <div
          style={{
            position: "absolute",
            top: "40px",
            left: "15px",
            transform: "rotate(-40deg)",
            fontSize: "10px",
            fontWeight: "bold",
            pointerEvents: "none"
          }}
        >
          A/C PAYEE ONLY
        </div> */}

          {/* Date */}
          {positions.date.visible && (
            <div
              onMouseDown={(e) => handleMouseDown(e, "date")}
              style={{
                position: "absolute",
                top: cmToPx(positions.date.y),
                left: cmToPx(positions.date.x),
                fontSize: `${positions.date.fontSize}rem`,
                ...activeStyle("date"),
              }}
            >
              10/03/2026
            </div>
          )}

          {/* A/C Payee */}
          {positions.payee.visible && (
            <div
              onMouseDown={(e) => handleMouseDown(e, "payee")}
              style={{
                position: "absolute",
                top: cmToPx(positions.payee.y),
                left: cmToPx(positions.payee.x),
                fontSize: `${positions.payee.fontSize}rem`,
                fontWeight: "bold",
                ...activeStyle("payee"),
              }}
            >
              A/C Payee
            </div>
          )}

          {/* Name */}
          {positions.name.visible && (
            <div
              onMouseDown={(e) => handleMouseDown(e, "name")}
              style={{
                position: "absolute",
                top: cmToPx(positions.name.y),
                left: cmToPx(positions.name.x),
                ...activeStyle("name"),
              }}
            >
              <span style={{ marginLeft: "20px", fontSize: `${positions.name.fontSize}rem`, fontWeight: "bold" }}>
                {template.NameBefore} JOHN DOE
              </span>
            </div>
          )}

          {/* Name2 */}
          {positions.name2.visible && (
            <div
              onMouseDown={(e) => handleMouseDown(e, "name2")}
              style={{
                position: "absolute",
                top: cmToPx(positions.name2.y),
                left: cmToPx(positions.name2.x),
                fontSize: `${positions.name2.fontSize}rem`,
                fontWeight: "bold",
                ...activeStyle("name2"),
              }}
            >
              TEST SECOND LINE {template.NameAfter}
            </div>
          )}

          {/* Amount Words */}
          {positions.amountWords.visible && (
            <div
              onMouseDown={(e) => handleMouseDown(e, "amountWords")}
              style={{
                position: "absolute",
                top: cmToPx(positions.amountWords.y),
                left: cmToPx(positions.amountWords.x),
                ...activeStyle("amountWords"),
              }}
            >
              <span style={{ marginLeft: "20px", fontSize: `${positions.amountWords.fontSize}rem` }}>
                {template.AmountWordsBefore} One Thousand Two Hundred
              </span>
            </div>
          )}

          {/* Amount Words 2 */}
          {positions.amountWords2.visible && (
            <div
              onMouseDown={(e) => handleMouseDown(e, "amountWords2")}
              style={{
                position: "absolute",
                top: cmToPx(positions.amountWords2.y),
                left: cmToPx(positions.amountWords2.x),
                fontSize: `${positions.amountWords2.fontSize}rem`,
                ...activeStyle("amountWords2"),
              }}
            >
              Dollars Only {template.AmountWordsAfter}
            </div>
          )}

          {/* Amount */}
          {positions.amount.visible && (
            <div
              onMouseDown={(e) => handleMouseDown(e, "amount")}
              style={{
                position: "absolute",
                top: cmToPx(positions.amount.y),
                left: cmToPx(positions.amount.x),
                border: activeField === "amount" ? "2px solid #3b82f6" : "2px solid #000",
                padding: "10px",
                fontSize: `${positions.amount.fontSize}rem`,
                fontWeight: "bold",
                cursor: "grab",
                userSelect: "none",
                backgroundColor: activeField === "amount" ? "rgba(59,130,246,0.06)" : "transparent",
              }}
            >
              {template.AmountBefore} 1,200.00 {template.AmountAfter}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

// ── PrintTest — original structure, completely untouched ───────────────────
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
