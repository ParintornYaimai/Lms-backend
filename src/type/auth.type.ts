export interface userTypeModel{
    firstname: string
    lastname: string
    email: string
    password: string
    role: string
    courses?: string[]
    profilepicture?: string
    refreshTokens?: { token: string; expiresAt: Date }[];
}

export interface loginTypeModel{
    email: string
    password: string
}

export interface logoutTypeModel{
    id: string
    refresh_token: string
}

export interface secretTypeModel{
    currentSecret: string ,
    oldSecrets: { secret: string; expiresAt: Date }[]; 
    // oldSecrets: [{
    //     secret: { type: String, required: true },
    //     expiresAt: { type: Date, required: true }
    // }],
}