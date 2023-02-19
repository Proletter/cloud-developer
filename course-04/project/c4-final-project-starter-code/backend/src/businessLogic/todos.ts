import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAcess'
import { createLogger } from '../utils/logger'
import { AttachmentUtils } from '../fileStorage/attachmentUtils'

// TODO: Implement businessLogic

const todosAccess = new TodosAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('auth')

export function getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
  return todosAccess.getAllTodosByUserId(userId)
}


// Create Todo
export async function createTodo(
  todoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('create todo function invoked!')
  if (!todoRequest) return null
  const todoId = uuid.v4()
  const s3AttachmentUrl = attachmentUtils.getAttachmentUrl(todoId)
  const item = {
    todoId: todoId,
    userId: userId,
    createdAt: new Date().toISOString(),
    done: false,
    attachmentUrl: s3AttachmentUrl,
    ...todoRequest
  }
  return await todosAccess.createTodo(item)
}


//update todos
export async function updateTodos(
  userId: string,
  todoId: string,
  todoUpdate: UpdateTodoRequest
): Promise<UpdateTodoRequest> {
  return await todosAccess.updateTodos(userId, todoId, todoUpdate)
}

// delete todos
export async function deleteTodo(todoId: string, userId: string): Promise<string> {
  return await todosAccess.deleteTodo(todoId, userId)
}

//get all todos by id
export async function getAllTodoById(todoId: string) {
  return await todosAccess.getAllTodoById(todoId)
}


// create attachment presigned url function
export async function createAttachmentPresignedUrl(todoId: string, userId: string): Promise<string> {
  logger.info("create attachment url call by:", userId)
  return await attachmentUtils.getUploadUrl(todoId)
}