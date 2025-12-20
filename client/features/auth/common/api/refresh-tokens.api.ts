import { env } from "@/env";

import { typedFetch } from "@/lib/fetch";

import { RefreshTokenParams } from "../schemas/refresh-token/refresh-token-params.schema";
import { refreshTokensResponseSchema } from "../schemas/refresh-token/refresh-tokens-response.schema";

export const refreshTokensApi = async(data: RefreshTokenParams)=> {
    return await typedFetch({
        url: `${env.API_URL}/auth/refresh` ,
        method: 'POST',
        body: data,
        schema: refreshTokensResponseSchema
    })
}