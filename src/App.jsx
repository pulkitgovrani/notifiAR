import { createDataItemSigner, message } from "@permaweb/aoconnect";
import "./App.css";
import { ConnectButton } from "arweave-wallet-kit";
import { ArConnect } from "arweavekit/auth";
import { useState } from "react";

function App() {
  const processId = ""; // Backend process ID
  const [notifications, setNotifications] = useState([
    {
      id: 0,
      title: "New collection is added",
      description: "Get notified when a new collection is listed.",
      isEnabled: true,
    },
    {
      id: 1,
      title: "New asset is added",
      description: "Get notified when a new asset is listed.",
      isEnabled: true,
    },
    {
      id: 4,
      title: "Assets for a sell",
      description: "Get notified when assets are put up for sale.",
      isEnabled: true,
    },
    {
      id: 2,
      title: "Price of asset increased",
      description: "Get notified when the price of an asset rises above your specified threshold.",
      isEnabled: true,
      priceThreshold: "",
    },
    {
      id: 3,
      title: "Price of asset decreased",
      description: "Get notified when the price of an asset drops below your specified threshold.",
      isEnabled: true,
      priceThreshold: "",
    },
  ]);

  const RegisterUser = async () => {
    const res = await message({
      process: processId,
      tags: [{ name: "Action", value: "Register" }],
      data: notifications,
      signer: createDataItemSigner(window.arweaveWallet),
    });
    console.log("registered user result", res);
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

  const handlePriceChange = (id, value) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, priceThreshold: value }
          : notification
      )
    );
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
        <section className="notifications">
          <h2 className="section-title">
            Manage Your Notification Preferences
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
                {notification.id === 2 || notification.id === 3 ? (
                  <div className="price-input">
                    <label htmlFor={`price-${notification.id}`}>
                      Set Price Threshold:
                    </label>
                    <input
                      type="number"
                      id={`price-${notification.id}`}
                      className="price-input-field"
                      value={notification.priceThreshold || ""}
                      onChange={(e) =>
                        handlePriceChange(notification.id, e.target.value)
                      }
                      placeholder="Enter price"
                    />
                  </div>
                ) : null}
                <label className="toggle-container">
                  <input
                    type="checkbox"
                    checked={notification.isEnabled}
                    onChange={() => toggleNotification(notification.id)}
                  />
                  <span className="toggle-slider"></span>
                </label>
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
