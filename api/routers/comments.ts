import express from "express";
import mysqlDb from "../mysqlDb";
import {Comment, CommentMutation, News} from "../types";
import {ResultSetHeader} from "mysql2";

const commentsRouter = express.Router();

commentsRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();

        if (req.query.news_id) {
            const [result] = await connection.query('SELECT * FROM comments WHERE news_id = ?', [req.query.news_id]);
            const comments = result as Comment[];
            res.send(comments);
        } else {
            const [result] = await connection.query('SELECT * FROM comments');
            const comments = result as Comment[];
            res.send(comments);
        }
    } catch (e) {
        next(e);
    }
});

commentsRouter.post('/', async (req, res, next) => {
    if (!req.body.news_id || !req.body.content) {
        res.status(400).send({error: "Missing the news_id & content fields. They're required."});
        return;
    }

    const comment: CommentMutation = {
        news_id: Number(req.body.news_id),
        author: req.body.author ? req.body.author : 'Anonymous',
        content: req.body.content,
    };

    try {
        const connection = await mysqlDb.getConnection();

        const [newsResult] = await connection.query('SELECT * FROM news WHERE id = ?', [req.body.news_id]);
        const news = newsResult as News[];

        if (news.length === 0) {
            res.status(404).send({error: "News not found! Enter a valid news_id"});
            return;
        }

        const [result] = await connection.query('INSERT INTO comments (news_id, author, content) VALUES (?, ?, ?)', [comment.news_id, comment.author, comment.content]);
        const resultHeader = result as ResultSetHeader;

        const [resultComments] = await connection.query('SELECT * FROM comments WHERE id = ?', [resultHeader.insertId]);
        const comments = resultComments as Comment[];

        if (comments.length === 0) {
            res.status(400).send({error: "No comments found."});
            return;
        } else {
            res.send(comments[0]);
        }
    } catch (e) {
        next(e);
    }
});

commentsRouter.delete('/:id', async (req, res, next) => {
    const id: string = req.params.id;

    if (!id) {
        res.status(404).send({error: "Not Found"});
        return;
    }

    try {
        const connection = await mysqlDb.getConnection();

        const [commentResult] = await connection.query('SELECT * FROM comments WHERE id = ?', [id]);
        const comment = commentResult as Comment[];

        if (comment.length === 0) {
            res.status(404).send({error: "Comment not found!"});
            return;
        }

        await connection.query('DELETE FROM comments WHERE id = ?', [id]);

        res.send({message: "Comment deleted successfully"});
    } catch (e) {
        next(e);
    }
});

export default commentsRouter;