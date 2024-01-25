import { Link } from "react-router-dom";

const TeacherDashboard = () => {
  return (
    <div className="grid grid-cols-3 gap-4 p-8 bg-gray-800 h-[calc(100vh-48px)] overflow-y-auto">
      <div className="col-span-1">
        <Link to="assessments">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 hover:to-cyan-600 p-8 text-white rounded-md cursor-pointer">
            <img src="https://via.placeholder.com/40" alt="Assessments" className="mb-4 rounded-md" />
            <h2 className="text-2xl font-bold">Assessments</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default TeacherDashboard;
