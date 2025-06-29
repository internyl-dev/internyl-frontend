import { Inter, Caveat } from 'next/font/google';

import Image from 'next/image';

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter', 
  weight: ['400', '500', '600', '700'] 
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ['600', '700'],
  variable: "--font-hand",
});

export default function Home() {
  return (
    <div className="text-[#1d1d1f] px-6 md:px-20 pt-24 pb-32 relative overflow-hidden">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto relative z-10 mr-auto ml-auto">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          {/* Left Content */}
          <div className="text-center lg:text-left max-w-2xl">
            <p className="text-sm text-[#8d8dac] font-medium mb-2">
              Internyl — Internship Tracker for Students
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight">
              <span className={`text-[#ec6464] font-extrabold ${inter.className}`}>Streamline</span> your search,<br />
              Secure <span className={`italic font-extrabold ${caveat.className} text-7xl`}>your</span> <span className={`italic font-extrabold ${caveat.className} text-7xl`}>future</span>
            </h1>
            <p className="mt-4 text-lg text-[#1d1d1f]">
              Internyl helps students find and track internships and programs — all in one place.
            </p>
            <div className="mt-6 flex flex-wrap gap-2 items-center">
              <input
                type="text"
                placeholder="search for your dream internship"
                className="px-6 py-3 rounded-full text-base w-full max-w-md shadow-sm border border-gray-300"
              />
              <button className="bg-[#ec6464] text-white px-6 py-3 rounded-full font-semibold">
                begin search →
              </button>
            </div>
            <p className="text-sm italic mt-2 text-[#1d1d1f]">it&apos;s free</p>
          </div>

          {/* Right Image */}
          <div className="hidden lg:flex justify-end w-full">
            <Image
              src="/internyl-infinite-cards.svg"
              alt="Internship tiles visual"
              className="w-[440px] xl:w-[1000px] drop-shadow-2xl"
              width={440}
              height={500}
            />
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="mt-32 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">Skip the search, <br className="sm:hidden" />just choose and apply</h2>
        <p className="text-base text-[#1d1d1f] mb-10">
          Internyl simplifies the entire search, so you can focus on applying.
        </p>

        <div className="flex flex-col md:flex-row justify-center items-start gap-6 max-w-5xl mx-auto">
          <div className="bg-white border border-gray-300 rounded-xl p-6 text-left w-full md:w-1/2 shadow">
            <h3 className="font-semibold mb-3">Finding an internship without Internyl:</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li><s>Google random keywords</s></li>
              <li><s>Open 10+ tabs</s></li>
              <li><s>Search each website for eligibility</s></li>
              <li><s>Manually copy deadlines</s></li>
              <li><s>Track due dates on a random Google Doc</s></li>
              <li><s>Forget which ones you applied to</s></li>
              <li><s>Miss the results email</s></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-300 rounded-xl p-6 text-left w-full md:w-1/2 shadow">
            <h3 className="font-semibold mb-3">Finding an internship with Internyl:</h3>
            <ul className="text-sm text-[#1d1d1f] space-y-1 list-disc list-inside">
              <li>
                Use <span className="text-[#3C66C2] font-medium">smart filters</span> to explore curated internships & programs
              </li>
              <li>
                View all <span className="text-[#E66646] font-medium">key info</span> at a glance: deadlines, eligibility, cost
              </li>
              <li>
                <span className="text-[#2BA280] font-medium">Save listings</span>, set reminders, and <span className="text-[#E66646] font-medium">never miss a deadline</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mt-32 text-center max-w-3xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">No more stress,<br />we’ve got you</h2>
        <p className="text-base mb-3">
          Discover programs easily with our intuitive search features.
        </p>
        <p className="text-base mb-3">
          Save programs and receive reminders so that you never miss a deadline.
        </p>
        <p className="text-base mb-8">
          Gain access to exclusive information like acceptance rates and release dates not even the program website will tell you.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-300 rounded-xl p-4 shadow text-center">
            <p className="text-sm font-medium">
              Discover programs easily with our intuitive search features.
            </p>
          </div>
          <div className="bg-white border border-gray-300 rounded-xl p-4 shadow text-center">
            <p className="text-sm font-medium">
              Save programs and receive reminders so that you never miss a deadline.
            </p>
          </div>
          <div className="bg-white border border-gray-300 rounded-xl p-4 shadow text-center">
            <p className="text-sm font-medium">
              Gain access to exclusive information like acceptance rates and release dates.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}