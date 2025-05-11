import axios from "axios";

// Create axios instance with better defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000/api",
  timeout: 15000, // Increased timeout
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  withCredentials: true // If using cookies/sessions
});

// Request interceptor for logging and auth tokens
api.interceptors.request.use(config => {
  console.log(`[API] Sending ${config.method?.toUpperCase()} to ${config.url}`);
  // Add auth token if exists
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error('[API] Request error:', error);
  return Promise.reject(error);
});

// Response interceptor for consistent error handling
api.interceptors.response.use(response => {
  console.log('[API] Response received:', response.config.url, response.status);
  return response.data; // Return only the data part
}, error => {
  console.error('[API] Response error:', error.response?.status, error.message);
  
  if (error.code === 'ERR_NETWORK') {
    throw new Error('Unable to connect to server. Please check if the backend is running.');
  }
  
  if (error.response?.status === 403) {
    throw new Error('CORS error - please check server configuration');
  }

  if (error.response?.status === 429) {
    throw new Error('Rate limit exceeded. Please wait a moment before trying again.');
  }
  
  // Handle specific error cases
  if (error.response) {
    switch (error.response.status) {
      case 401:
        // Handle unauthorized
        break;
      case 404:
        return []; // Return empty array for 404
      case 500:
        // Handle server error
        break;
    }
  }
  
  throw error;
});

/**
 * Fetch timetables by year with enhanced error handling
 * @param {number} year - Academic year to fetch
 * @returns {Promise<Array>} Array of timetables
 */
