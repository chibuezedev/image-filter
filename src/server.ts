import express, { Application } from 'express';
import { Request, Response } from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';



(async () => {

  // Init the Express application
  const app: Application = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());


  app.get("/filteredimage",async(req: Request, res: Response)=>{
    console.log("in");
    let  image_url : string = req.query.image_url;

    //Validate url
  
    const isValideUrl   = image_url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);

    if( isValideUrl == null)

      return res.status(400).send(`Inavlid url! Try again with valid url`);
    else{
    //send the resulting file in response
      const filteredImage = filterImageFromURL(image_url);
      if( filteredImage === undefined || filteredImage === null )
      return res.status(400).send(`Unable to filter image`);
    else
      return res.status(200).sendFile( filteredImage + '');
    }
  })
  
  app.post("/delete-files", async (req: Request, res: Response) => {
    deleteLocalFiles(getTempFiles());
    res.status(200).send("All image files have been removed");
  });

  function getTempFiles(): string[] {
    throw new Error('Function not implemented.');
  }

  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req: Request, res: Response ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();


