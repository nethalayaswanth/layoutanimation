import React from "react";
import { createRoot } from "react-dom/client";
import Flip from "./flip";

function shuffleArray<T>(a: T[]) {
  for (let i = a.length; i--; ) {
    const j = Math.floor(Math.random() * (i + 1));
    if (i !== j) [a[i], a[j]] = [a[j], a[i]];
  }
  return [...a];
}

export default function App() {
  const [list, setList] = React.useState([
    { id: 0, title: "item 0" },
    { id: 1, title: "item 1" },
    { id: 2, title: "item 2" },
    { id: 3, title: "item 3" },
    { id: 4, title: "item 4" }
  ]);

  return (
    <>
      <button onClick={() => setList((prev) => shuffleArray(prev))}>
        shuffle
      </button>

      {list.map((item) => (
        <Flip key={item.id}>
          <div>{item.title}</div>
        </Flip>
      ))}
    </>
  );
}
