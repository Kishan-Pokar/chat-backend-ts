export interface JwtPayloadWithUserId {
    userId: string;
}

export function isJwtPayloadWithUserId(payload: unknown): payload is JwtPayloadWithUserId {
    return (
        typeof payload === "object" &&
        payload !== null &&
        "userId" in payload &&
        typeof (payload as any).userId === "string"
    );
}