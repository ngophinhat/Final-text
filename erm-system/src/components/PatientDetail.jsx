import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const PatientDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [patient, setPatient] = useState(null);
  const [error, setError] = useState('');

  // State cho inline editing cho text fields
  const [editing, setEditing] = useState({
    name: false,
    email: false,
    address: false,
    phone: false,
    timezone: false,
  });

  // State lưu giá trị đang chỉnh sửa (các field text)
  const [editedFields, setEditedFields] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    timezone: '',
  });

  // State lưu avatar (base64 data URL)
  const [avatar, setAvatar] = useState('');

  const fetchPatient = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/patients/${id}`);
      if (response.ok) {
        const data = await response.json();
        setPatient(data);
      } else {
        setError('Không tìm thấy bệnh nhân');
      }
    } catch (err) {
      setError('Lỗi kết nối');
    }
  };

  useEffect(() => {
    fetchPatient();
  }, [id]);

  // Khi patient được load, cập nhật các field và avatar từ API (hoặc từ localStorage nếu đã lưu)
  useEffect(() => {
    if (patient) {
      setEditedFields({
        name: patient.name || '',
        email: patient.email || '',
        address: patient.address || '',
        phone: patient.phone || '',
        timezone: patient.timezone || '',
      });
      // Nếu đã lưu avatar trong localStorage, ưu tiên hiển thị avatar đó
      const storedAvatar = localStorage.getItem(`patient-avatar-${id}`);
      if (storedAvatar) {
        setAvatar(storedAvatar);
      } else {
        setAvatar(patient.avatar);
      }
    }
  }, [patient, id]);

  if (error) {
    return (
      <div className="p-4 text-red-500 dark:text-red-400">
        {error}{' '}
        <Link to="/patients" className="text-blue-500 dark:text-blue-400 hover:underline">
          ← Quay lại danh sách
        </Link>
      </div>
    );
  }

  if (!patient) {
    return <div className="p-4 dark:text-gray-100">Đang tải...</div>;
  }

  const handleDelete = () => {
    alert('Đã xóa bệnh nhân.');
    // Gọi API xóa nếu cần
    navigate('/patients');
  };

  const handleClose = () => {
    navigate(-1);
  };

  // Toggle editing cho các field text
  const toggleEditing = (field) => {
    setEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // Xử lý upload ảnh mới
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File được chọn:", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("FileReader result:", reader.result);
        setAvatar(reader.result);
        localStorage.setItem(`patient-avatar-${id}`, reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("Không có file nào được chọn");
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Lớp mờ phủ nền: bấm ra ngoài để đóng panel */}
      <div
        className="absolute inset-0 bg-gray-500 dark:bg-black bg-opacity-50 dark:bg-opacity-50"
        onClick={handleClose}
      />

      {/* Panel chi tiết bên phải */}
      <div className="absolute top-0 bottom-0 right-0 w-full max-w-2xl bg-white dark:bg-gray-800 rounded-l-xl shadow-2xl p-6 overflow-y-auto">
        {/* Nút đóng */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 inline-flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="mb-6 flex items-center">
          <div className="relative">
            <img
              src={avatar || 'https://via.placeholder.com/80x80.png?text=Avatar'}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover mr-4"
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-0 right-0 p-1 bg-blue-500 hover:bg-blue-600 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3 w-3 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6m-2-8l-6 6H5v-4l6-6" />
              </svg>
            </button>

            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="flex items-center">
            {editing.name ? (
              <input
                className="border p-1 rounded text-black dark:text-gray-100 bg-gray-50 dark:bg-gray-700 text-xl font-semibold"
                value={editedFields.name}
                onChange={(e) => setEditedFields({ ...editedFields, name: e.target.value })}
              />
            ) : (
              <h2 className="text-xl font-semibold text-black dark:text-gray-100">{editedFields.name}</h2>
            )}
            <button onClick={() => toggleEditing('name')} className="ml-2">
              {editing.name ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6m-2-8l-6 6H5v-4l6-6" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="space-y-4">

          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 12H8m8 0a4 4 0 11-8 0 4 4 0 018 0zm0 0c0 1.333-.667 2.667-2 4m2-4c0 1.333.667 2.667 2 4"
                />
              </svg>
              <span className="font-medium text-black dark:text-gray-100">Email</span>
            </div>
            <div className="flex items-center">
              {editing.email ? (
                <input
                  className="border p-1 rounded text-black dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
                  value={editedFields.email}
                  onChange={(e) => setEditedFields({ ...editedFields, email: e.target.value })}
                />
              ) : (
                <span className="text-black dark:text-gray-100">
                  {editedFields.email || 'example@domain.com'}
                </span>
              )}
              <button onClick={() => toggleEditing('email')} className="ml-2">
                {editing.email ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6m-2-8l-6 6H5v-4l6-6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10c0 1.105.895 2 2 2h3V5H5c-1.105 0-2 .895-2 2zm7-2v14h10c1.105 0 2-.895 2-2V5c0-1.105-.895-2-2-2H10z"
                />
              </svg>
              <span className="font-medium text-black dark:text-gray-100">Address</span>
            </div>
            <div className="flex items-center">
              {editing.address ? (
                <input
                  className="border p-1 rounded text-black dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
                  value={editedFields.address}
                  onChange={(e) => setEditedFields({ ...editedFields, address: e.target.value })}
                />
              ) : (
                <span className="text-black dark:text-gray-100">
                  {editedFields.address || 'WiseTech Inc'}
                </span>
              )}
              <button onClick={() => toggleEditing('address')} className="ml-2">
                {editing.address ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6m-2-8l-6 6H5v-4l6-6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5h2a2 2 0 012 2v0c0 .372-.102.728-.293 1.037L5.586 10a16.001 16.001 0 006.414 6.414l1.963-1.121A1.999 1.999 0 0115 15h0a2 2 0 012 2v2a2 2 0 01-2 2c-9.389 0-17-7.611-17-17a2 2 0 012-2z"
                />
              </svg>
              <span className="font-medium text-black dark:text-gray-100">Phone</span>
            </div>
            <div className="flex items-center">
              {editing.phone ? (
                <input
                  className="border p-1 rounded text-black dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
                  value={editedFields.phone}
                  onChange={(e) => setEditedFields({ ...editedFields, phone: e.target.value })}
                />
              ) : (
                <span className="text-black dark:text-gray-100">
                  {editedFields.phone || '+1 (604) 989-1254'}
                </span>
              )}
              <button onClick={() => toggleEditing('phone')} className="ml-2">
                {editing.phone ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536M9 11l6 6m-2-8l-6 6H5v-4l6-6" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-3 rounded">
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3c0 4.418-3.582 8-8 8S4 16.418 4 12 7.582 4 12 4s8 3.582 8 8z"
                />
              </svg>
              <span className="font-medium text-black dark:text-gray-100">Time zone</span>
            </div>
            <div className="flex items-center">
              {editing.timezone ? (
                <input
                  className="border p-1 rounded text-black dark:text-gray-100 bg-gray-50 dark:bg-gray-700"
                  value={editedFields.timezone}
                  onChange={(e) => setEditedFields({ ...editedFields, timezone: e.target.value })}
                />
              ) : (
                <span className="text-black dark:text-gray-100">
                  {editedFields.timezone || 'UTC-06:00'}
                </span>
              )}
              <button onClick={() => toggleEditing('timezone')} className="ml-2">
                {editing.timezone ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-blue-500"
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
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-black dark:text-gray-100 text-sm mb-2">Lifecycle stage:</h3>
          <div className="flex space-x-2">
            <span
              className={`px-3 py-1 rounded-full text-sm border ${
                patient.status === 'Customer'
                  ? 'bg-red-50 dark:bg-red-900 border-red-300 dark:border-red-700 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-black dark:text-gray-100'
              }`}
            >
              {patient.status || 'Customer'}
            </span>
          </div>
        </div>

        <div className="mt-4 text-sm text-black dark:text-gray-100">
          {patient.createdAt
            ? `Created on: ${new Date(patient.createdAt).toLocaleDateString()}`
            : 'Created on: November 4, 2024'}
        </div>

        <div className="mt-6">
          <button
            onClick={handleDelete}
            className="bg-red-500 dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700 text-white px-4 py-2 rounded transition"
          >
            Delete Contact
          </button>
        </div>

        <div className="mt-4">
          <Link to="/patients" className="text-blue-500 dark:text-blue-400 hover:underline">
            ← Quay lại danh sách
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PatientDetail;
