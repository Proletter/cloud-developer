import * as AWS from 'aws-sdk';
const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {createLogger} from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
// import { TodoUpdate } from '../models/TodoUpdate';
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const logger = createLogger('Datalayer')

export class TodosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),    
        private readonly indextodos = process.env.TODOS_CREATED_AT_INDEX,    
        private readonly Tabletodos = process.env.TODOS_TABLE
        ){}

//// TODO: Implement the dataLayer logic


//create todo
 async  createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
        TableName: this.Tabletodos,
        Item: todo
    }).promise()

    return todo
}

//get all todos by userId
 async  getAllTodosByUserId(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient.query({
        TableName: this.Tabletodos,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()
    
    return result.Items  as TodoItem[]
}

//update todos
async  updateTodos(userId: string, todoId: string, todoUpdate: UpdateTodoRequest): Promise<UpdateTodoRequest> {
    await this.docClient.update({
        TableName: this.Tabletodos,
        Key: {
            userId: userId,
            todoId: todoId
        },
        UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        ExpressionAttributeValues: {
            ':name': todoUpdate.name,
            ':dueDate': todoUpdate.dueDate,
            ':done': todoUpdate.done
        },
        ReturnValues: 'UPDATED_NEW'

    }).promise()
    logger.info('todo item updated')
    return todoUpdate as UpdateTodoRequest
}

//datalogic to delete todos
async deleteTodo(todoId: string, userId: string): Promise<string> {
  const result =  await this.docClient.delete({
        TableName: this.Tabletodos,
        Key: {
            todoId: todoId,
            userId: userId
        }
    }).promise();

    logger.info("todo item deleted.", result)
    return todoId as string

}

//add
async addAttachment(todo: TodoItem): Promise<TodoItem> {
    const result = await this.docClient.update({
        TableName: this.Tabletodos,
        Key: {
            userId: todo.userId,
            todoId: todo.todoId
        },
        UpdateExpression: 'set attachmentUrl = :attachmentUrl',
        ExpressionAttributeValues: {
            ':attachmentUrl': todo.attachmentUrl
        }
    }).promise()
    return result.Attributes as TodoItem
}

//get all todos by todoID
async getAllTodoById(todoId: string):Promise<TodoItem>  {
   const output= await this.docClient.query({
        TableName: this.Tabletodos,
        IndexName: this.indextodos,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
            ':todoId': todoId
        }
    }).promise()
    const item = output.Items
    const result= (item.length !==0)?  item[0] as TodoItem :null
    return result;
}
}


