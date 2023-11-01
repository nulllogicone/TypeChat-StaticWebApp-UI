// The following is a schema definition of a resume

export interface Resume {
    title: string; // a headline of the resume
    summary: string;  // An appealing summary of the candidate
    experiences: Experience[];
    educations: Education[];
    skills: Skill[];
}

// work experience at a company with a given role and a short description of responsibilities you worked on, 
// projects you contributed or problems you solved
export interface Experience{
    startDate: string;
    endDate: string;
    companyName: string;
    role: string;
    description: string;
}

// education of the candidate form university or certification
export interface Education{
    instituationName: string;
    fieldOfStudy: string;
    examTitle: string;
    year: string;
}

// Skills of the person with a level of professionalism
export interface Skill{
    name: string;
    level: number;
}

