import { City, State } from "country-state-city";

/**
 * Map resume / free-text state+city to country-state-city master list only.
 * Unmatched values become empty (never keep free-text).
 * City-only: search all Indian cities and fill state from the match.
 */
export const resolveIndianAddress = ({
  state = "",
  city = "",
  stateId = "",
  cityId = "",
} = {}) => {
  const states = State.getStatesOfCountry("IN") || [];
  let nextState = "";
  let nextStateId = "";
  let nextCity = "";
  let nextCityId = "";

  const rawState = String(stateId || state || "").trim();
  const rawCity = String(city || cityId || "").trim();

  if (rawState) {
    const match = states.find(
      (s) =>
        s.name?.toLowerCase() === rawState.toLowerCase() ||
        s.isoCode?.toLowerCase() === rawState.toLowerCase()
    );
    if (match) {
      nextState = match.name;
      nextStateId = match.isoCode;
    }
  }

  if (rawCity) {
    const cityNeedle = rawCity.toLowerCase();

    if (nextStateId) {
      const cities = City.getCitiesOfState("IN", nextStateId) || [];
      const cityMatch = cities.find(
        (c) => c.name?.toLowerCase() === cityNeedle
      );
      if (cityMatch) {
        nextCity = cityMatch.name;
        nextCityId = cityMatch.name;
      }
    } else {
      // City only (or invalid state) — resolve from master across India
      for (const s of states) {
        const cities = City.getCitiesOfState("IN", s.isoCode) || [];
        const cityMatch = cities.find(
          (c) => c.name?.toLowerCase() === cityNeedle
        );
        if (cityMatch) {
          nextState = s.name;
          nextStateId = s.isoCode;
          nextCity = cityMatch.name;
          nextCityId = cityMatch.name;
          break;
        }
      }
    }
  }

  return {
    state: nextState,
    stateId: nextStateId,
    city: nextCity,
    cityId: nextCityId,
  };
};

export default resolveIndianAddress;
