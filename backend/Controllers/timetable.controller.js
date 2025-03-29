const Timetable = require('../Model/timetable.model');

exports.generateTimetables = async (req, res) => {
  try {
    const count = 100;
    const generatedTimetables = [];
    
    const specializations = [
      'Information Technology',
      'Data Science',
      'Software Engineering',
      'Interactive Media',
      'Cyber Security'
    ];
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const timeSlots = [
      '08:00-09:30',
      '09:45-11:15',
      '11:30-13:00',
      '14:00-15:30',
      '15:45-17:15'
    ];
    const subjects = ['Math', 'Programming', 'Database', 'Networking', 'Web Dev', 'AI', 'Security'];
    const rooms = ['A101', 'A102', 'B201', 'B202', 'C301', 'C302'];
    const lecturers = ['Dr. Smith', 'Prof. Johnson', 'Dr. Williams', 'Prof. Brown', 'Dr. Davis'];
    
    await Timetable.deleteMany({});
    
    for (let i = 0; i < count; i++) {
      const year = Math.floor(Math.random() * 4) + 1;
      const specialization = specializations[Math.floor(Math.random() * specializations.length)];
      const moduleCode = `${specialization.substring(0, 2).toUpperCase()}${year}`;
      
      const timetable = {
        year,
        specialization,
        moduleCode,
        days: []
      };
      
      for (const day of days) {
        const daySchedule = {
          day,
          slots: []
        };
        
        const slotCount = Math.floor(Math.random() * 3) + 3;
        const usedSlots = new Set();
        
        for (let j = 0; j < slotCount; j++) {
          let timeSlot;
          do {
            timeSlot = timeSlots[Math.floor(Math.random() * timeSlots.length)];
          } while (usedSlots.has(timeSlot));
          
          usedSlots.add(timeSlot);
          
          daySchedule.slots.push({
            time: timeSlot,
            subject: subjects[Math.floor(Math.random() * subjects.length)],
            room: rooms[Math.floor(Math.random() * rooms.length)],
            lecturer: lecturers[Math.floor(Math.random() * lecturers.length)]
          });
        }
        
        timetable.days.push(daySchedule);
      }
      
      const newTimetable = new Timetable(timetable);
      await newTimetable.save();
      generatedTimetables.push(newTimetable);
    }
    
    res.status(201).json(generatedTimetables);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    
    if (year) query.year = year;
    if (specialization) query.specialization = specialization;
    
    const timetables = await Timetable.find(query);
    res.json(timetables);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};