import { Link } from "react-router-dom";
import { Status, Type } from "tweeter-shared";
import { useUserNavigation } from "../userNavigation/UserNavigationHooks";

interface Props {
  status: Status;
  featurePath: string;
}

const Post = (props: Props) => {
  const navigateToUser = useUserNavigation();

  return (
    <>
      {props.status.segments.map((segment, index) =>
        segment.type === Type.alias ? (
          <Link
            key={index}
            to={`${props.featurePath}/${segment.text}`}
            onClick={(e) => navigateToUser(e, props.featurePath)}
          >
            {segment.text}
          </Link>
        ) : segment.type === Type.url ? (
          <a
            key={index}
            href={segment.text}
            target="_blank"
            rel="noopener noreferrer"
          >
            {segment.text}
          </a>
        ) : segment.type === Type.newline ? (
          <br key={index} />
        ) : (
          segment.text
        )
      )}
    </>
  );
};

export default Post;
