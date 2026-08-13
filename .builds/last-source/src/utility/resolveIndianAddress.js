import { City, State } from "country-state-city";

/**
 * Map resume / free-text state+city names to country-state-city IDs
 * so react-select + form validation (stateId / cityId) succeed.
 */
export const resolveIndianAddress = ({
  state = "",
  city = "",
  stateId = "",
  cityId = "",
} = {}) => {
  let nextState = (state || "").trim();
  let nextStateId = (stateId || "").trim();
  let nextCity = (city || "").trim();
  let nextCityId = (cityId || "").trim();

  const stateNeedle = (nextStateId || nextState).toLowerCase();
  if (stateNeedle) {
    const match = State.getStatesOfCountry("IN").find(
      (s) =>
        s.name?.toLowerCase() === stateNeedle ||
        s.isoCode?.toLowerCase() === stateNeedle
    );
    if (match) {
      nextState = match.name;
      nextStateId = match.isoCode;
    }
  }

  if (nextStateId && nextCity) {
    const cities = City.getCitiesOfState("IN", nextStateId) || [];
    const cityNeedle = nextCity.toLowerCase();
    const cityMatch = cities.find((c) => c.name?.toLowerCase() === cityNeedle);
    if (cityMatch) {
      nextCity = cityMatch.name;
      nextCityId = cityMatch.name;
    } else {
      nextCity = "";
      nextCityId = "";
    }
  } else if (nextCity) {
    nextCity = "";
    nextCityId = "";
  }

  return {
    state: nextState,
    stateId: nextStateId,
    city: nextCity,
    cityId: nextCityId,
  };
};

export default resolveIndianAddress;
