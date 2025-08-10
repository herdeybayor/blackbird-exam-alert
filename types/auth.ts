export type StudentRegisterData = {
    firstName: string;
    lastName: string;
    matricNumber: string;
    phone: string;
    email: string;
    faculty: string;
    department: string;
    level: string;
    password: string;
};

export type StudentLoginData = {
    matricNumber: string;
    password: string;
};
