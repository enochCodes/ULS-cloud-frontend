import apps from "@/mocks/apps.json"

export interface AppConfig {
    slug: string;
    name: string;
    icon: string;
    color: string;
    description: string;
}

export const appService = {
    getApps: async (): Promise<AppConfig[]> => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 100));
        return apps as AppConfig[];
    }
}
