import { useState } from 'react'
import { fetchBirdObservations } from './services/iNaturalistApi'
import { normalizeBird, isObservationBanned, normalizeValue, shuffleArray } from './utils/birdUtils'
import './App.css'

function App() {
  const [currentBird, setCurrentBird] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [banList, setBanList] = useState([])

  function toggleBan(type, value) {
    if (!value) {
      return
    }

    setBanList((prev) => {
      const exists = prev.some(
        (entry) => entry.type === type && normalizeValue(entry.value) === normalizeValue(value)
      )
      if (exists) {
        return prev.filter(
          (entry) => !(entry.type === type && normalizeValue(entry.value) === normalizeValue(value))
        )
      }
      return [...prev, { type, value }]
    })
  }

  async function discoverBird() {
    setLoading(true)
    setError(null)

    try {
      const observations = await fetchBirdObservations()

      if (observations.length === 0) {
        throw new Error('No bird observations were found. Try again in a moment.')
      }

      const birds = observations.map(normalizeBird).filter((bird) => bird.imageUrl)

      if (birds.length === 0) {
        throw new Error('No bird images were found in this batch. Try again.')
      }

      let candidates = birds.filter((bird) => !isObservationBanned(bird, banList))

      if (candidates.length === 0) {
        throw new Error('All results are banned. Remove a ban to discover more birds.')
      }

      if (currentBird) {
        const withoutCurrent = candidates.filter((bird) => bird.id !== currentBird.id)
        if (withoutCurrent.length > 0) {
          candidates = withoutCurrent
        }
      }

      candidates = shuffleArray(candidates)
      setCurrentBird(candidates[0])
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">iNaturalist bird finder</p>
        <h1>Feathered Friends</h1>
        <p className="intro">
          Discover photographed bird observations, then ban species, locations, or observers from
          future results.
        </p>
        <button className="discover-button" type="button" onClick={discoverBird} disabled={loading}>
          {loading ? 'Searching...' : 'Discover a Bird'}
        </button>
      </header>

      <section className="content-grid" aria-live="polite">
        <section className="results-panel" aria-labelledby="result-heading">
          <h2 id="result-heading">Current Bird</h2>

          {loading && (
            <div className="skeleton-card" role="status" aria-label="Loading bird observation">
              <p className="loading-text">Loading a bird observation...</p>
              <div className="skeleton-image" />
              <div className="skeleton-line long" />
              <div className="skeleton-line" />
              <div className="skeleton-line short" />
            </div>
          )}

          {error && !loading && (
            <p className="error-message" role="alert">
              {error}
            </p>
          )}

          {!loading && !currentBird && !error && (
            <p className="empty-message">Click Discover a Bird to begin.</p>
          )}

          {!loading && currentBird && (
            <article className="bird-card">
              <img
                className="bird-image"
                src={currentBird.imageUrl}
                alt={`Bird observation photo of ${currentBird.commonName || 'an unidentified bird'}`}
              />

              <div className="bird-details">
                <p>
                  <span>Common name</span>
                  <button
                    className="attribute-button"
                    type="button"
                    onClick={() => toggleBan('species', currentBird.commonName)}
                    disabled={!currentBird.commonName}
                  >
                    Ban species: {currentBird.commonName || 'Unknown species'}
                  </button>
                </p>
                <p>
                  <span>Scientific name</span>
                  <strong>{currentBird.scientificName || 'Unknown'}</strong>
                </p>
                <p>
                  <span>Location</span>
                  <button
                    className="attribute-button"
                    type="button"
                    onClick={() => toggleBan('location', currentBird.locationName)}
                    disabled={!currentBird.locationName}
                  >
                    Ban location: {currentBird.locationName || 'Unknown location'}
                  </button>
                </p>
                <p>
                  <span>Observation date</span>
                  <strong>{currentBird.observationDate || 'Unknown'}</strong>
                </p>
                <p>
                  <span>Observer</span>
                  <button
                    className="attribute-button"
                    type="button"
                    onClick={() => toggleBan('observer', currentBird.observerName)}
                    disabled={!currentBird.observerName}
                  >
                    Ban observer: {currentBird.observerName || 'Unknown observer'}
                  </button>
                </p>
                <p>
                  <span>Identifications</span>
                  <strong>{currentBird.identificationsCount ?? 'Unknown'}</strong>
                </p>
              </div>
            </article>
          )}
        </section>

        <aside className="ban-panel" aria-labelledby="ban-heading">
          <h2 id="ban-heading">Ban List</h2>
          {banList.length === 0 ? (
            <p>No banned species, locations, or observers.</p>
          ) : (
            <ul>
              {banList.map((entry) => (
                <li key={`${entry.type}:${entry.value}`}>
                  <button type="button" onClick={() => toggleBan(entry.type, entry.value)}>
                    <span>{entry.type}</span>
                    {entry.value}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </aside>
      </section>
    </main>
  )
}

export default App
