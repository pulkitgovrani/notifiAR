import { createDataItemSigner, message } from "@permaweb/aoconnect";
import "./App.css";
import { ConnectButton } from "arweave-wallet-kit";
import { ArConnect } from "arweavekit/auth";
import { useState } from "react";

function App() {
  const processId = ""; //backend process id
  const [notifications, setNotifications] = useState(
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      title: `Project #${i + 1}`,
      description:
        i % 2 === 0
          ? "A new decentralized app is now live!"
          : "A unique NFT marketplace has been launched.",
      timestamp: "5 mins ago",
      isEnabled: true,
    }))
  );
  const [completeData, setCompleteData] = useState(notifications);
  const RegisterUser = async () => {
    const res = await message({
      process: processId,
      tags: [{ name: "Action", value: "Register" }],
      data: completeData,
      signer: createDataItemSigner(window.arweaveWallet),
    });
    console.log("registered user result", res);
    const registeredResult = await result({
      process: processId,
      message: res,
    });
    console.log("registered successfully,", registeredResult);

    // if(registeredResult[0].Messages[0].Data=="Successfully Registered"){

    // }
  };

  const toggleNotification = (id) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isEnabled: !notification.isEnabled }
          : notification
      )
    );
  };

  const handleSellClick = (id) => {
    alert(`Sell action for project #${id + 1}`);
  };

  async function connectAndFetchDetails() {
    try {
      await ArConnect.connect({
        permissions: ["ACCESS_ADDRESS", "ACCESS_PUBLIC_KEY"],
      });
      console.log("Wallet connected!");

      const walletAddress = await ArConnect.getActiveAddress();
      console.log("Wallet Address:", walletAddress);

      const publicKey = await ArConnect.getActivePublicKey();
      console.log("Public Key:", publicKey);
    } catch (error) {
      console.error("Error fetching wallet details:", error);
    }
  }

  return (
    <div className="App">
      <header className="header">
        <h1 className="header-title">NotifiAR</h1>
        <ConnectButton />
      </header>

      <main className="main">
        {/* <button className="connect-button" onClick={connectAndFetchDetails}>
          Connect & Fetch Wallet Details
        </button> */}

        <section className="notifications">
          <h2 className="section-title">
            {" "}
            Select The Conditions On which u want to get notification instantly{" "}
          </h2>
          <div className="notification-grid">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-card ${
                  notification.isEnabled ? "" : "disabled-card"
                }`}
              >
                <h3 className="notification-title">{notification.title}</h3>
                <p className="notification-description">
                  {notification.description}
                </p>
                <div className="card-actions">
                  <span className="timestamp">{notification.timestamp}</span>
                  <button
                    className="sell-button"
                    onClick={() => handleSellClick(notification.id)}
                  >
                    Sell
                  </button>
                  <label className="toggle-container">
                    <input
                      type="checkbox"
                      checked={notification.isEnabled}
                      onChange={() => toggleNotification(notification.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <span>Follow us on:</span>
        <div className="social-icons">
          <a href="#">
            <img
              src="https://cdn.prod.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png"
              alt="Discord"
            />
          </a>
          <a href="#">
            <img
              src="https://cdn4.iconfinder.com/data/icons/social-media-icons-the-circle-set/48/twitter_circle-512.png"
              alt="Twitter"
            />
          </a>
        </div>
      </footer>
    </div>
  );
}

export default App;
