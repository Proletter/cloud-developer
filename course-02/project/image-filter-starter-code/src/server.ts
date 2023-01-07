import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import { any } from 'bluebird';
const fs = require('fs');
const path = require('path');

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  app.get( "/filteredimage", async ( req: any, res:any ) => {
    const {image_url} = req.query
    if (!image_url){
       return  res.send("no image url specified")
    }
    const filteredImage = await filterImageFromURL(image_url)
    res.sendFile(filteredImage)

    //set default path for deletion to tmp file path
    const filePath = path.join(__dirname, '/util/tmp');
    // get a list of all files in file path
    fs.readdir(filePath, function (err:any, files:string[]) {
      if (err) {
        res.send('An error occured while deleting server files', err);
      } else {
        // temp list of all paths to files in tmp directory
        let filesPathsTmp:string[] = []
        files.forEach((file: string) => {
          filesPathsTmp.push(path.resolve(filePath, file));       
        });
        // delete all fils in file path
        deleteLocalFiles(filesPathsTmp)
      }
    });

    // 
  } );

  /**************************************************************************** */

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();