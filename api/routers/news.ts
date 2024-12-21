import express from "express";
import mysqlDb from "../mysqlDb";
import {Comment, News, NewsMutation} from "../types";
import {imagesUpload} from "../multer";
import {ResultSetHeader} from "mysql2";

const newsRouter = express.Router();

newsRouter.get('/', async (req, res, next) => {
    try {
        const connection = await mysqlDb.getConnection();
        const [result] = await connection.query('SELECT id, title, image, publication_date from news');
        const news = result as News[];

        res.send(news);
    } catch (e) {
        next(e);
    }
});

newsRouter.get('/:id', async (req, res, next) => {
    const id: string = req.params.id;

    if (!id) {
        res.status(404).send({error: "Not Found"});
        return;
    }

    try {
        const connection = await mysqlDb.getConnection();

        const [result] = await connection.query('SELECT * FROM news WHERE id = ?', [id]);
        const news = result as News[];

        if (news.length === 0) {
            res.status(404).send({error: "News Not Found"});
            return;
        } else {
            res.send(news[0]);
        }
    } catch (e) {
        next(e);
    }
});

newsRouter.post('/', imagesUpload.single('image'), async (req, res, next) => {
    if (!req.body.title || !req.body.content) {
        res.status(400).send({error: "Fill in the title & content fields!"});
        return;
    }

    const newsItem: NewsMutation = {
        title: req.body.title,
        content: req.body.content,
        image: req.file ? 'images' + req.file.filename : null,
    };

    try {
        const connection = await mysqlDb.getConnection();

        const [result] = await connection.query('INSERT INTO news (title, content, image) VALUES (?, ?, ?)', [newsItem.title, newsItem.content, newsItem.image]);
        const resultHeader = result as ResultSetHeader;

        const [resultNews] = await connection.query('SELECT * FROM news WHERE id = ?', [resultHeader.insertId]);
        const news = resultNews as News[];

        if (news.length === 0) {
            res.status(404).send({error: "News Not Found"});
            return;
        } else {
            res.send(news[0]);
        }
    } catch (e) {
        next(e);
    }
});

newsRouter.delete('/:id', async (req, res, next) => {
    const id: string = req.params.id;

    if (!id) {
        res.status(404).send({error: "Not Found"});
        return;
    }

    try {
        const connection = await mysqlDb.getConnection();

        const [newsResult] = await connection.query('SELECT * FROM news WHERE id = ?', [id]);
        const news = newsResult as News[];

        if (news.length === 0) {
            res.status(404).send({error: "News Not Found"});
            return;
        }
        const [commentsResult] = await connection.query('SELECT * FROM comments WHERE news_id = ?', [id]);
        const relatedComments = commentsResult as Comment[];

        if (relatedComments.length > 0) {
            await connection.query('DELETE FROM comments WHERE news_id = ?', [id]);
        }

        await connection.query('DELETE FROM news WHERE id = ?', [id]);

        if (relatedComments.length > 0) {
            res.send({message: `News and ${relatedComments.length} comment(s) deleted successfully`});
        } else {
            res.send({message: 'News deleted successfully'});
        }
    } catch (e) {
        next(e);
    }
});

export default newsRouter;