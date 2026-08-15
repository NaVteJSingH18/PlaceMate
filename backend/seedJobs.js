import mongoose from "mongoose";
import dotenv from "dotenv";
import Job from "./models/Job.js";

dotenv.config();

const jobsData = [
  {
    title: "Software Engineer",
    company: {
      name: "Google",
      website: "https://google.com"
    },
    logo: {
      url: "https://logo.clearbit.com/google.com",
      public_id: "google_logo_test"
    },
    category: "Engineering",
    employmentType: "FULL_TIME",
    validThrough: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    baseSalary: {
      currency: "INR",
      amount: 2500000,
      unitText: "YEAR"
    },
    location: "Bangalore, India",
    description: "Join the Google Search team to build scalable systems.",
    skills: ["C++", "Python", "System Design"],
    status: "Active"
  },
  {
    title: "Frontend Developer",
    company: {
      name: "Vercel",
      website: "https://vercel.com"
    },
    logo: {
      url: "https://logo.clearbit.com/vercel.com",
      public_id: "vercel_logo_test"
    },
    category: "Engineering",
    employmentType: "FULL_TIME",
    validThrough: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 
    baseSalary: {
      currency: "INR",
      amount: 1800000,
      unitText: "YEAR"
    },
    location: "Remote",
    description: "Help us build the next generation of frontend tooling with Next.js.",
    skills: ["React", "TypeScript", "Next.js"],
    status: "Active"
  },
  {
    title: "Data Science Intern",
    company: {
      name: "Microsoft",
      website: "https://microsoft.com"
    },
    logo: {
      url: "https://logo.clearbit.com/microsoft.com",
      public_id: "microsoft_logo_test"
    },
    category: "Data Science",
    employmentType: "INTERN",
    validThrough: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 
    baseSalary: {
      currency: "INR",
      amount: 60000,
      unitText: "MONTH"
    },
    location: "Hyderabad, India",
    description: "Work with Azure Machine Learning teams on cutting edge AI models.",
    skills: ["Python", "PyTorch", "SQL"],
    status: "Active"
  },
  {
    title: "Product Designer",
    company: {
      name: "Figma",
      website: "https://figma.com"
    },
    logo: {
      url: "https://logo.clearbit.com/figma.com",
      public_id: "figma_logo_test"
    },
    category: "Design",
    employmentType: "FULL_TIME",
    validThrough: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), 
    baseSalary: {
      currency: "INR",
      amount: 2200000,
      unitText: "YEAR"
    },
    location: "Remote",
    description: "Design the future of collaborative tools for teams everywhere.",
    skills: ["UI/UX", "Figma", "Interaction Design"],
    status: "Active"
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB!");

    // We don't delete applications, so deleting jobs might leave orphaned applications,
    // but that's fine for testing. 
    // console.log("Clearing existing jobs...");
    // await Job.deleteMany({});
    
    console.log("Inserting new jobs...");
    await Job.insertMany(jobsData);
    
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
