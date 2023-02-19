import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { deleteTodo } from '../../businessLogic/todos'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'

const logger = createLogger('deleteTodo')
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todoId = event.pathParameters.todoId
      logger.info('Deleting todo..', event)

      const userId = getUserId(event)
      await deleteTodo(todoId, userId)

      return {
        statusCode: 200,
        body: ''
      }
    } catch (error) {
      return {
        statusCode: error?.statusCode || 400,

        body: JSON.stringify({
          message: error?.message || 'error while trying to delete todo'
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