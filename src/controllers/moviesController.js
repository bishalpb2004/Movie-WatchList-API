import { prisma } from "../config/db.js"

const addMovie = async (req, res) => {
    const { title, overview, releaseYear, genres, runtime, posterUrl } = req.body
    const createdBy = req.user.id

    const userExists = await prisma.user.findUnique({
            where: { id: createdBy }
        }
    )

    if (!userExists) {
        return res.status(400).json({
            message: "Creator User for this movie is not present in the user database!"
        })
    }

    const movieExists = await prisma.movie.findUnique({
        where: {
            title: title,
            releaseYear: releaseYear,
            createdBy: createdBy
        }
    })

    if (movieExists) {
        return res.status(400).json({
            message: "Movie with given title, releaseYear, createdBy is already present!"
        })
    }

    const createdMovie = await prisma.movie.create({
        data: {
            title,
            overview,
            releaseYear,
            genres,
            runtime,
            posterUrl,
            createdBy,
        }
    })

    return res.status(201).json({
        status: "success",
        data: createdMovie,
        message: "Movie created successfully!"
    })

}

const updateMovie = async (req, res) => {
    
    const { overview, genres, runtime, posterUrl } = req.body
    const movieId = req.params.id

    const movieExists = await prisma.movie.findUnique({
        where: {
            id: movieId
        }
    })

    if(!movieExists){
        return res.status(400).json({
            error: "Movie does not exist with given title, releaseYear or creator!"
        })
    }

    const updateData = {}

    if(overview != null) updateData.overview = overview
    if (genres != null && genres.length != 0) updateData.genres = genres
    if(runtime != null) updateData.runtime = runtime
    if(posterUrl != null) updateData.posterUrl = posterUrl

    if(Object.keys(updateData).length === 0){
        return res.status(400).json({
            error: "No useful data sent for update!"
        })
    }

    try {
        await prisma.movie.update({
            where: {
                id: movieId
            },
            data: updateData
        })

        return res.status(200).json({
            status: "success",
            message: "Update successfull!"
        })

    } catch (error) {
        return res.status(400).json({
            log: error,
            message: "Update operation failed!"
        })
    }

}

const deleteMovie = async (req, res) => {
    const movieId = req.params.id
    const creatorId = req.user.id

    const movieExists = await prisma.movie.findUnique({
        where: {
            id: movieId
        }
    })

    if(!movieExists){
        return res.status(400).json({
            message: "Movie does not exist in movie database!"
        })
    }

    if(creatorId != movieExists.createdBy){
        return res.status(400).json({
            message: "Creator is not deleting the movie"
        })
    }
    
    try {
        await prisma.movie.delete({
            where: {
                id: movieId
            }
        })

        return res.status(200).json({
            status: "success",
            message: "Movie deleted successfully!"
        })

    } catch (error) {
        return res.status(400).json({
            log: error,
            message: "Movie deletion operation failed!"
        })
    }

}

export { addMovie, updateMovie, deleteMovie }