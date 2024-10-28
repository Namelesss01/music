import "./App.css";
import Gitare from "./pages/gitare/Gitare";
import Vocal from "./pages/vocal/Vocal";
import Main from "./pages/main/Main";
import Header from "./shared/header/Header";
import Footer from "./shared/footer/Footer";
import { Route, Routes, Navigate } from "react-router-dom";
import VideoPage from "./pages/video_page/VideoPage";
import AddFile from "./pages/add_file/AddFile";
import Account from "./pages/account/Account";
import AdminAccount from "./pages/account-admin/AdminAccount";

function App() {
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="*" element={<Navigate to="/main" />} />
          <Route path="/main" element={<Main />} />
          <Route path="/gitare" element={<Gitare />} />
          <Route path="/vocal" element={<Vocal />} />
          <Route path="/videos/:id" element={<VideoPage />} />{" "}
          <Route path="/add-file" element={<AddFile />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account-admin" element={<AdminAccount />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
