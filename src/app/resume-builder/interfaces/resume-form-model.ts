export interface WorkExperience {
    jobTitle?: String;
    duration?: String;
    company?: String;
    city?: String;
    state?: String;
    country?: String;
    description?: String;
}

export interface WorkExperienceCollection {
    header?: String;
    workExps?: WorkExperience[];
}

export interface Education {
    degree?: String;
    institution?: String;
    duration?: String;
    city?: String;
    state?: String;
    country?: String;
}

export interface EducationCollection {
    header?: String;
    credentials?: Education[];
}

export interface ResumeFormData {
    workExpParentForm: WorkExperienceCollection;
    eduParentForm: EducationCollection;
}