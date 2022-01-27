const express = require("express");
const path = require("path");
const app = express();

const appPort = process.env.PORT || 5000;

var drivers = [];
/*app.use("^/$", (req, res, next) => {
  fs.readFile(path.resolve("./build/index.html"), "utf-8", (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).send("on Server Side error happened");
    }

    return res.send(
      data.replace(
        '<div id="root"></div>',
        `<div id="root">${reactDomServer.renderToString(<App />)}</div>`
      )
    );
  });
});*/

const buildPath = path.join(__dirname, "..", "public")
app.use(express.static(buildPath));

app.listen(appPort, () => {
  console.log(`running on port ${appPort}`);
  console.log(`Listening on port ${socketPort}`);
});

app.get("/drivers", (req, res) => {
  res.send(JSON.stringify(drivers));
});

const socketPort = 41794;
var dgram = require("dgram");
const socket = dgram.createSocket(
  {
    type: "udp4",
    reuseAddr: true,
  },
  (buffer, sender) => {
    socket.send(buffer, sender.port, sender.address, (error) => {
      if (error) {
        console.log(error);
      } else {
        var driverObject = {
          kind: "RESPOND",
          senderAddress: sender.address,
          senderPort: sender.port,
          senderFamily: sender.family,
        };

        let existed =drivers.find(el=> el.senderAddress == driverObject.senderAddress)
        if (existed==null) {
          drivers.push(driverObject);
          console.log("Length of Drivers is " + drivers.length);
        }
      }
    });
  }
);

socket.bind(socketPort);
