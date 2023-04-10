import * as openai from "openai"

export const client = new openai.OpenAIApi(
  new openai.Configuration({
    organization: process.env.ORGANIZATION,
    apiKey: process.env.API_KEY,
  })
)
