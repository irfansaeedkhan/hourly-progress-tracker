import ProgressTracker from '@/components/ProgressTracker'

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Hourly Progress Tracker</h1>
      <ProgressTracker />
    </main>
  )
}