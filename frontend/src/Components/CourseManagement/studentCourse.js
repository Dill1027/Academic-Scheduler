import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from "../Navbar";
import Footer from "../Navbar/footer";
import swal from 'sweetalert';
import { BsFillPencilFill, BsPlusCircleFill, BsXCircleFill } from 'react-icons/bs';

const StudentCourse = () => {
  const [students, setStudents] = useState([]);
  const [specializationFilter, setSpecializationFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newModules, setNewModules] = useState(['', '', '', '', '']);
  const [availableModules, setAvailableModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);  // Add error state
  const [retryCount, setRetryCount] = useState(0);  const [retryCount, setRetryCount] = useState(0);
 = 3;
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {setIsLoading(true);
    setIsLoading(true);
    setError(null);t:6001/api/student', {
    try {
      const response = await axios.get('http://localhost:6001/api/student', { timeout: 5000 }););
      setStudents(response.data);etStudents(response.data);
    } catch (error) {        console.log('Students:', response.data);
      console.error("Error fetching student data", error);
      setError("Failed to load student data.");Error fetching students:', err);
    } finally {f (retryCount < MAX_RETRIES) {
      setIsLoading(false);
    }000); // Retry after 2 seconds
  };
eck your connection and try again.');
  const fetchAllModules = async () => {check your connection and try again.", "error");
    try {
      const response = await axios.get('http://localhost:6001/api/docs', { timeout: 5000 });
      setAvailableModules(response.data);   setIsLoading(false);
    } catch (error) {  }
      console.error("Error fetching modules data", error);    };
      swal("Error", "Failed to load modules data.", "error");
    }Data();
  };

  const getFilteredModules = (specialization, year) => { = async () => {
    if (!specialization || !year) return [];
    const yearString = `${year}${getOrdinalSuffix(year)} Year`;
    return availableModules const response = await axios.get('http://localhost:6001/api/student');
      .filter(module => module.course === specialization && module.year === yearString)  setStudents(response.data);
      .map(module => module.moduleName);    } catch (error) {
  };);
data. Please try again.", "error");
  const handleAddModuleClick = (student) => {
    setSelectedStudent(student);
    const initialModules = student.modules 
      ? [...student.modules, ...Array(5 - student.modules.length).fill('')].slice(0, 5)
      : ['', '', '', '', ''];
      const fetchAllModules = async () => {
    setNewModules(initialModules);
    setShowAddModuleModal(true);os.get('http://localhost:6001/api/docs');
  };

  const handleModuleChange = (index, value) => {tching modules data", error);
    setNewModules(prevModules => {  swal("Error", "Failed to load modules data.", "error");
      const updatedModules = [...prevModules];
      updatedModules[index] = value;
      return updatedModules;
    });  const getFilteredModules = (specialization, year) => {
  };
etOrdinalSuffix(year)} Year`;
  const saveModules = async () => {
    if (!selectedStudent || !selectedStudent._id) return;e === specialization && module.year === yearString)
    moduleName);
    try {
      const modulesToSave = newModules
        .map(module => module.trim())  const handleAddModuleClick = (student) => {
        .filter(module => module !== '');
      
      await axios.put(  ? [...student.modules, ...Array(5 - student.modules.length).fill('')].slice(0, 5)
        `http://localhost:6001/api/student/${selectedStudent._id}/modules`,'', '', '', '', ''];
        { modules: modulesToSave }
      );
      
      swal("Success", "Modules saved successfully!", "success").then(() => {
        fetchStudents();
        setShowAddModuleModal(false);
      });
      nst updatedModules = [...prevModules];
    } catch (error) {updatedModules[index] = value;
      console.error("Error saving modules", error);
      swal("Error", error.response?.data?.error || "Failed to save modules. Please try again.", "error");
    }
  };
