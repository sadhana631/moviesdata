const express = require('express')
const { open } = require('sqlite')
const sqlite3 = require('sqlite3')
const path = require('path')

const databasePath = path.join(__dirname, 'moviesData.db')

const app = express()

app.use(express.json())

let database = null

const initializedDbAndServer = async () => {
    try {
        database = await open({
            filename: databasePath,
            driver: sqlite3.Database,
        })
        app.listen(3000, () =>
            console.log('Server Running at http://localhost:3000/'),
        )
    } catch (error) {
        console.log('DB Error: ${error.message}'),
        process.exit()
    }
}

initializedDbAndServer();

const convertMovieDbObjectToRespnseObject = (dbObject) => {
    return {
        movieId: dbObject.movie_id,
        director: dbObject.director_id,
        movieName: dbObject.lead_actor,              
    }
}

const convertDirectorDbObjectToResponseObject = (dbObject) => {
    return {
        directorId: dbObject.director_id,
        directorName: dbObject.director_name,
    }
}

app.get('/movies/', async (request, response) => {
    const getMoviesQuery = `
    SELECT
    movie_name
   FROM
    movie;`
const moviesArray = await database.all(getMoviesQuery)
response.send(
    moviesArray.map(eachMovie => ({movieName: eachMovie.movie_name})),
 )
})

app.get('/movies/:movieId', async (request, response) => {
    const { movieId } = request.params
    const getMovieQuery = `
      SELECT
        *
      FROM
        movie
      WHERE
        movie_id = ${movie_id};`
const movie = await database.get(getMovieQuery)
  response.send(convertMovieDbObjectToResposeObject(movie))             
})

app.get('/movies/', async (request, response) => {
    const {directorId, movieName, leadActor} = request.body
    const postMovieQuery = `
    INSERT INTO
       movie ( director_id, movie_id, lead_actor)
    VALUES
      (${directorId}, '${movieName}', '${LeadActor}')`;
    await database.run(postMovieQuery)
    response.send('Movie Successfully Added')      
})

app.get("/movies/:movieId/", async (request, response) => {
    const {directorId, movieName, leadActor} = requestbody
    const {movieId} = require.params
    const updatrMovieQuery = `
           UPDATE
              movie
           SET
            director_id = ${directorId},
            movie_name = '${movieName}',
            Lead_actor = '${leadActor}'
           WHERE
            movie_id = ${movieid}`;

    await database.run(updateMovieQuery)
    response.send("Movie Details Updated");           
});

app.delete('/movies/:movieId', async (request, response) => {
    const {movieId} = request.params
    const deleteMovieQuery = `
    DELETE FROM
      movie
    WHERE
      movie_id = ${movieId}`;
    await database.run(deleteMovieQuery)
    response.send('Movie Removed')    
})

app.get('/directors/', async (request, response) => {
    const getDirectorQuery = `
      SELECT
        *
      FROM
        director;`
     const directorsArray = await database.all(getDirectorsQuery)
     response.send(
        directorsArray.map(eachDirector =>
           convertDirectorDbObjectToResponseObject(eachDirector),
           )
        )
    })

    app.get('directors/:directorId/movies/', async (request, response) => {
        const {directorId} = request.params
        const getDirectorMoviesQuery = `
          SELECT
            movie_name
          FROM
            movie
          WHERE
            director_id='${directorid}';`
        const moviesArray = await database.all(getDirectorMoviesQuery)
        response.send(
            moviesArray.map(eachMovie => ({movieName: eachMovie.movie_name})),
        )       
    })
    module.exports  = app




            



    
