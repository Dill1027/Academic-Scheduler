const Timetable = require('../Model/timetable.model');

const timeSlots = ['08:30-10:30', '10:30-12:30', '13:30-15:30', '15:30-17:30', '17:30-19:30'];
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const specializations = ['Information Technology', 'Data Science', 'Software Engineering', 'Interactive Media', 'Cyber Security'];

exports.generateTimetables = async (req, res) => {
  try {
    const count = 5; // Generate 5 timetables per combination
    const generatedTimetables = [];
    
    await Timetable.deleteMany({});

    for (const specialization of specializations) {
      for (let year = 1; year <= 4; year++) {
        // Generate multiple variations for each year and specialization
        for (let variant = 1; variant <= count; variant++) {
          const timetable = {
            year,
            specialization,
            moduleCode: `${specialization.substring(0, 2).toUpperCase()}${year}-V${variant}`,
            days: []
          };

          for (const day of days) {
            const daySchedule = {
              day,
              slots: []
            };
            
            // Randomize number of slots between 3-5 for variety
            const slotsCount = Math.floor(Math.random() * 3) + 3;
            const availableSlots = [...timeSlots];

            for (let i = 0; i < slotsCount; i++) {
              if (availableSlots.length === 0) break;

              const slotIndex = Math.floor(Math.random() * availableSlots.length);
              const timeSlot = availableSlots.splice(slotIndex, 1)[0];

              daySchedule.slots.push({
                time: timeSlot,
                subject: `Subject ${year}-${variant}-${i + 1}`,
                venu: `Room ${year}${variant}${i + 1}`,
                lecturer: `Dr. ${String.fromCharCode(65 + i)}. ${specialization.split(' ')[0]}`
              });
            }

            timetable.days.push(daySchedule);
          }

          const newTimetable = new Timetable(timetable);
          await newTimetable.save();
          generatedTimetables.push(newTimetable);
        }
      }
    }

    res.status(201).json({
      success: true,
      count: generatedTimetables.length,
      data: generatedTimetables
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

exports.getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find();
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getFilteredTimetables = async (req, res) => {
  try {
    const { year, specialization } = req.query;
    const query = {};
    
    if (year) query.year = Number(year);
    if (specialization) query.specialization = specialization;
    
    const timetables = await Timetable.find(query);
    console.log('Filtered timetables:', { query, count: timetables.length });
    
    res.json(timetables);
  } catch (error) {
    console.error('Filter error:', error);
    res.status(500).json({ error: error.message });
  }
};