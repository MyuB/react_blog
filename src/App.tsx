import { useEffect, useState, useContext } from "react";
import { app } from "firebaseApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ThemeContext from "context/ThemeContext";

import Router from "./components/Router";
import Loader from "components/Loader";

function App() {
  const context = useContext(ThemeContext);
  const auth = getAuth(app);
  const [init, setInit] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    !!auth?.currentUser
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        if (user.email === "infoAdmin@hyundai.com") {
          setIsAdmin(true);
        }
      } else {
        setIsAuthenticated(false);
      }
      setInit(true);
    });
  }, [auth]);

  return (
    <div className={context.theme === "light" ? "white" : "dark"}>
      <ToastContainer />
      {init ? (
        <Router isAuthenticated={isAuthenticated} admin={isAdmin} />
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default App;