export const fetchTimetablesByYear = async (year) => {
  try {
    if (!year || typeof year !== 'number') {
      throw new Error('Invalid year parameter');
    }

    const retryDelay = 2000; // 2 seconds
    let retries = 3;

    while (retries > 0) {
      try {
        const response = await api.get(`/timetables/filter`, {
          params: { year }
        });
        return response;
      } catch (error) {
        if (error.response?.status === 429 && retries > 1) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          retries--;
          continue;
        }
        throw error;
      }
    }
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Generate timetables with enhanced error handling
 * @param {number} count - Number of timetables to generate
 * @returns {Promise<Object>} Generated timetables
 */
export const generateTimetables = async (count = 5) => {
  try {
    console.log('Generating timetables, count:', count);
    // For development/demo, return mock data if API call fails
    try {
      const response = await api.post("/timetables/generate", { count });
      return { data: response, success: true };
    } catch (apiError) {
      console.warn("API call failed, using mock data:", apiError);
      // Generate mock timetable data instead of failing
      return { 
        data: generateMockTimetables(count),
        success: true,
        isMock: true
      };
    }
  } catch (error) {
    console.error("Timetable generation error:", error);
    return { 
      data: [], 
      error: error.message,
      success: false
    };
  }
};

// Helper function to generate more detailed mock timetable data
const generateMockTimetables = (count = 5) => {
  // Import needed data dynamically to avoid circular dependencies
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
  const timeSlots = ['08:30-10:30', '10:30-12:30', '13:30-15:30', '15:30-17:30'];
  
  const courses = [
    { code: 'CS101', name: 'Introduction to Programming', lecturer: 'Dr. Smith' },
    { code: 'CS102', name: 'Data Structures', lecturer: 'Prof. Johnson' },
    { code: 'CS203', name: 'Algorithms', lecturer: 'Dr. Williams' },
    { code: 'CS301', name: 'Database Systems', lecturer: 'Prof. Davis' },
    { code: 'CS401', name: 'Software Engineering', lecturer: 'Dr. Wilson' },
    { code: 'IT101', name: 'Internet Technologies', lecturer: 'Dr. Brown' },
    { code: 'IT202', name: 'Network Programming', lecturer: 'Prof. Miller' },
    { code: 'SE301', name: 'Software Testing', lecturer: 'Dr. Taylor' },
    { code: 'DS401', name: 'Machine Learning', lecturer: 'Prof. Anderson' },
    { code: 'CS501', name: 'Artificial Intelligence', lecturer: 'Dr. Thomas' }
  ];
  
  const venues = [
    'Room A401', 'Room B201', 'Lab 1', 'Lab 2', 'Conference Hall', 
    'Room C102', 'Auditorium', 'Room D301', 'Computer Lab'
  ];
  
  const specializations = [
    'Information Technology', 'Software Engineering', 'Data Science',
    'Cyber Security', 'Information Systems Engineering'
  ];
  
  const timetables = [];
  
  for (let i = 0; i < count; i++) {
    const yearNum = Math.floor(Math.random() * 4) + 1;
    const specializationName = specializations[Math.floor(Math.random() * specializations.length)];
    
    const timetable = {
      id: i + 1,
      year: yearNum,
      specialization: specializationName,
      moduleCode: `TT${i+1}`,
      days: days.map((day, dayIndex) => {
        // Create 2-4 slots per day that are well distributed
        const slots = [];
        
        // Ensure each time slot has at least one class per week
        // and distribute classes more evenly
        timeSlots.forEach((timeSlot, timeIndex) => {
          // Create class with 60% probability, but ensure good distribution
          if (Math.random() < 0.6 || 
              (dayIndex + timeIndex) % count === i) {
            
            const courseIndex = Math.floor(Math.random() * courses.length);
            const venueIndex = Math.floor(Math.random() * venues.length);
            
            slots.push({
              time: timeSlot,
              subject: courses[courseIndex].name,
              code: courses[courseIndex].code,
              venu: venues[venueIndex],
              lecturer: courses[courseIndex].lecturer
            });
          }
        });
        
        return {
          day,
          slots
        };
      })
    };
    timetables.push(timetable);
  }
  
  console.log("Generated mock timetables:", timetables);
  return timetables;
};

export const getAllTimetables = async () => {
  try {
    const response = await api.get("/timetables");
    return { data: response?.data || [] };
  } catch (error) {
    console.error("API Error:", error);
    return { data: [] };
  }
};

export const getFilteredTimetables = async (filters = {}) => {
  try {
    console.log('Filtering with:', filters);

    const params = {};
    if (filters.year) params.year = Number(filters.year);
    if (filters.specialization) params.specialization = filters.specialization;

    console.log('API request params:', params);
    const response = await api.get("/timetables/filter", { params });
    console.log('API response:', response);
    
    // Handle both array and object responses
    return {
      data: Array.isArray(response) ? response : response?.data || [],
      success: true
    };
  } catch (error) {
    console.error("API Error:", error);
    return { 
      data: [], 
      error: error.message,
      success: false
    };
  }
};

export const generateTimetablesForYearSpec = async (year, specialization) => {
  try {
    console.log(`Generating timetables for Year ${year}, Specialization: ${specialization}`);
    
    // Generate mock data for now, with specific year and specialization
    const mockData = generateMockTimetables(3).map(tt => ({
      ...tt,
      year: Number(year),
      specialization: decodeURIComponent(specialization)
    }));
    
    return { 
      data: mockData,
      success: true,
      isMock: true
    };
  } catch (error) {
    console.error('Error in generateTimetablesForYearSpec:', error);
    return { 
      data: [], 
      error: error.message,
      success: false
    };
  }
};

/**
 * Get timetable by year and specialization
 * @param {number} year - Academic year
 * @param {string} specialization - Program specialization
 * @returns {Promise<Array>} - Array of timetable data
 */
export const getTimetableByYearAndSpec = async (year, specialization) => {
  try {
    console.log(`Fetching timetable for Year ${year}, Specialization: ${specialization}`);
    
    if (!year) {
      throw new Error('Year parameter is required');
    }
    
    const params = { 
      year: Number(year)
    };
    
    if (specialization) {
      params.specialization = specialization;
    }
    
    const response = await api.get('/timetables/filter', { params });
    return { 
      data: Array.isArray(response) ? response : response?.data || [],
      success: true
    };
  } catch (error) {
    console.error("API Error:", error);
    return { 
      data: [], 
      error: error.message,
      success: false
    };
  }
};

// Named exports preferred over default export
export default {
  fetchTimetablesByYear,
  generateTimetables,
  getAllTimetables,
  getFilteredTimetables,
  generateTimetablesForYearSpec,
  getTimetableByYearAndSpec,
};