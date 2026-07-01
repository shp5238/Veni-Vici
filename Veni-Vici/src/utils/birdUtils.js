/**
 * Normalize a value for case/whitespace-insensitive comparison.
 *
 * @param {unknown} value
 * @returns {string}
 */
export function normalizeValue(value) {
  return String(value ?? '').trim().toLowerCase()
}

const BAN_TYPE_TO_BIRD_FIELD = {
  species: 'commonName',
  location: 'locationName',
  observer: 'observerName',
}

/**
 * Check whether a normalized bird matches any entry on the ban list.
 * Ban entries have the shape { type: "species" | "location", value }.
 *
 * @param {Object} bird - A normalized bird object (see normalizeBird).
 * @param {Array<{type: string, value: string}>} banList
 * @returns {boolean}
 */
export function isObservationBanned(bird, banList) {
  if (!bird || !Array.isArray(banList) || banList.length === 0) {
    return false
  }

  return banList.some((entry) => {
    const field = BAN_TYPE_TO_BIRD_FIELD[entry.type]
    return field && normalizeValue(bird[field]) === normalizeValue(entry.value)
  })
}

/**
 * Return a new array with the same elements in random order (Fisher-Yates).
 *
 * @param {Array<*>} array
 * @returns {Array<*>}
 */
export function shuffleArray(array) {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Combine a raw iNaturalist observation into a
 * consistent bird shape used throughout the app.
 *
 * @param {Object} observation - Raw iNaturalist observation object.
 * @returns {Object} Normalized bird.
 */
export function normalizeBird(observation) {
  const taxon = observation.taxon ?? {}
  const photo = observation.photos?.[0] ?? {}
  const photoUrl = photo.url?.replace('square.', 'medium.') ?? null
  const observerName = observation.user?.name || observation.user?.login || null

  return {
    id: observation.id ?? null,
    commonName: taxon.preferred_common_name || observation.species_guess || taxon.name || null,
    scientificName: taxon.name ?? null,
    locationName: observation.place_guess ?? null,
    observationDate: observation.observed_on ?? null,
    observerName,
    identificationsCount: observation.identifications_count ?? null,
    imageUrl: photoUrl,
    imageAttribution: photo.attribution ?? null,
    observationUrl: observation.uri ?? null,
  }
}
