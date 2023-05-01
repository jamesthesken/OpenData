import { InformationCircleIcon } from "@heroicons/react/20/solid";

type InfoAlertProps = {
  info: string;
};

// Simple component to add informational statements on the page.
const InfoAlert: React.FC<InfoAlertProps> = ({ info }) => {
  return (
    <div className="rounded-md bg-blue-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon
            className="h-5 w-5 text-blue-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3 flex-1 md:flex md:justify-between">
          <p className="text-sm text-blue-700">{info}</p>
        </div>
      </div>
    </div>
  );
};

export default InfoAlert;
