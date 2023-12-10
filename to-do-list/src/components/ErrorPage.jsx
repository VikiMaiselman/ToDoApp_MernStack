import React from "react";
import "../styles/ErrorPage.css";

export default function ErrorPage({ errMsg }) {
  return (
    <div className="ErrorPage">
      <h1>Oh-ough!.. Something went wrong :(</h1>
      <h2>{errMsg}</h2>
    </div>
  );
}
