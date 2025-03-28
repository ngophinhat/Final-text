import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const PatientsGrid = ({ currentPatients, handleDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {currentPatients.map((patient) => {
        const avatarUrl =
          localStorage.getItem(`patient-avatar-${patient.id}`) ||
          patient.img ||
          'https://via.placeholder.com/150?text=No+Image';
        return (
          <div
            key={patient.id}
            className="bg-white dark:bg-gray-800 rounded shadow p-4 flex flex-col items-center"
          >
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover mb-2"
            />
            <Link
              to={`/patients/${patient.id}`}
              className="text-blue-500 dark:text-blue-400 hover:underline font-semibold"
            >
              {patient.name}
            </Link>
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              {patient.email || 'No email'}
            </div>
            <div className="text-gray-600 dark:text-gray-300 text-sm">
              {patient.address || 'No address'}
            </div>
            <div className="text-xs mt-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
              {patient.status || 'Enrolled'}
            </div>
            <div className="mt-2 flex space-x-2">
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
                    d="M15.232 5.232l3.536 3.536m-2.036-1.5a2.5 2.5 0 113.536 3.536L9 21H3v-6l13.232-13.232z"
                  />
                </svg>
              </button>
              <button
                onClick={() => handleDelete(patient.id)}
                className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
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
          </div>
        );
      })}
    </div>
  );
};

export default PatientsGrid;
