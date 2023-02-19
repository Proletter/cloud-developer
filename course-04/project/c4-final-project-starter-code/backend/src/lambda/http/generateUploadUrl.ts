import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../businessLogic/todos'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId = event.pathParameters.todoId
      // TODO: Return a presigned URL to upload a file for a TODO item with the provided id
     const userId = getUserId(event)
     const url = await createAttachmentPresignedUrl(todoId, userId)
     return {
        statusCode: 201,
        body: JSON.stringify({
            UploadUrl: url
        })
     }

    } catch (error) {
      return {
        statusCode: error?.statusCode || 400,

        body: JSON.stringify({
          message: error?.message || 'error while trying to get url'
        })
      }
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)