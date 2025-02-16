export default [
  // -------------------------------------------
  // (0) Application -> model application
  // -------------------------------------------
  {
    name: {
      singular: "Application",
      plural: "Applications",
    },
    url: "/applications",
    form: [
      {
        type: "select",
        label: "Student",
        field: "userId",
        // references entity (6) => "User"
        resourceIndex: 6,
      },

      {
        type: "select",
        label: "Diploma",
        field: "diplomaId",
        // references entity (4) => "Diploma"
        resourceIndex: 4,
        groupBy: (row) => row.university.name,
      },
      {
        type: "select",
        label: "Program Type",
        field: "programType",
        // This is an enum in Prisma (programType),
        // so we'll keep a static options array
        options: [
          { value: "DD", label: "DD" },
          { value: "M2R", label: "M2R" },
          { value: "EXCHANGE", label: "EXCHANGE" },
          { value: "AUTRE", label: "AUTRE" },
        ],
      },
      {
        type: "select",
        label: "Status",
        field: "status",
        // This is an enum in Prisma (applicationStatus)
        options: [
          { value: "INSCRIT", label: "INSCRIT" },
          { value: "AUTORISE", label: "AUTORISE" },
          { value: "ATTENTE", label: "ATTENTE" },
          { value: "ADMIS", label: "ADMIS" },
          { value: "REJETE", label: "REJETE" },
        ],
      },
      {
        type: "checkbox",
        label: "Admitted",
        field: "admitted",
      },
      {
        type: "checkbox",
        label: "Nominated",
        field: "nominated",
      },
    ],
  },

  // -------------------------------------------
  // (1) Scholarship Application -> model applicationScholarship
  // -------------------------------------------
  {
    name: {
      singular: "Scholarship Application",
      plural: "Scholarship Applications",
    },
    url: "/scholarshipApplications",
    form: [
      {
        type: "select",
        label: "Application",
        field: "applicationId",
        // references entity (0) => "Application"
        resourceIndex: 0,
      },
      {
        type: "select",
        label: "Scholarship",
        field: "scholarshipId",
        // references entity (5) => "Scholarship"
        resourceIndex: 5,
      },
      {
        type: "select",
        label: "Status",
        field: "status",
        // applicationStatus enum
        options: [
          { value: "INSCRIT", label: "INSCRIT" },
          { value: "AUTORISE", label: "AUTORISE" },
          { value: "ATTENTE", label: "ATTENTE" },
          { value: "ADMIS", label: "ADMIS" },
          { value: "REJETE", label: "REJETE" },
        ],
      },
    ],
  },

  // -------------------------------------------
  // (2) Country -> model country
  // -------------------------------------------
  {
    name: {
      singular: "Country",
      plural: "Countries",
    },
    url: "/countries",
    form: [
      {
        type: "text",
        label: "Name",
        field: "name",
      },
    ],
  },

  // -------------------------------------------
  // (3) University -> model university
  // -------------------------------------------
  {
    name: {
      singular: "University",
      plural: "Universities",
    },
    url: "/universities",
    form: [
      {
        type: "text",
        label: "Name",
        field: "name",
      },
      {
        type: "text",
        label: "Location",
        field: "location",
      },
      {
        type: "number",
        label: "Ranking",
        field: "ranking",
      },
      {
        type: "select",
        label: "Country",
        field: "countryId",
        // references entity (2) => "Country"
        resourceIndex: 2,
      },
    ],
  },

  // -------------------------------------------
  // (4) Diploma -> model diploma
  // -------------------------------------------
  {
    name: {
      singular: "Diploma",
      plural: "Diplomas",
    },
    url: "/diplomas",
    form: [
      {
        type: "text",
        label: "Name",
        field: "name",
      },
      {
        type: "select",
        label: "Program Type",
        field: "programType",
        // programType enum
        options: [
          { value: "DD", label: "DD" },
          { value: "M2R", label: "M2R" },
          { value: "EXCHANGE", label: "EXCHANGE" },
          { value: "AUTRE", label: "AUTRE" },
        ],
      },
      {
        type: "text",
        label: "Fees",
        field: "fees",
      },
      {
        type: "textarea",
        label: "Possible Paths",
        field: "possiblePaths",
      },
      {
        type: "textarea",
        label: "Links",
        field: "links",
      },
      {
        type: "select",
        label: "Year",
        field: "year",
        // year enum
        options: [
          { value: "FIRST", label: "FIRST" },
          { value: "SECOND", label: "SECOND" },
          { value: "THIRD", label: "THIRD" },
          { value: "FOURTH", label: "FOURTH" },
          { value: "FIFTH", label: "FIFTH" },
        ],
      },
      {
        type: "select",
        label: "Department",
        field: "department",
        // department enum
        options: [
          { value: "ELECTRICAL", label: "ELECTRICAL" },
          { value: "MECHANICAL", label: "MECHANICAL" },
          { value: "PERTOCHEMICAL", label: "PERTOCHEMICAL" },
          { value: "CIVIL", label: "CIVIL" },
        ],
      },
      {
        type: "checkbox",
        label: "Interview",
        field: "interview",
      },
      {
        type: "checkbox",
        label: "Oral Exam",
        field: "oralExam",
      },
      {
        type: "checkbox",
        label: "Written Exam",
        field: "writtenExam",
      },
      {
        type: "date",
        label: "Appel Date",
        field: "appelDate",
      },
      {
        type: "date",
        label: "Results Date",
        field: "resultsDate",
      },
      {
        type: "date",
        label: "Application Deadline",
        field: "applicationDeadline",
      },
      {
        type: "textarea",
        label: "Procedure",
        field: "procedure",
      },
      {
        type: "select",
        label: "University",
        field: "universityId",
        // references entity (3) => "University"
        resourceIndex: 3,
      },
    ],
  },

  // -------------------------------------------
  // (5) Scholarship -> model scholarship
  // -------------------------------------------
  {
    name: {
      singular: "Scholarship",
      plural: "Scholarships",
    },
    url: "/scholarships",
    form: [
      {
        type: "text",
        label: "Name",
        field: "name",
      },
      {
        type: "text",
        label: "Duration",
        field: "duration",
      },
      {
        type: "textarea",
        label: "Conditions",
        field: "conditions",
      },
      {
        type: "textarea",
        label: "Perks",
        field: "perks",
      },
      {
        type: "number",
        label: "Minimum Average",
        field: "minimumAverage",
      },
      // Example multi-select to link multiple Diplomas to a Scholarship:
      {
        type: "multiselect",
        label: "Diplomas",
        field: "diplomas",
        // references entity (4) => "Diploma"
        // This expects an array of IDs in your code.
        resourceIndex: 4,
      },
    ],
  },

  // -------------------------------------------
  // (6) User -> model user
  // -------------------------------------------
  {
    name: {
      singular: "User",
      plural: "Users",
    },
    url: "/users",
    form: [
      {
        type: "text",
        label: "First Name",
        field: "firstName",
      },
      {
        type: "text",
        label: "Father Name",
        field: "fatherName",
      },
      {
        type: "text",
        label: "Last Name",
        field: "lastName",
      },
      {
        type: "text",
        label: "Email",
        field: "email",
      },
      {
        type: "password",
        label: "Password",
        field: "password",
      },
      {
        type: "select",
        label: "Role",
        field: "role",
        // role enum
        options: [
          { value: "ADMIN", label: "ADMIN" },
          { value: "NORMAL", label: "NORMAL" },
        ],
      },
      {
        type: "text",
        label: "File Number",
        field: "fileNumber",
      },

      {
        type: "text",
        label: "Phone",
        field: "phone",
      },

      {
        type: "text",
        label: "Branch",
        field: "branch",
      },
      {
        type: "select",
        label: "Year",
        field: "year",
        // year enum
        options: [
          { value: "FIRST", label: "FIRST" },
          { value: "SECOND", label: "SECOND" },
          { value: "THIRD", label: "THIRD" },
          { value: "FOURTH", label: "FOURTH" },
          { value: "FIFTH", label: "FIFTH" },
        ],
      },
      {
        type: "number",
        label: "Ranking",
        field: "ranking",
      },
      {
        type: "number",
        label: "Average",
        field: "average",
      },
      {
        type: "textarea",
        label: "Notes",
        field: "notes",
      },
      {
        type: "select",
        label: "Department",
        field: "department",
        // department enum
        options: [
          { value: "ELECTRICAL", label: "ELECTRICAL" },
          { value: "MECHANICAL", label: "MECHANICAL" },
          { value: "PERTOCHEMICAL", label: "PERTOCHEMICAL" },
          { value: "CIVIL", label: "CIVIL" },
        ],
      },
    ],
  },
];
