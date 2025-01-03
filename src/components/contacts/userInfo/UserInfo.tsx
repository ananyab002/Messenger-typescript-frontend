import { useEffect, useState } from "react";
import "./userInfo.scss";

/**
 * UserInfo component fetches and displays user profile information.
 */
interface UserInfoType {
  id: number,
  name: string,
  img: string,
  status: string
}
const UserInfo = () => {
  const [userInfo, setUserInfo] = useState<UserInfoType | null>(null);

  const fetchUserInfo = async () => {
    const response = await fetch(
      "https://ananyab002.github.io/Messenger-typescript-frontend/data/user.json"
    );
    const userData = await response.json();
    setUserInfo(userData);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="userInfo">
      <p>My Profile</p>
      {userInfo && (
        <div className="user">
          <img src={userInfo.img} alt={userInfo.img} />
          <span>{userInfo.name}</span>
          <div className="status">
            <p>Status:</p>
            <p>{userInfo.status}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
