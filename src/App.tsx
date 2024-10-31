import "./App.css";
import Gitare from "./pages/gitare/Gitare";
import Vocal from "./pages/vocal/Vocal";
import Main from "./pages/main/Main";
import Header from "./shared/header/Header";
import Footer from "./shared/footer/Footer";
import { Route, Routes, Navigate } from "react-router-dom"; // Removed Switch
import VideoPage from "./pages/video_page/VideoPage";
import AddFile from "./pages/add_file/AddFile";
import Account from "./pages/account/Account";
import AdminAccount from "./pages/account-admin/AdminAccount";
import ProtectedRoute from "./ProductedRouted";

function App() {
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="/main" element={<Main />} />
          <Route path="/gitare" element={<Gitare />} />
          <Route path="/vocal" element={<Vocal />} />
          {/* Оберните VideoPage в ProtectedRoute */}
          <Route
            path="/videos/:id"
            element={
              <ProtectedRoute allowedUserType="admin">
                <VideoPage />
              </ProtectedRoute>
            }
          />
          <Route path="/add-file" element={<AddFile />} />
          <Route path="/account" element={<Account />} />
          <Route path="/account-admin" element={<AdminAccount />} />
          <Route path="*" element={<Navigate to="/main" />} />
        </Routes>

        <Footer />
      </div>
    </>
  );
}

export default App;
