declare namespace Express {
    interface Request {
        user: {
            id: Type.ObjectId;
            firstname: string
            lastname: string
            email: string;
            role: string;
            [key: string]: any;
        };
    }
}