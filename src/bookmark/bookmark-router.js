const express = require('express')
const uuid = require('uuid/v4')
const logger = require('../logger')
const { bookmarks } = require('../store.js')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

bookmarkRouter
    .route('/bookmarks')
    .get((req,res) => {
        res.json(bookmarks)
    })
    .post( bodyParser, (req,res) => {
        const { title, url, description, rating } = req.body;
        if (!title) {
            logger.error('Title is required');
            res.status(400).send('Invalid data');
        }
        if (!url) {
            logger.error('Url is required');
            res.status(400).send('Invalid data');
        }
        if(!description) {
            logger.error('Description is required');
            res.status(400).send('Invalid data');
        }
        if(!rating) {
            logger.error('Rating is required');
            res.status(400).send('Invalid data');
        }
        const id = uuid();
        const bookmark = {
            id,
            title,
            url,
            description,
            rating
        }
        bookmarks.push(bookmark);
        logger.info(`Bookmark with id ${id} created!`)
        res
            .status(201)
            .location(`http://localhost:8000/bookmarks/${id}`)
            .json({id})
    })

bookmarkRouter
    .route ('/bookmarks/:id')
    .get((req,res) => {
        const { id } = req.params;
        const bookmark = bookmarks.find (b => b.id == id)
        if (!id) {
            logger.error(`No bookmark with id ${id}`)
            return res.status(404).json({error: 'Bookmark not found.'})
        }
        res.json(bookmark);
    })
    .delete((req,res) => {
        const { id } = req.params;
        const bookmarkIndex = bookmarks.findIndex(bm => bm.id == id);
        if(bookmarkIndex === -1) {
            logger.error(`Not found`)
        }
        bookmarks.splice(bookmarkIndex, 1);
        logger.info(`List with id ${id} was deleted.`)
        res.status(204).end();
    })

    module.exports = bookmarkRouter