t saveModules = async () => {
  const getOrdinalSuffix = (num) => {ent || !selectedStudent._id) return;
    if (!num) return '';
    const j = num % 10;
    const k = num % 100; const modulesToSave = newModules
    if (j === 1 && k !== 11) return 'st';    .map(module => module.trim())
    if (j === 2 && k !== 12) return 'nd';        .filter(module => module !== '');
    if (j === 3 && k !== 13) return 'rd';
    return 'th';
  };st:6001/api/student/${selectedStudent._id}/modules`,
esToSave }
  const retryFetch = () => {
    setRetryCount(prevCount => prevCount + 1);
    fetchStudents();essfully!", "success").then(() => {
  };dents();
    setShowAddModuleModal(false);
  const filteredStudents = students.filter(student => {      });
    const matchesSpecialization = !specializationFilter || 
      student.specialization === specializationFilter;
    
    const matchesYear = !yearFilter ||   swal("Error", error.response?.data?.error || "Failed to save modules. Please try again.", "error");
      (student.year ? student.year.toString() === yearFilter : false);
    
    return matchesSpecialization && matchesYear;
  });
f (!num) return '';
  if (isLoading) {    const j = num % 10;
    return (% 100;
      <div className="student-course__loading">
        <div className="loading-spinner"></div> if (j === 2 && k !== 12) return 'nd';
        Loading...    if (j === 3 && k !== 13) return 'rd';
      </div> 'th';
    );
  }
  const filteredStudents = students.filter(student => {
  if (error) {Filter || 
    return (
      <div className="student-course__error">
        {error}
        <div>Retry Count: {retryCount}</div>lter : false);
        <button className="retry-button" onClick={retryFetch}>Retry</button>
      </div>
    );
  }
ng) {
  return (
    <div>
      <Navbar />

      <div className="student-course__container">}
        <h2 className="student-course__title">Module Allocation For Students</h2>
        
        <div className="student-course__filters">  }
          <div className="student-course__filter-group">
            <select 
              onChange={(e) => setSpecializationFilter(e.target.value)} 
              value={specializationFilter} 
              className="student-course__filter-select"rror}</p>
            >
              <option value="">All Specializations</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Software Engineering">Software Engineering</option>
              <option value="Cyber Security">Cyber Security</option>
              <option value="Interactive Media">Interactive Media</option>retry-button"
              <option value="Data Science">Data Science</option>
            </select>y
        </button>
            <select 
              onChange={(e) => setYearFilter(e.target.value)} 
              value={yearFilter} 
              className="student-course__filter-select"
            >
              <option value="">All Years</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>urse__container">
              <option value="4">4th Year</option>me="student-course__title">Module Allocation For Students</h2>
            </select>
          </div>ame="student-course__filters">
        </div>er-group">

        <div className="student-course__table-container">
          <table className="student-course__table">
            <thead className="student-course__table-header">
              <tr>
                <th>Student Name</th>ue="">All Specializations</option>
                <th>Year</th>
                <th>Specialization</th>ing</option>
                <th>Modules</th>urity</option>
                <th>Actions</th>ption>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="student-course__table-row">Filter} 
                    <td className="student-course__student-name">{student.studentName}</td>
                    <td className="student-course__student-year">
                      {student.year ? `${student.year}${getOrdinalSuffix(student.year)} Year` : 'N/A'}
                    </td>
                    <td className="student-course__student-specialization">{student.specialization}</td>alue="2">2nd Year</option>
                    <td className="student-course__student-modules">
                      {student.modules?.length > 0 ? (>4th Year</option>
                        <ul className="student-course__module-list">
                          {student.modules.map((module, idx) => (
                            <li key={idx} className="student-course__module-item">{module}</li>
                          ))}
                        </ul>
                      ) : <span className="student-course__no-modules">No modules assigned</span>}
                    </td>assName="student-course__table-header">
                    <td className="student-course__actions">r>
                      <button Student Name</th>
                        className="student-course__edit-btn"h>Year</th>
                        onClick={() => handleAddModuleClick(student)}  <th>Specialization</th>
                      >                <th>Modules</th>
                        {student.modules?.length > 0 ? <><BsFillPencilFill /> Edit Modules</> : <><BsPlusCircleFill /> Add Modules</>}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr className="student-course__no-data-row">
                  <td colSpan="5" className="student-course__no-data">No students found</td>
                </tr> className="student-course__student-year">
              )}dent.year ? `${student.year}${getOrdinalSuffix(student.year)} Year` : 'N/A'}
            </tbody>
          </table>pecialization">{student.specialization}</td>
        </div>es">
   {student.modules?.length > 0 ? (
        {showAddModuleModal && selectedStudent && (course__module-list">
          <div className="student-course__modal-overlay">student.modules.map((module, idx) => (
            <div className="student-course__modal">      <li key={idx} className="student-course__module-item">{module}</li>
              <div className="student-course__modal-content">
                <div className="student-course__modal-header">
                  <h5 className="student-course__modal-title">
                    {selectedStudent.modules?.length > 0 ? 'Edit' : 'Add'} Modules for {selectedStudent.studentName} 
                    ({selectedStudent.specialization}, {selectedStudent.year}{getOrdinalSuffix(selectedStudent.year)} Year)
                  </h5>
                  <button ="student-course__edit-btn"
                    type="button" > handleAddModuleClick(student)}
                    className="student-course__modal-close" 
                    onClick={() => setShowAddModuleModal(false)}ngth > 0 ? <><BsFillPencilFill /> Edit Modules</> : <><BsPlusCircleFill /> Add Modules</>}
                  >
                    <BsXCircleFill size={24} />
                  </button>
                </div>
                <div className="student-course__modal-body">
                  <div className="student-course__available-modules">me="student-course__no-data-row">
                    <h6 className="student-course__available-modules-title">Available Modules:</h6>assName="student-course__no-data">No students found</td>
                    {getFilteredModules(selectedStudent.specialization, selectedStudent.year).length > 0 ? (
                      <div className="student-course__module-buttons">
                        {getFilteredModules(selectedStudent.specialization, selectedStudent.year).map((module, idx) => (
                          <button
                            key={idx}
                            className="student-course__module-btn"
                            onClick={() => {dal && selectedStudent && (
                              const emptyIndex = newModules.findIndex(m => m === '');          <div className="student-course__modal-overlay">
                              const indexToUpdate = emptyIndex !== -1 ? emptyIndex : newModules.length - 1;
                              handleModuleChange(indexToUpdate, module);
                            }}ader">
                            disabled={newModules.includes(module)}
                          >udent.studentName} 
                            {module}tudent.specialization}, {selectedStudent.year}{getOrdinalSuffix(selectedStudent.year)} Year)
                          </button>
                        ))}
                      </div>
                    ) : (Name="student-course__modal-close" 
                      <p className="student-course__no-available-modules">No modules available for this specialization/year combination</p>
                    )}
                  </div>ize={24} />

                  <div className="student-course__selected-modules">
                    <h6 className="student-course__selected-modules-title">Selected Modules (max 5):</h6>
                    {newModules.map((module, index) => (ame="student-course__available-modules">
                      <div className="student-course__module-select-container" key={index}>student-course__available-modules-title">Available Modules:</h6>
                        <label className="student-course__module-label">Module {index + 1}</label>es(selectedStudent.specialization, selectedStudent.year).length > 0 ? (
                        <selectassName="student-course__module-buttons">
                          className="student-course__module-select"redModules(selectedStudent.specialization, selectedStudent.year).map((module, idx) => (
                          value={module}utton
                          onChange={(e) => handleModuleChange(index, e.target.value)}     key={idx}
                        >    className="student-course__module-btn"
                          <option value="">Select a module</option>      onClick={() => {
                          {getFilteredModules(selectedStudent.specialization, selectedStudent.year).map((mod, idx) => (ndIndex(m => m === '');
                            <option     const indexToUpdate = emptyIndex !== -1 ? emptyIndex : newModules.length - 1;
                              key={idx} leModuleChange(indexToUpdate, module);
                              value={mod}
                              disabled={newModules.includes(mod) && mod !== module})}
                            >       >
                              {mod}  {module}
                            </option>/button>
                          ))}}
                        </select>
                      </div>
                    ))}nt-course__no-available-modules">No modules available for this specialization/year combination</p>
                  </div>
                </div>/div>
                <div className="student-course__modal-footer">
                  <button sName="student-course__selected-modules">
                    type="button" 6 className="student-course__selected-modules-title">Selected Modules (max 5):</h6>
                    className="student-course__modal-cancel" {newModules.map((module, index) => (
                    onClick={() => setShowAddModuleModal(false)}    <div className="student-course__module-select-container" key={index}>
                  >        <label className="student-course__module-label">Module {index + 1}</label>
                    Cancel              <select
                  </button>              className="student-course__module-select"
                  <button           value={module}
                    type="button"              onChange={(e) => handleModuleChange(index, e.target.value)}
                    className="student-course__modal-save"               >
                    onClick={saveModules}e="">Select a module</option>
                    disabled={newModules.every(module => module.trim() === '')}FilteredModules(selectedStudent.specialization, selectedStudent.year).map((mod, idx) => (
                  >ption 
                    Save Modules  key={idx} 
                  </button>
                </div>                   disabled={newModules.includes(mod) && mod !== module}
              </div>
            </div>mod}
          </div> </option>
        )}
      </div>lect>
      <Footer />
      <style>
        {`       </div>
          .student-course__container {
            max-width: 1200px;Name="student-course__modal-footer">
            margin: 2rem auto;
            padding: 0 1rem;" 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;         className="student-course__modal-cancel" 
          }wAddModuleModal(false)}
          .student-course__title {
            text-align: center;ncel
            color: #2c3e50;on>
            margin-bottom: 2rem;       <button 
            font-size: 2rem;
            font-weight: 600;className="student-course__modal-save" 
            letter-spacing: 0.5px;Modules}
          }dules.every(module => module.trim() === '')}
          .student-course__filters {
            display: flex;
            justify-content: space-between;
            margin-bottom: 2rem;
          }
          .student-course__filter-group { </div>
            display: flex;
            gap: 1rem;
            width: 100%;
          }
          .student-course__filter-select {e>
            flex: 1;
            padding: 0.5rem 1rem;ntainer {
            border: 1px solid #ddd;
            border-radius: 4px;
            background-color: white; padding: 0 1rem;
            font-size: 1rem;', Tahoma, Geneva, Verdana, sans-serif;
            color: #333;
            transition: border-color 0.3s;
          }
          .student-course__filter-select:focus { color: #2c3e50;
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);600;
          } letter-spacing: 0.5px;
          .student-course__table-container {
            overflow-x: auto;_filters {
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            border-radius: 8px;space-between;
          } margin-bottom: 2rem;
          .student-course__table {
            width: 100%;
            border-collapse: collapse;
            background-color: white; gap: 1rem;
          }
          .student-course__table-header {
            background-color: #2c3e50;student-course__filter-select {
            color: white;
          }m 1rem;
          .student-course__table-header th {dd;
            padding: 1rem; border-radius: 4px;
            text-align: left;
            font-weight: 500;
          }
          .student-course__table-row { transition: border-color 0.3s;
            border-bottom: 1px solid #eee;
            transition: background-color 0.2s;rse__filter-select:focus {
          }
          .student-course__table-row:hover {;
            background-color: #f8f9fa; box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
          }
          .student-course__table-row td {ontainer {
            padding: 1rem; overflow-x: auto;
            vertical-align: top;(0, 0, 0, 0.1);
          }8px;
          .student-course__student-name {
            font-weight: 500;student-course__table {
            color: #2c3e50;
          }e: collapse;
          .student-course__module-list {ite;
            margin: 0;
            list-style: none;student-course__table-header {
            padding-left: 1.2rem;;
          }
          .student-course__module-item {
            margin-bottom: 0.3rem;__table-header th {
          };
          .student-course__no-modules {
            color: #7f8c8d;;
            font-style: italic;
          }
          .student-course__actions button { border-bottom: 1px solid #eee;
            display: flex;2s;
            align-items: center;
            gap: 0.3rem;w:hover {
          } background-color: #f8f9fa;
          .student-course__edit-btn {
            padding: 0.5rem 1rem; td {
            background-color: #3498db; padding: 1rem;
            color: white;
            border: none;
            border-radius: 4px;_student-name {
            cursor: pointer;0;
            font-size: 0.9rem; color: #2c3e50;
            transition: background-color 0.2s, transform 0.2s;
          }le-list {
          .student-course__edit-btn:hover {
            background-color: #2980b9;e;
            transform: scale(1.03);em;
          }
          .student-course__no-data-row {
            background-color: white;.3rem;
          }
          .student-course__no-data {ourse__no-modules {
            text-align: center;f8c8d;
            padding: 2rem;: italic;
            color: #7f8c8d;
          }_actions button {
          .student-course__loading {
            text-align: center;
            padding: 2rem;
            color: #3498db;
            font-size: 1.2rem;student-course__edit-btn {
          }rem;
          .student-course__modal-overlay {498db;
            position: fixed;
            top: 0; border: none;
            left: 0;
            right: 0;nter;
            bottom: 0;;
            background-color: rgba(0, 0, 0, 0.5);round-color 0.2s, transform 0.2s;
            display: flex;
            justify-content: center;hover {
            align-items: center;2980b9;
            z-index: 1000;
            animation: fadeIn 0.3s ease-in-out;
          }student-course__no-data-row {
          @keyframes fadeIn {white;
            from { opacity: 0; }
            to { opacity: 1; }
          } text-align: center;
          .student-course__modal {
            width: 90%;;
            max-width: 800px;
            max-height: 90vh;__loading {
            overflow-y: auto; text-align: center;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
            animation: slideIn 0.3s ease-in-out;
          }
          @keyframes slideIn {
            from { transform: translateY(-20px); opacity: 0; } top: 0;
            to { transform: translateY(0); opacity: 1; }
          }
          .student-course__modal-content {
            display: flex;rgba(0, 0, 0, 0.5);
            flex-direction: column; display: flex;
            height: 100%;
          }er;
          .student-course__modal-header {;
            padding: 1.5rem;n 0.3s ease-in-out;
            border-bottom: 1px solid #eee;
            display: flex;
            justify-content: space-between; from { opacity: 0; }
            align-items: center;
          }
          .student-course__modal-title {student-course__modal {
            margin: 0;
            color: #2c3e50;;
            font-size: 1.3rem;0vh;
          }
          .student-course__modal-close { background-color: white;
            background: none;
            border: none;px rgba(0, 0, 0, 0.15);
            cursor: pointer; animation: slideIn 0.3s ease-in-out;
            color: #7f8c8d;
            transition: color 0.2s;In {
          }anslateY(-20px); opacity: 0; }
          .student-course__modal-close:hover { translateY(0); opacity: 1; }
            color: #e74c3c;
          }student-course__modal-content {
          .student-course__modal-body {
            padding: 1.5rem;: column;
            flex-grow: 1;
            overflow-y: auto;
          }-header {
          .student-course__available-modules { padding: 1.5rem;
            margin-bottom: 2rem;ee;
          }
          .student-course__available-modules-title {;
            margin-top: 0;
            margin-bottom: 1rem;
            color: #2c3e50;l-title {
            font-size: 1.1rem;
          }
          .student-course__module-buttons {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-bottom: 1rem;
          } cursor: pointer;
          .student-course__module-btn {
            padding: 0.5rem 1rem;olor 0.2s;
            background-color: transparent;
            border: 1px solid #3498db;:hover {
            color: #3498db;c;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;;
            transition: all 0.2s;
          } overflow-y: auto;
          .student-course__module-btn:hover:not(:disabled) {
            background-color: #3498db;_available-modules {
            color: white;
          }
          .student-course__module-btn:disabled {ilable-modules-title {
            opacity: 0.6; margin-top: 0;
            cursor: not-allowed;
            background-color: #3498db;
            color: white; font-size: 1.1rem;
          }
          .student-course__no-available-modules {module-buttons {
            color: #7f8c8d;
            font-style: italic;;
          }
          .student-course__selected-modules-title { margin-bottom: 1rem;
            margin-top: 0;
            margin-bottom: 1rem;e__module-btn {
            color: #2c3e50;1rem;
            font-size: 1.1rem;parent;
          }3498db;
          .student-course__module-select-container {
            margin-bottom: 1rem;px;
          }ter;
          .student-course__module-label {
            display: block; transition: all 0.2s;
            margin-bottom: 0.5rem;
            color: #34495e;_module-btn:hover:not(:disabled) {
            font-size: 0.9rem;8db;
          }
          .student-course__module-select {
            width: 100%;abled {
            padding: 0.7rem;
            border: 1px solid #ddd;
            border-radius: 4px;or: #3498db;
            background-color: white;
            font-size: 1rem;
            color: #333;student-course__no-available-modules {
            transition: border-color 0.3s;
          }
          .student-course__module-select:focus {
            outline: none;selected-modules-title {
            border-color: #3498db;
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);;
          }
          .student-course__modal-footer {m;
            padding: 1.5rem;
            border-top: 1px solid #eee;student-course__module-select-container {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;student-course__module-label {
          }
          .student-course__modal-cancel {
            padding: 0.7rem 1.5rem;
            background-color: #f8f9fa;9rem;
            color: #2c3e50;
            border: 1px solid #ddd;le-select {
            border-radius: 4px;
            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s; border-radius: 4px;
          }
          .student-course__modal-cancel:hover {
            background-color: #e9ecef; color: #333;
          }
          .student-course__modal-save {
            padding: 0.7rem 1.5rem;e-select:focus {
            background-color: #3498db; outline: none;
            color: white;
            border: none;152, 219, 0.2);
            border-radius: 4px;
            cursor: pointer;_modal-footer {
            font-size: 1rem;adding: 1.5rem;
            transition: background-color 0.2s;
          }
          .student-course__modal-save:hover:not(:disabled) {x-end;
            background-color: #2980b9;ap: 1rem;
          }
          .student-course__modal-save:disabled {el {
            opacity: 0.6;em;
            cursor: not-allowed;ackground-color: #f8f9fa;
          }
          .student-course__error {
            text-align: center;
            padding: 2rem;ursor: pointer;
            color: #e74c3c;
            background-color: #fdecea;ackground-color 0.2s;
            border-radius: 8px;
            margin: 2rem auto;student-course__modal-cancel:hover {
            max-width: 600px;  background-color: #e9ecef;
          }
          .retry-button {.student-course__modal-save {
            background-color: #3498db;        padding: 0.7rem 1.5rem;
            color: white;          background-color: #3498db;
            border: none;            color: white;
            border-radius: 4px;
            padding: 0.5rem 1rem;            border-radius: 4px;

















































export default StudentCourse;};  );    </div>      </style>        `}          }            }              width: 95%;            .student-course__modal {            }              font-size: 0.8rem;              padding: 0.4rem 0.8rem;            .student-course__edit-btn {            }              font-size: 0.9rem;              padding: 0.8rem 0.5rem;            .student-course__table-row td {            }              font-size: 0.9rem;              padding: 0.8rem 0.5rem;            .student-course__table-header th {            }              gap: 0.5rem;              flex-direction: column;            .student-course__filter-group {          @media (max-width: 768px) {          }            100% { transform: rotate(360deg); }            0% { transform: rotate(0deg); }          @keyframes spin {          }            margin: 0 auto 1rem;            animation: spin 1s linear infinite;            height: 40px;            width: 40px;            border-radius: 50%;            border-left-color: #3498db;            border: 4px solid rgba(0, 0, 0, 0.1);          .loading-spinner {          }            background-color: #2980b9;          .retry-button:hover {          }            transition: background-color 0.2s;            cursor: pointer;            margin-top: 1rem;            cursor: pointer;
            font-size: 1rem;
            transition: background-color 0.2s;
          }
          .student-course__modal-save:hover:not(:disabled) {
            background-color: #2980b9;
          }
          .student-course__modal-save:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
          @media (max-width: 768px) {
            .student-course__filter-group {
              flex-direction: column;
              gap: 0.5rem;
            }
            .student-course__table-header th {
              padding: 0.8rem 0.5rem;
              font-size: 0.9rem;
            }
            .student-course__table-row td {
              padding: 0.8rem 0.5rem;
              font-size: 0.9rem;
            }
            .student-course__edit-btn {
              padding: 0.4rem 0.8rem;
              font-size: 0.8rem;
            }
            .student-course__modal {
              width: 95%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default StudentCourse;
