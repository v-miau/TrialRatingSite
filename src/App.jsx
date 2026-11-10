import { Routes, Route } from 'react-router'
import MapsPage from './pages/MapsPage.jsx'
import MapInfoPage from './pages/MapInfoPage.jsx'
import ReviewPage from './pages/ReviewPage.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MapsPage />} />
      <Route path="/:mapId" element={<MapInfoPage />} />
      <Route path="/:mapId/review" element={<ReviewPage />} />
    </Routes>
  )
}