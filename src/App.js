import React, { useState, useEffect } from "react";
import {
  getDefaultSession,
  handleIncomingRedirect,
  login,
  logout,
} from "@inrupt/solid-client-authn-browser";
import { getSolidDataset, getThing } from "@inrupt/solid-client";

export default function App() {
  const [webId, setWebId] = useState(getDefaultSession().info.webId);
  const [issuer, setIssuer] = useState("https://solid.liberson.app");
  const [resource, setResource] = useState(webId);
  const [data, setData] = useState(null);

  useEffect(() => {
    handleIncomingRedirect({
      restorePreviousSession: true,
    }).then((info) => {
      setWebId(info.webId);
      setResource(webId);
      console.log(webId);
    });
    // (async () => {
    //   const profileDataset = await getSolidDataset(
    //     getDefaultSession().info.webId,
    //     {
    //       fetch: webId.fetch,
    //     }
    //   );
    //   const profileThing = getThing(profileDataset, webId);
    //   console.log(profileThing);
    // })();
  }, [webId]);

  const handleLogin = (e) => {
    e.preventDefault();
    login({
      redirectUrl: window.location.href,
      oidcIssuer: issuer,
      clientName: "Liberson App",
    });
  };

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    setWebId(undefined);
    setData("");
    setResource("");
  };

  const handleFetch = (e) => {
    e.preventDefault();
    fetch(resource)
      .then((response) => response.text())
      .then(setData);
  };

  return (
    <div>
      <main>
        <h1>Sandbox app</h1>
        <p>{webId ? `Logged in as ${webId}` : "Not logged in yet"}</p>
        <div>
          <form>
            <input
              type="text"
              value={issuer}
              onChange={(e) => {
                setIssuer(e.target.value);
              }}
            />
            <button onClick={(e) => handleLogin(e)}>Log In</button>
            <button onClick={(e) => handleLogout(e)}>Log Out</button>
          </form>
        </div>
        <hr />
        <div>
          <input
            type="text"
            value={resource}
            onChange={(e) => {
              setResource(e.target.value);
            }}
          />
          <button onClick={(e) => handleFetch(e)}>Fetch</button>
        </div>
        <pre>{data}</pre>
        <img src={`${webId}/luis.jpeg`} alt="" />
      </main>
    </div>
  );
}
