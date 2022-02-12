import React, { FC, useMemo, useCallback, useEffect ,useState, useRef} from 'react';
import {useMetamask} from 'use-metamask';
import Web3              from "web3";
import { defaultProvider, Provider,stark,ec,hash} from "starknet";
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
const { SnarkMerkleTree , getProof, checkProof,checkProofOrdered} = require("snark_merkle_proof")


export const Home:FC = () => {
  const { connect, metaState } = useMetamask();
  let bufferedClick = 0;
 
  const yDocRef = useRef({});
   useEffect(() => {
    if (!metaState.isConnected) {
      (async () => {
        try {
          await connect(Web3);
          window.addEventListener('mousedown', (event) => {
            bufferedClick++;
            setTimeout(updateClicks,50);
          });

          const starkKeyPair = ec.genKeyPair();
          const PK_INT = 12345;

          console.log(starkKeyPair);

          const provider = new Provider({baseUrl:"http://127.0.0.1:5000"});
          const testKeyPair = ec.getKeyPair(PK_INT);


          const starkKey = ec.getStarkKey(starkKeyPair);//testKeyPair
          //"0x399ab58e2d17603eeccae95933c81d504ce475eb1bd0080d2316b84232e133c";
          const bigIntStarkKey = BigInt(starkKey).toString(10)
          const msgHash = 
          hash.pedersen([4321,0]);
        
          console.log("hash:", msgHash);
          const signature = ec.sign(testKeyPair, msgHash);
          console.log(starkKey);
          const doc = new Y.Doc({ autoLoad: true })
          const wsProvider = new WebsocketProvider('ws://localhost:1234', 'gamestate', doc,{params:{auth:signature.toString()}})

          wsProvider.on('status', (event:any) => {
            console.log(event.status) // logs "connected" or "disconnected"
          })

          wsProvider.on('sync', (isSynced: boolean)=>{
             console.log("isSynced",isSynced);
          })

          const yCount = doc.getMap("gamestate");
          yDocRef.current = yCount;
          const counter = new Y.Array()
          yCount.set(starkKey,counter);
          yCount.observe(event => {
            console.log('yarray was modified')
            console.log(doc.toJSON());
          })

          yCount.observeDeep(events => { 
            console.log('All deep events: ', events) 
            console.log(doc.toJSON());
        })
          // every time a local or remote client modifies yarray, the observer is called
          const updateClicks = ()=>{
           if(bufferedClick>0){
              //yCount.set(starkKey, ((yCount.get(starkKey) as number) || 0) + bufferedClick)
            
              console.log("upload clicks", bufferedClick);
              (yCount.get(starkKey) as Y.Array<number>).push([bufferedClick]);
              //const ymap = doc.getArray(starkKey+'-y-counter').push([bufferedClick]);
              // let yArray = ymap.get(starkKey) || new Y.Array();//.push([bufferedClick]);
              // //ymap.set('key', yarray)
              
              // (yArray as Y.Array<number>).push([bufferedClick]);
              // // yCount.set(starkKey, yArray);
              // // console.log(yCount.get(starkKey));

              

              bufferedClick = 0;
            }          
            setTimeout(updateClicks, 50);
          }
         
         return ()=>{
           //at the end close the channel
           wsProvider.disconnect();
         }


        
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, []);
  //...
  return (
    <div className="App">
      <header className="App-header">
        
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
  
}