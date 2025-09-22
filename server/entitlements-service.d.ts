export declare function getEntitlement(userId: number, key: string): Promise<{
    id: number;
    user_id: number;
    subscription_id: number;
    feature_key: string;
    feature_value: number;
    used_count: number;
    expires_at: number | null;
    created_at: number | null;
    updated_at: number | null;
}>;
export declare function asLimit(v?: string): number;
export declare function applyPlanToUser(userId: number, planCode: string): Promise<void>;
