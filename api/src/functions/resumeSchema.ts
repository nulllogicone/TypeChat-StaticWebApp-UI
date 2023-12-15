// The following is a schema definition of a resume

export interface Resume {
    title: string; // a trigger headline that makes the candidate stand out
    summary: string;  // An appealing summary of the candidate with a professional touch
    experiences: Experience[];
    educations: Education[];
    skills: Skill[];
    poem: string; // a poem of the condidate with a personal touch
    nogoes: string[]; // a list of things the candidate does not want to do
    funfacts: string[]; // a list of fun facts about the candidate
    favorite_color: string; // the name of the favorite color of the candidate
    favorite_star_wars_character: string; // the favorite Star Wars character of the candidate 
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

