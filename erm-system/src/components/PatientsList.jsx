import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import PatientsGrid from './PatientsGrid';

const PatientsList = () => {
  const [patients, setPatients] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddForm, setShowAddForm] = useState(false);
  const [addFormError, setAddFormError] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const patientsPerPage = 10;

  // Fetch danh sách bệnh nhân từ server
  const fetchPatients = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/patients?q=${search}`);
      const data = await response.json();
      localStorage.setItem('patients', JSON.stringify(data));
      setPatients(data);
    } catch (err) {
      console.error('Error fetching patients', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [search]);

  // Mỗi lần darkMode thay đổi, lưu vào localStorage để duy trì trạng thái khi chuyển trang
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Phân trang
  const indexOfLast = currentPage * patientsPerPage;
  const indexOfFirst = indexOfLast - patientsPerPage;
  const currentPatients = patients.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(patients.length / patientsPerPage);

  // Hàm xoá bệnh nhân
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/patients/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setPatients((prev) => {
          const updated = prev.filter((p) => p.id !== id);
          localStorage.setItem('patients', JSON.stringify(updated));
          return updated;
        });
        localStorage.removeItem(`patient-avatar-${id}`);
      } else {
        alert(`Xoá không thành công. Mã lỗi: ${response.status}`);
      }
    } catch (err) {
      console.error('Error deleting patient', err);
      alert('Lỗi kết nối khi xoá bệnh nhân.');
    }
  };

  const [newPatient, setNewPatient] = useState({
    name: '',
    address: '',
    email: '',
    status: '',
    timezone: '',
    img: '',
  });
  const newAvatarRef = useRef(null);

  const handleNewAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPatient((prev) => ({ ...prev, img: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewContact = async () => {
    if (
      !newPatient.name ||
      !newPatient.email ||
      !newPatient.address ||
      !newPatient.status ||
      !newPatient.timezone
    ) {
      setAddFormError('Vui lòng điền đầy đủ thông tin cho các trường bắt buộc.');
      return;
    }
    setAddFormError('');
    try {
      const response = await fetch('http://localhost:5001/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPatient),
      });
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      const createdPatient = await response.json();
      const updated = [createdPatient, ...patients];
      setPatients(updated);
      localStorage.setItem('patients', JSON.stringify(updated));
      setShowAddForm(false);
      setNewPatient({
        name: '',
        address: '',
        email: '',
        status: '',
        timezone: '',
        img: '',
      });
    } catch (error) {
      console.error('Error creating new patient', error);
      alert('Không thể tạo bệnh nhân mới. Kiểm tra console để biết chi tiết.');
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-100 text-gray-700'
      }`}
    >
      {/* Sidebar (thu gọn khi không hover) */}
      <aside
        className={`group relative border-r 
          ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'}
          w-16 hover:w-64 transition-all duration-300 flex flex-col justify-between px-2 py-4`}
      >
        <div className="mb-8">
          <Link
            to="/"
            className="flex items-center justify-center group-hover:justify-start transition-all"
          >

            <span className="text-blue-600 text-xl font-bold group-hover:hidden">
              V
            </span>

            <span className="hidden group-hover:inline-block ml-2 text-blue-600 text-xl font-bold">
              VTC Academy
            </span>
          </Link>
        </div>
        <nav className="flex-1 space-y-2">
          <Link
            to="/dashboard"
            className={`
              flex items-center px-2 py-2 text-sm rounded transition-all 
              ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 6h18M3 18h18" />
            </svg>
            <span className="hidden group-hover:inline-block ml-2">Dashboard</span>
          </Link>

          <Link
            to="/patients"
            className={`
              flex items-center px-2 py-2 text-sm rounded font-medium transition-all
              ${darkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-50 text-blue-600'}
            `}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3h14M5 7h14M5 11h14M5 15h14M5 19h14" />
            </svg>
            <span className="hidden group-hover:inline-block ml-2">List Patients</span>
          </Link>
        </nav>
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className={`block w-full text-left px-2 py-2 text-sm rounded transition-all ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="inline-block h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7" />
            </svg>
            <span className="hidden group-hover:inline-block ml-2">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header
          className={`flex items-center justify-between border-b px-6 py-4 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}
        >
          <h1 className="text-xl font-semibold">Patients</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition"
            >
              <span className="font-medium">Add new contact</span>
            </button>

            <button
              onClick={toggleDarkMode}
              className="w-10 h-10 rounded-full bg-black hover:bg-gray-800 transition"
              title="Toggle Dark Mode"
            ></button>

            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">U</span>
            </div>
          </div>
        </header>

        <div
          className={`p-6 border-b flex justify-end items-center space-x-2 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white'
          }`}
        >
          <input
            type="text"
            placeholder="Search patients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full max-w-sm border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : 'bg-white'
            }`}
          />
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-sm rounded transition ${
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : darkMode
                ? 'bg-gray-600 text-gray-300'
                : 'bg-gray-200 text-gray-600'
            }`}
            title="List View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 text-sm rounded transition ${
              viewMode === 'grid'
                ? 'bg-blue-500 text-white'
                : darkMode
                ? 'bg-gray-600 text-gray-300'
                : 'bg-gray-200 text-gray-600'
            }`}
            title="Grid View"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h6M4 12h6m-6 6h6M14 6h6M14 12h6m-6 6h6" />
            </svg>
          </button>
        </div>

        {showAddForm && (
          <div className="fixed inset-0 z-60 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-lg">
              <h2 className="text-xl font-semibold mb-4">Add New Contact</h2>
              {addFormError && (
                <div className="mb-4 text-red-500">{addFormError}</div>
              )}

              <div className="mb-4">
                <label className="block font-medium mb-1">Avatar</label>
                <div className="flex items-center">
                  {newPatient.img ? (
                    <img
                      src={newPatient.img}
                      alt="avatar"
                      className="w-16 h-16 rounded-full object-cover mr-4"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-4">
                      <span className="text-red-500">No Image</span>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    ref={newAvatarRef}
                    onChange={handleNewAvatarChange}
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={newPatient.email}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, email: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">Address</label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, address: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">Status</label>
                <input
                  type="text"
                  value={newPatient.status}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, status: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div className="mb-4">
                <label className="block font-medium mb-1">Time zone</label>
                <input
                  type="text"
                  value={newPatient.timezone}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, timezone: e.target.value })
                  }
                  className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-gray-700 dark:text-gray-100"
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-4 py-2 rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNewContact}
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="p-6 flex-1 overflow-auto">
          <div className={`rounded shadow ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            {viewMode === 'list' ? (
              <table className="w-full table-auto">
                <thead>
                  <tr className={`text-sm leading-normal ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-50 text-gray-600'}`}>
                    <th className="px-4 py-3 text-left">Avatar</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Address</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {currentPatients.map((patient) => {
                    const avatarUrl =
                      localStorage.getItem(`patient-avatar-${patient.id}`) ||
                      patient.img ||
                      'https://via.placeholder.com/150?text=No+Image';
                    return (
                      <tr
                        key={patient.id}
                        className={`border-b hover:bg-${
                          darkMode ? 'gray-700' : 'gray-50'
                        } ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                      >
                        <td className="px-4 py-3">
                          <img
                            src={avatarUrl}
                            alt="avatar"
                            className="w-10 h-10 rounded-full object-cover"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <Link to={`/patients/${patient.id}`} className="text-blue-500 dark:text-blue-400 hover:underline">
                            {patient.name}
                          </Link>
                        </td>
                        <td className="px-4 py-3">{patient.email || 'No email'}</td>
                        <td className="px-4 py-3">{patient.address || 'No address'}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                              patient.status === 'Enrolled'
                                ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
                            }`}
                          >
                            {patient.status || 'Enrolled'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => navigate(`/patients/${patient.id}`)}
                              className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                              title="Edit"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15.232 5.232l3.536 3.536M9 11l6 6m-2-8l-6 6H5v-4l6-6"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(patient.id)}
                              className="text-red-500 hover:text-red-700"
                              title="Delete"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M10 4h4a1 1 0 011 1v1H9V5a1 1 0 011-1z"
                                />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <PatientsGrid currentPatients={currentPatients} handleDelete={handleDelete} />
            )}

            <div className={`flex items-center justify-between px-4 py-3 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50'}`}>
              <span className="text-sm">
                {patients.length} contacts in total
              </span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-white"
                >
                  Previous
                </button>
                <span className="text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1 text-sm bg-white dark:bg-gray-700 border rounded hover:bg-gray-100 dark:hover:bg-gray-600 text-white"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientsList;
