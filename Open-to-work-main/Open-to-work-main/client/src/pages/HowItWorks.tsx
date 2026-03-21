import { UserPlus, Search, FileText, CheckCircle } from "lucide-react";

const steps = [
  {
    id: 1,
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Sign up in minutes and showcase your skills & experience to employers.",
  },
  {
    id: 2,
    icon: Search,
    title: "Find Jobs",
    description:
      "Search roles that match your skills, location, and career goals.",
  },
  {
    id: 3,
    icon: FileText,
    title: "Apply Easily",
    description:
      "Submit applications quickly using your saved professional profile.",
  },
  {
    id: 4,
    icon: CheckCircle,
    title: "Get Hired",
    description:
      "Get discovered by recruiters, track progress, and land the right job.",
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full bg-white py-20 px-6">
      {/* Header */}
      <div className="text-center mb-16">
        <h2 className="text-5xl font-extrabold text-gray-900 mb-3">
          How It Works
        </h2>
        <p className="text-gray-400 text-lg">
          Your path to amazing opportunities starts here
        </p>
      </div>

      {/* Steps */}
      <div className="relative max-w-5xl mx-auto flex items-start justify-between">
        {/* Connector Line */}
        <div className="absolute top-14 left-[12%] right-[12%] h-0.5 bg-blue-200 z-0" />

        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center text-center w-1/4 px-4"
            >
              {/* Circle with Icon */}
              <div className="relative mb-5">
                {/* Badge */}
                <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-blue-400 text-white text-xs font-bold flex items-center justify-center z-10 shadow">
                  {step.id}
                </span>
                <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                  <Icon className="text-white w-12 h-12" strokeWidth={1.5} />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}