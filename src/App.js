import React from "react";
import "./styles.css";
import SplitPane from "react-split-pane";

export default function App() {
  return (
    <SplitPane split="vertical" minSize={50} defaultSize={100}>
      <div>22</div>
      <div>22</div>
    </SplitPane>
  );
}
