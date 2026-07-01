const INATURALIST_OBSERVATIONS_URL = 'https://api.inaturalist.org/v1/observations'
const BIRD_TAXON_ID = '3'

/**
 * Fetch public bird observations that include photos from iNaturalist.
 *
 * @returns {Promise<Array<Object>>} Array of raw iNaturalist observation objects.
 */
export async function fetchBirdObservations() {
  const randomPage = String(Math.floor(Math.random() * 20) + 1)
  const params = new URLSearchParams({
    taxon_id: BIRD_TAXON_ID,
    photos: 'true',
    quality_grade: 'research',
    per_page: '50',
    page: randomPage,
  })

  const response = await fetch(`${INATURALIST_OBSERVATIONS_URL}?${params.toString()}`)

  if (!response.ok) {
    throw new Error(`iNaturalist request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()

  if (!Array.isArray(data?.results)) {
    throw new Error('iNaturalist response did not include observations.')
  }

  if (data.results.length === 0) {
    throw new Error('iNaturalist returned no bird observations.')
  }

  return data.results
}
