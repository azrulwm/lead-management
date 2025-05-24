import Link from "next/link";
import Head from "next/head";

const ThankYouPage = () => {
  return (
    <>
      <Head>
        <title>Thank You</title>
      </Head>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <div className="mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-indigo-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold">Thank You</h1>
        <p className="mb-8 max-w-md text-center text-gray-700">
          Your information was submitted to our team of immigration attorneys.
          Expect an email from{" "}
          <span className="font-medium">hello@tryalma.ai</span>.
        </p>

        <Link
          href="/"
          className="rounded-full bg-black px-6 py-3 text-white transition hover:opacity-90"
        >
          Go Back to Homepage
        </Link>
      </div>
    </>
  );
};

export default ThankYouPage;
