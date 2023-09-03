const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;

const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "04baeb41c69b14b848889af5f4b6e492cbcd3a2b09b40da5884e4327e2d04e12fc842cd6fd1abfa14f94826ecb9a8e994ea280f1bdfce5dcaef9329bf0c81e65c9": 100,
  "048c2ac45e303fcc912dec050a470b4bc615a39e1b3c94913c5e10a49b091be7bfcb8982a3147c2788b6d36f85c31b1aa46974c8f7eae02b88ad183734ae17d854": 50,
  "0481c788df8c429a37afde479ee74f505b0d26a5933d853c0eb5ac771816edd7c8f155449e366a908d4e05bdd1633ffae6d584f333227ef99846b64f2c61f7e5f5": 75,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
//TODO: get a signature from the client-side application
//recover the public address from the signature

  const { sign, recipient, amount } = req.body;
  
  const sender =  secp.recoverPublicKey(
    hashData(`${parseInt(sendAmount)} ${recipient}`), 
    sign[0], //signature
    sign[1] //recoveryBit
  );

  setInitialBalance(sender);
  setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}

function hashData(datas){
    const byte = utf8ToBytes(datas);
    return keccak256(byte);
}
