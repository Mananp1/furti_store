import dotenv from "dotenv";

dotenv.config();

const COUNTRY_STATE_CITY_API_KEY = process.env.COUNTRY_STATE_CITY_API_KEY;
const COUNTRY_STATE_CITY_BASE_URL = "https://api.countrystatecity.in/v1";

const addressCache = new Map();
const CACHE_DURATION = 24 * 60 * 60 * 1000; 


const TOP_INDIAN_STATES = [
  {
    name: "Maharashtra",
    iso2: "MH",
    cities: ["Mumbai", "Pune", "Nagpur", "Thane", "Nashik"],
  },
  {
    name: "Tamil Nadu",
    iso2: "TN",
    cities: ["Chennai", "Coimbatore", "Madurai", "Salem", "Tiruchirappalli"],
  },
  {
    name: "Gujarat",
    iso2: "GJ",
    cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Bhavnagar"],
  },
  {
    name: "Karnataka",
    iso2: "KA",
    cities: ["Bangalore", "Mysore", "Hubli", "Mangalore", "Belgaum"],
  },
  {
    name: "Uttar Pradesh",
    iso2: "UP",
    cities: ["Lucknow", "Kanpur", "Varanasi", "Agra", "Prayagraj"],
  },
  {
    name: "West Bengal",
    iso2: "WB",
    cities: ["Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri"],
  },
  {
    name: "Telangana",
    iso2: "TG",
    cities: ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam"],
  },
];


const validatePinCode = (pinCode) => {
  const pinRegex = /^[1-9][0-9]{5}$/;
  return pinRegex.test(pinCode);
};


const validateIndianAddress = (address) => {
  const errors = [];


  if (address.country && address.country !== "India") {
    errors.push("Only Indian addresses are allowed");
  }


  if (!address.zipCode || !validatePinCode(address.zipCode)) {
    errors.push("Please enter a valid 6-digit PIN code");
  }


  const stateExists = TOP_INDIAN_STATES.some(
    (state) => state.name === address.state
  );
  if (!address.state || !stateExists) {
    errors.push(
      "Please select a valid Indian state (top 7 states by GDP only)"
    );
  }


  if (!address.street || address.street.length < 5) {
    errors.push("Street address must be at least 5 characters");
  }

  if (!address.city || address.city.length < 2) {
    errors.push("City name must be at least 2 characters");
  }

  return {
    isValid: errors.length === 0,
    errors,
    suggestions: errors.length > 0 ? [] : null,
  };
};


export const getCitiesByState = async (stateName) => {
  try {

    const stateInfo = TOP_INDIAN_STATES.find(
      (state) => state.name === stateName
    );
    if (!stateInfo) {
      return [];
    }


    return stateInfo.cities;
  } catch (error) {
    console.error("Error fetching cities:", error);
    return [];
  }
};


export const getIndianStates = async () => {
  try {

    return TOP_INDIAN_STATES.map((state) => state.name);
  } catch (error) {
    console.error("Error fetching states:", error);
    return TOP_INDIAN_STATES.map((state) => state.name);
  }
};

export const validateAddress = async (address) => {
  try {
    const cacheKey = JSON.stringify(address);
    const cached = addressCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
      return cached.data;
    }


    const basicValidation = validateIndianAddress(address);
    if (!basicValidation.isValid) {
      return {
        isValid: false,
        standardizedAddress: null,
        suggestions: basicValidation.errors,
        confidence: 0,
        originalAddress: address,
        error: basicValidation.errors.join(", "),
      };
    }


    const stateInfo = TOP_INDIAN_STATES.find(
      (state) => state.name === address.state
    );
    if (stateInfo) {
      const cityExists = stateInfo.cities.some(
        (city) => city.toLowerCase() === address.city.toLowerCase()
      );

      if (!cityExists) {
        return {
          isValid: false,
          standardizedAddress: null,
          suggestions: stateInfo.cities.slice(0, 5).map((city) => ({
            formatted: `${city}, ${address.state}, India`,
            parsed: {
              street: address.street,
              city: city,
              state: address.state,
              zipCode: address.zipCode,
              country: "India",
            },
          })),
          confidence: 0.5,
          originalAddress: address,
          error: "City not found in the selected state",
        };
      }
    }


    const result = {
      isValid: true,
      standardizedAddress: {
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: "India",
      },
      suggestions: [],
      confidence: 1.0,
      originalAddress: address,
    };

    addressCache.set(cacheKey, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Address validation error:", error.message);
    return {
      isValid: false,
      standardizedAddress: null,
      suggestions: [],
      confidence: 0,
      originalAddress: address,
      error: error.message,
    };
  }
};

export const getAddressSuggestions = async (input) => {
  try {
    if (!input || input.length < 2) {
      return [];
    }


    const allCities = TOP_INDIAN_STATES.flatMap((state) =>
      state.cities.map((city) => ({
        name: city,
        state: state.name,
      }))
    );

    const filteredCities = allCities
      .filter((city) => city.name.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 5);

    return filteredCities.map((city) => ({
      description: `${city.name}, ${city.state}, India`,
      placeId: `${city.name.toLowerCase().replace(/\s+/g, "-")}`,
      city: city.name,
    }));
  } catch (error) {
    console.error("Address suggestions error:", error.message);
    return [];
  }
};
