import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { FontSizeProvider } from './contexts/FontSizeContext';
import Home from './pages/Home';
import PhoneScreen from './pages/PhoneScreen';
import MessageScreen from './pages/MessageScreen';
import PhotoScreen from './pages/PhotoScreen';
import HospitalScreen from './pages/HospitalScreen';
import KakaoPractice from './pages/KakaoPractice';
import TaxiPractice from './pages/TaxiPractice';
import GuideList from './pages/GuideList';
import GuideDetail from './pages/GuideDetail';
import GuardianSettings from './pages/GuardianSettings';
import ScamCheck from './pages/ScamCheck';
import TaxiRealMode from './pages/TaxiRealMode';
import Transport from './pages/Transport';
import KioskPractice from './pages/KioskPractice';
import KioskAdvanced from './pages/KioskAdvanced';
import BasicOperations from './pages/BasicOperations';
import NotFound from './pages/NotFound';

function App() {
  return (
    <FontSizeProvider>
    <ErrorBoundary>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/phone" element={<PhoneScreen />} />
          <Route path="/message" element={<MessageScreen />} />
          <Route path="/photo" element={<PhotoScreen />} />
          <Route path="/hospital" element={<HospitalScreen />} />
          <Route path="/kakao-practice" element={<KakaoPractice />} />
          <Route path="/taxi-practice" element={<TaxiPractice />} />
          <Route path="/guides" element={<GuideList />} />
          <Route path="/guide/:id" element={<GuideDetail />} />
          <Route path="/guardian" element={<GuardianSettings />} />
          <Route path="/scam-check" element={<ScamCheck />} />
          <Route path="/taxi-real" element={<TaxiRealMode />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/kiosk-practice" element={<KioskPractice />} />
          <Route path="/kiosk-advanced" element={<KioskAdvanced />} />
          <Route path="/basics" element={<BasicOperations />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ErrorBoundary>
    </FontSizeProvider>
  );
}

export default App;
