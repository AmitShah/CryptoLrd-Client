import React, { FC, useMemo, useCallback, useEffect ,useState} from 'react';
import Unity, { UnityContext } from "react-unity-webgl";


const unityContext = new UnityContext({
  loaderUrl: "/Build/BuildTwo.loader.js",
  dataUrl: "/Build/BuildTwo.data",
  frameworkUrl: "/Build/BuildTwo.framework.js",
  codeUrl: "/Build/BuildTwo.wasm",
});

export const Player:FC = () => {
  
  const [isGameOver, setIsGameOver] = useState(false);
  
  useEffect(function () {
    unityContext.on("OnHit", function (position:string) {
      console.log("Hit at position:",position);
    });
  }, []);

  return (
    <div>
      <Unity unityContext={unityContext} style={{
          width: "80%",
          border: "2px solid black",
          background: "grey",
        }} />
    </div>
  );
}