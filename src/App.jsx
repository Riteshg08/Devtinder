import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Body from "./components/Body";
import Profile from "./pages/Profile";
import Landing from "./pages/Landing";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import Feed from "./pages/Feed";
import Connections from "./pages/Connections";
import Requests from "./pages/Requests";
import Signup from "./pages/Signup";
import Messages from "./pages/Messages";
import Notifications from "./pages/Notifications";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";
// import Chat from "./pages/Chat";
import EditProfile from "./pages/EditProfile";

function App() {

  return (
    <>
      <Provider store={appStore}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Body />}>
              <Route index element={<Landing />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/connections" element={<Connections />} />
              <Route path="/requests" element={<Requests />} />
              <Route path="/messages" element={<Messages />} />
              {/* <Route path="/messages/:targetUserId" element={<Chat />} /> */}
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </>
  );
}

export default App;
