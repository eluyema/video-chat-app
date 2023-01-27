import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
  } from 'react-router-dom';
import { Login } from '../../scenes/Auth/scenes/Login/Login';
import { Register } from '../../scenes/Auth/scenes/Register/Register';
import MainPage from '../../scenes/MainPage/MainPage';
import Profile from '../../scenes/Profile/Profile';
import SessionsCreator from '../../scenes/SessionsRedactor/SessionsCreator/SessionsCreator';
import SessionsEditor from '../../scenes/SessionsRedactor/SessionsEditor/SessionsEditor';
import SessionsList from '../../scenes/SessionsRedactor/SessionsList/SessionsList';
import BaseTextFrame from '../../scenes/VideoSession/components/BaseTextFrame/BaseTextFrame';
import VideoSession from '../../scenes/VideoSession/VideoSession';
import AppWrapper from '../AppWrapper/AppWrapper';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute';

const Routing = () => {
    return  <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppWrapper />} >
          <Route index element={<MainPage />} />   
          <Route path="session/:shareId" element={<VideoSession />} />
          <Route path="session/end" element={<BaseTextFrame text="Session ended" emoji='🧐'/>} />
          <Route path="session/leaved" element={<BaseTextFrame text="You leaved session" emoji='😌'/>} />
          <Route path="login" element={<Login />}/>
          <Route path="register" element={<Register />}/>
          <Route path="profile" element={
              <ProtectedRoute redirectTo="/login">
                <Profile />
              </ProtectedRoute>}
            />
          <Route path="sessions" >
            <Route path="list" element={
              <ProtectedRoute redirectTo="/login">
                <SessionsList />
              </ProtectedRoute>}
            />
            <Route path="creator" element={
              <ProtectedRoute redirectTo="/login">
                <SessionsCreator />
              </ProtectedRoute>}
            />
            <Route path="editor/:shareId" element={
              <ProtectedRoute redirectTo="/login">
                <SessionsEditor />
              </ProtectedRoute>}
            />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
}

export default Routing;