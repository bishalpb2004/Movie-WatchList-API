import { prisma } from "../config/db.js";

const addToWatchList = async(req, res) => {
    const {movieId, status, rating, notes} = req.body;
    let userId = req.user.id;
    
    // verify movie exists
    const movie = await prisma.movie.findUnique({
        where: {id: movieId}
    });

    if(!movie){
        return res.status(404).json({error: "Movie not found!"});
    }

    // check if already added
    const existingInWatchList = await prisma.watchlistItem.findUnique({
        where: {userId_movieId:
            {
                userId: userId,
                movieId: movieId
            },
        },
    });

    if(existingInWatchList){
        return res.status(400).json({error: "Movie already in the watchlist!"});
    }

    const watchlistItem = await prisma.watchlistItem.create({
        data: {
            userId,
            movieId,
            status: status || "PLANNED",
            rating,
            notes,
        }
    })

    return res.status(201).json({
        status: "Success",
        data: {
            watchlistItem
        }
    })
}

const updateFromWatchlist = async(req, res) => {
    
    const {status, rating, notes} = req.body;

    const watchListId = req.params.id;

    // check if watchlistitem already exists
    const existsWatchlist = await prisma.watchlistItem.findUnique({
        where: {
            id: watchListId
        }
    })

    if(!existsWatchlist){
        return res.status(404).json({
            error: "Could not find the watchlistitem, aborting the update operation!"
        })
    }

    // only correct user can update the data
    if(existsWatchlist.userId !== req.user.id){
        return res.status(400).json({
            error: "Correct user not updating the data!"
        })
    }
    
    const updateData = {}
    
    if(status !== undefined) updateData.status = status.toUpperCase()
    if(rating !== undefined) updateData.rating = rating
    if(notes !== undefined) updateData.notes = notes

    if (Object.keys(updateData).length === 0) {
        return res.status(400).json({ error: "No valid fields provided for update." });
    }

    try {
        await prisma.watchlistItem.update({
            where: {
                id: watchListId
            },
            data: updateData
        })
        
        res.status(200).json({
            status: "Success",
            message: "Update operation successful"
        })

    } catch (error) {
        res.status(400).json({
            error: error
        })
    }

}

const removeFromWatchlist = async(req, res) => {
    const watchListId = req.params.id;
    const existsWatchlist = await prisma.watchlistItem.findUnique({
        where: {
            id: watchListId
        }
    })
    
    // check if watchlistitem exists or not
    if(!existsWatchlist)
    {
        return res.status(404).json({
            error: "Could not find the watchlist item, aborting delete operation!"
        })
    }

    // check if correct user removes the watchlistitem or not
    if(existsWatchlist.userId !== req.user.id){
        return res.status(400).json({
            error: "Correct user is not removing the watchlistitem!"
        })
    }

    try {
        const removeItem = await prisma.watchlistItem.delete({
            where:{
                id: watchListId
            }
        })
        res.status(200).json({
            status: "Success",
            message: "Watchlist item removed successfully!"
        })
    } catch (error) {
        res.status(400).json({
            error: error
        })
    }
    
}

export {addToWatchList, updateFromWatchlist, removeFromWatchlist};
