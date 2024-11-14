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
import ProtectedRoute from "./ProductedRouted";

function App() {
  return (
    <>
      <div>
        <Header />
        <Routes>
          <Route path="/main" element={<Main />} />

          {/* Gitare Page - Only accessible to students with gitareAccess or admins */}
          <Route
            path="/gitare"
            element={
              <ProtectedRoute
                allowedUserType="student"
                requiredAccess="GitareAccess"
              >
                <Gitare />
              </ProtectedRoute>
            }
          />

          {/* Vocal Page - Only accessible to students with vocalAccess or admins */}
          <Route
            path="/vocal"
            element={
              <ProtectedRoute
                allowedUserType="student"
                requiredAccess="VocalAccess"
              >
                <Vocal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-admin/:id"
            element={
              <ProtectedRoute allowedUserType="admin">
                <AdminAccount />
              </ProtectedRoute>
            }
          />

          {/* Video Page - Only accessible to admins */}
          <Route
            path="/videos/:id"
            element={
              <ProtectedRoute allowedUserType="admin">
                <VideoPage />
              </ProtectedRoute>
            }
          />

          <Route path="/add-file" element={<AddFile />} />

          {/* Account Pages */}
          <Route
            path="/account"
            element={
              <ProtectedRoute allowedUserType="student">
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/account-admin"
            element={
              <ProtectedRoute allowedUserType="admin">
                <AdminAccount />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/main" />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

export default App;
