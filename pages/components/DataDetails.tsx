import { PaperClipIcon } from "@heroicons/react/20/solid";
import { Dataset } from "..";
import Link from "next/link";

interface DataDetailsProps {
  dataset: Dataset;
}

// to remove weird characters from the notes
const regex = /(<([^>]+)>)/gi;

function formatDateToUTC(datetimeString: string) {
  const date = new Date(datetimeString);
  const options: Intl.DateTimeFormatOptions = {
    timeZoneName: "short",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };

  const formattedDate = date.toLocaleString("en-US", options);
  const timezoneOffset = -date.getTimezoneOffset() / 60;
  const timezoneOffsetStr =
    timezoneOffset >= 0 ? `+${timezoneOffset}` : `${timezoneOffset}`;

  return `${formattedDate} (UTC${timezoneOffsetStr}:00)`;
}

export default function DataDetails({ dataset }: DataDetailsProps) {
  return (
    <div>
      <div className="px-4 sm:px-0">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          {dataset.title}
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Dataset details and information.
        </p>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Author
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {dataset.organization.title}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Created
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDateToUTC(dataset.metadata_created)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Last modified
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {formatDateToUTC(dataset.metadata_modified)}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Notes
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {dataset?.notes.replace(regex, "")}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Tags
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <div className="md:flex-row">
                {dataset.tags.map((tag) => (
                  <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 mr-2 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                    {tag.name}
                  </span>
                ))}
              </div>
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              State
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {dataset.state.toLocaleUpperCase()}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Dataset ID
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {dataset.id}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Source
            </dt>
            <Link href={`https://opendata.hawaii.gov/dataset/${dataset.name}`}>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 hover:underline">
                View on OpenData Hawaii
              </dd>
            </Link>
          </div>
        </dl>
      </div>
    </div>
  );
}
