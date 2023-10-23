import NavigationBar from "../components/NavigationBar";

const Profile = () => {
  return (
    <div>
      <NavigationBar />
      <div className="flex flex-col items-center justify-center space-y-4">
        <h1 className="text-3xl font-semibold">Profile</h1>
      </div>
    </div>
  );
};

export default Profile;
