import {Link, useNavigate} from "react-router-dom";
import Post from "./Post";
import { AuthToken, FakeData, Status, User } from "tweeter-shared";
import {ToastType} from "../toaster/Toast";
import {useContext} from "react";
import {UserInfoActionsContext, UserInfoContext} from "../userInfo/UserInfoContexts";
import {ToastActionsContext} from "../toaster/ToastContexts";

interface Props {
    status: Status;
    featurePath: string;
}

const StatusItem = ({ status, featurePath }: Props) => {
    const navigate = useNavigate();
    const { displayedUser, authToken } = useContext(UserInfoContext);
    const { setDisplayedUser } = useContext(UserInfoActionsContext);
    const { displayToast } = useContext(ToastActionsContext);

    const navigateToUser = async (event: React.MouseEvent): Promise<void> => {
        event.preventDefault();

        try {
            const alias = extractAlias(event.target.toString());

            const toUser = await getUser(authToken!, alias);

            if (toUser) {
                if (!toUser.equals(displayedUser!)) {
                    setDisplayedUser(toUser);
                    navigate(`${featurePath}/${toUser.alias}`);
                }
            }
        } catch (error) {
            displayToast(
                ToastType.Error,
                `Failed to get user because of exception: ${error}`,
                0
            );
        }
    };

    const extractAlias = (value: string): string => {
        const index = value.indexOf("@");
        return value.substring(index);
    };

    const getUser = async (
        authToken: AuthToken,
        alias: string
    ): Promise<User | null> => {
        // TODO: Replace with the result of calling server
        return FakeData.instance.findUserByAlias(alias);
    };

    return (
        <div className="col bg-light mx-0 px-0">
            <div className="container px-0">
                <div className="row mx-0 px-0">
                    <div className="col-auto p-3">
                        <img
                            src={status.user.imageUrl}
                            className="img-fluid"
                            width="80"
                            alt="Posting user"
                        />
                    </div>
                    <div className="col">
                        <h2>
                            <b>
                                {status.user.firstName} {status.user.lastName}
                            </b>{" "}
                            -{" "}
                            <Link
                                to={`/story/${status.user.alias}`}
                                onClick={navigateToUser}
                            >
                                {status.user.alias}
                            </Link>
                        </h2>
                        {status.formattedDate}
                        <br />
                        <Post status={status} featurePath="/story" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatusItem;