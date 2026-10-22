export interface Application {
  _id: string;

  job: {
    _id: string;
    title: string;
    company: string;
    location: string;
  };

  status: string;

  createdAt: string;
}


export interface Applicant {
  _id: string;
  student: {
    _id: string;
    name: string;
    email: string;
    resume? : {
      url?: string;
      publicId?: string;
    };
  };
  status: string;
  createdAt: string;
}