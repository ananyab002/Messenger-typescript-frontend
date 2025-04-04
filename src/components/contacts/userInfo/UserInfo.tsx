import "./userInfo.scss";
import { useLogin } from "../../../hooks/useLogin";

/**
 * UserInfo component fetches and displays user profile information.
 */

const UserInfo = () => {
  const { currentUser } = useLogin();

  return (
    <div className="userInfo">
      <p>My Profile</p>
      {currentUser && (
        <div className="user">
          <img src={currentUser.image} alt={currentUser.image} />
          <span>{currentUser.name}</span>
          <div className="status">
            <p>Status:</p>
            {/* <p>{currentUser.status}</p> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserInfo;
