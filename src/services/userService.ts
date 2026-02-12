export interface UserProfile {
    id: string;
    name: string;
    email: string;
    role: "org_admin" | "org_member" | "super_admin";
}

export const userService = {
    getUser: async (): Promise<UserProfile> => {
        // Mock API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return {
            id: "1",
            name: "Alexander Moreno",
            email: "alex@acme.com",
            role: "org_admin"
        };
    }
}
