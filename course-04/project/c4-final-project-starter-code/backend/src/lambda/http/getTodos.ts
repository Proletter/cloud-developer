import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { getAllTodosByUserId } from '../../businessLogic/todos'
import { getUserId } from '../utils'

// TODO: Get all TODO items for a current user
export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
      const todos = await getAllTodosByUserId(getUserId(event))
      return {
        statusCode: 200,
        body: JSON.stringify({
          items: todos
        })
      }
    } catch (error) {
      return {
        statusCode: error?.statusCode || 400,

        body: JSON.stringify({
          message: error?.message || 'error while trying to get todo'
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
