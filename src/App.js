import React, { useCallback, useEffect, useState } from "react";
import "./App.scss";

function App() {
  const [drivers, setDrivers] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      callDrivers()
        .then((res) => {
          console.log("API is ok222");
        })
        .catch((err) => console.log(err));
    }, 10000);

    return()=>clearInterval(interval)
  }, []);

  const callDrivers = useCallback(async () => {
    const response = await fetch("drivers", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => setDrivers(res))
      .catch((err) => console.log(err));

    return response;
  });

  return (
    <div className="container">
      <div className="row align-items-stretch">
        {drivers &&
          drivers?.map((el, index) => {
            return (
              <div key={index} className="col-md-4 mb-4">
                <div key={index} className="custom--card small-card">
                  <p>Address : {el.senderAddress}</p>
                  <p>Port : {el.senderPort}</p>
                  <p>Type : {el.senderFamily}</p>
                  <a
                    className="btn"
                    href={`http://${el?.senderAddress}/LCD`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginRight: "30px" }}
                  >
                    Driver Link
                  </a>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

export default App;
