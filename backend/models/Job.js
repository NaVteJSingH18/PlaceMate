import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  // Basic Job Information
  title: { 
    type: String, 
    required: true, 
    index: true 
  },
  company: {
    name: { type: String, required: true },
    website: { type: String }
  },
  logo: {
    url: {
        type: String
    },
    public_id: {
        type: String
    }
},
  category: { 
    type: String, 
    required: true 
  }, // e.g., "Engineering - Software"
  employmentType: { 
    type: String, 
    enum: ['INTERN', 'FULL_TIME', 'PART_TIME', 'CONTRACT'], 
    required: true 
  },
  
  // Dates & Timeline
  datePosted: { 
    type: Date, 
    default: Date.now 
  },
  validThrough: { 
    type: Date, 
    required: true 
  }, // Application Deadline (Apply Before)
  jobStartDate: { 
    type: Date 
  }, // Join By date
  jobDuration: { 
    type: String 
  }, // e.g., "6 months"

  // Financials
  baseSalary: {
    currency: { type: String, default: 'INR' },
    amount: { type: Number },
    unitText: { type: String, default: 'MONTH' } // e.g., MONTH, YEAR
  },

  // Location & Logistics
  location: {
    type: String, 
    default: 'Pan India'
  },
  jobLocationType: { 
    type: String, 
    enum: ['TELECOMMUTE', 'ON_SITE', 'HYBRID'],
    default: 'ON_SITE'
  },

  // Description & Requirements
  description: { 
    type: String, 
    required: true 
  }, // HTML or plain text string
  skills: [{ 
    type: String 
  }], // Array of required skills

  // University-Specific Criteria (Targeted Campuses/Batches)
  eligibilityCriteria: {
    passingYear: { type: Number }, // e.g., 2027
    eligibleDegrees: [{ 
      degreeName: { type: String }, // e.g., "B.Tech"
      specializations: [{ type: String }] // e.g., ["CSE", "ECE", "Metal"]
    }],
    minMarks10th: { type: Number },
    minMarks12th: { type: Number },
    cgpaCutoff: { type: Number }
  },

  // System Status
  status: { 
    type: String, 
    enum: ['Active', 'Closed', 'Draft'], 
    default: 'Active' 
  }
}, { 
  timestamps: true 
});

const Job = mongoose.model('Job', jobSchema);
export default Job;