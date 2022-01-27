const express = require("express");
const { magicPacket } = require("./const.js");
var ip = require("ip");
const path = require("path");
const app = express();

const appPort = process.env.PORT || 5000;

var drivers = [];

const buildPath = path.join(__dirname, "..", "build");
app.use(express.static(buildPath));

app.listen(appPort, () => {
  /*console.log(`running on ip ${ip.address()}`);
  console.log(`running on port ${appPort}`);
  console.log(`Listening on port ${socketPort}`);*/
});

app.get("/drivers", (req, res) => {
  res.send(JSON.stringify(drivers));
});

const socketPort = 41794;
const socketHost = "0.0.0.0";

var dgram = require("dgram");
const socket = dgram.createSocket({ type: "udp4", reuseAddr: true });
socket.bind({ port: socketPort,address:socketHost });

socket.on("listening", () => {
  var address = socket.address();
  console.log("server listening " + address.address + ":" + address.port);
});

socket.on("error", (err) => {
  console.log("UDP server binding error!", err);
});

socket.send(
  magicPacket,
  0,
  magicPacket.length,
  socketPort,
  socketHost,
  function (err) {
    console.log(err ? err : "Hello ! Who is there?");
  }
);

socket.on("message", function (msg, sender) {
  console.log(
    "server got: " + msg + " from " + sender.address + ":" + sender.port
  );

  var driverObject = {
    kind: "RESPOND",
    senderAddress: sender.address,
    senderPort: sender.port,
    senderFamily: sender.family,
  };

  let existed = drivers.find(
    (el) => el.senderAddress == driverObject.senderAddress
  );

  console.log(":::::-> " + driverObject.senderAddress);
  if (existed == null) {
    if (msg.Length > 266 && msg[0] == 0x15) {
      drivers.push(driverObject);
      console.log(`It is ${driverObject.senderAddress} and i am here`);
    }
  }
});

