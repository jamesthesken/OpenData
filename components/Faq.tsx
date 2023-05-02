import Link from "next/link";
const faqs = [
  {
    id: 1,
    question: "What is OpenData?",
    answer:
      "OpenData is a platform that provides access to open data published by various organizations, including government agencies, in a standardized and machine-readable format. OpenData allows users to easily search, download, and analyze data to gain insights and develop applications. OpenData Hawaii is the specific platform for accessing data published by the State of Hawaii.",
  },
  {
    id: 2,
    question: "How is this different from the OpenData Hawaii portal?",
    answer:
      "This website aims to make it quick and easy to build data visualizations from OpenData Hazwaii. It provides a drag-and-drop interface that simplifies the process of selecting, filtering, and visualizing data, allowing users to quickly gain insights and identify trends. The app is useful for researchers, policymakers, journalists, and anyone else who is interested in exploring and understanding data related to the State of Hawaii.",
  },
  {
    id: 3,
    question: "How do I use the app?",
    answer:
      "To get started, search and select a dataset. There are many to choose from, so enter some relevant keywords. Once you select a dataset you will be able to select the columns you wish to plot. For datasets that have geographical data, a map is displayed.",
  },
  {
    id: 4,
    question: "Where can I download the original data source?",
    answer: "Each dataset includes a link to the OpenData Hawaii portal",
  },
  {
    id: 5,
    question: "Do you make any guarantees regarding datasets on this site?",
    answer:
      "No. We do not use data from sources that are known to be unreliable. However, we encourage users to exercise caution when using data from any source and to verify the accuracy of the data before using it for any purpose.",
  },
  {
    id: 6,
    question: "What are some planned features?",
    answer: "Stay tuned for updates!",
  },
];

export default function Faq() {
  return (
    <div id="faq" className="bg-white">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Have a different question and can’t find the answer you’re looking
            for? Reach out to our support team by{" "}
            <Link
              href="https://www.kauaitechgroup.com"
              className="font-semibold text-indigo-600 hover:text-indigo-500"
            >
              sending us an email
            </Link>{" "}
            and we’ll get back to you as soon as we can.
          </p>
        </div>
        <div className="mt-20">
          <dl className="space-y-16 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:gap-y-16 sm:space-y-0 lg:grid-cols-3 lg:gap-x-10">
            {faqs.map((faq) => (
              <div key={faq.id}>
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  {faq.question}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  {faq.answer}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
