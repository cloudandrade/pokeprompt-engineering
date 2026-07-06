import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '@/pages/HomePage/HomePage'
import { PokemonDetailPage } from '@/pages/PokemonDetailPage/PokemonDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/pokemon/:pokemonId" element={<PokemonDetailPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
