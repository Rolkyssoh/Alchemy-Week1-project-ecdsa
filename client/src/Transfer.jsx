import { useState } from "react";
import server from "./server";

import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';
import * as secp from 'ethereum-cryptography/secp256k1';

function Transfer({ address, setBalance,privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  function hashData(datas){
      const byte = utf8ToBytes(datas);
      return keccak256(byte);
  }

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    const hash = hashData("hello world");
    const sign = await secp.sign(hash, privateKey, {recovered: true, der: false});
    console.log('hashhh:::', hash)
    console.log('the signed:::', sign)
    console.log('the private Key:::', privateKey)
    const signature = sign[0];
    const recoveryBit = sign[1]


    console.log('siiiiign:::', signature)
    console.log('recovvvv:::', recoveryBit)

     try {
       const {
         data: { balance },
       } = await server.post(`send`, {
         sign,
         amount: parseInt(sendAmount),
         recipient,
       });
       setBalance(balance);
     } catch (ex) {
       alert(ex.response.data.message);
     }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
