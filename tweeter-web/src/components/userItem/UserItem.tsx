import { Link } from "react-router-dom";
import { User  } from "tweeter-shared";
import {useUserNavigation} from "../userNavigation/UserNavigationHooks";

interface Props {
  user: User;
  featurePath: string;
}

const UserItem = ({ user, featurePath }: Props) => {
  const navigateToUser = useUserNavigation();

  return (
    <div className="col bg-light mx-0 px-0">
      <div className="container px-0">
        <div className="row mx-0 px-0">
          <div className="col-auto p-3">
            <img
              src={user.imageUrl}
              className="img-fluid"
              width="80"
              alt="Posting user"
            />
          </div>
          <div className="col">
            <h2>
              <b>
                {user.firstName} {user.lastName}
              </b>{" "}
              -{" "}
              <Link
                to={`${featurePath}/${user.alias}`}
                onClick={(event) => navigateToUser(event, featurePath)}
              >
                {user.alias}
              </Link>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserItem;
