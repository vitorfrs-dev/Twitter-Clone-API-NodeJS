import { Router } from 'express';
import multer from 'multer';
import UserController from './controllers/UserController';
import FollowController from './controllers/FollowController';
import TweetController from './controllers/TweetController';
import SessionController from './controllers/SessionController';
import UsersToFollowController from './controllers/UsersToFollowController';

import authMiddleware from './middlewares/auth';
import ProfileMetricsController from './controllers/ProfileMetricsController';
import multerConfig from './config/multer';

const upload = multer(multerConfig);

const route = Router();

route.get('/', (req, res) => res.json({ msg: 'Everything is OK' }));

route.post('/users/signIn', SessionController.store);

route.post('/users', UserController.store);
route.get('/users', authMiddleware, UserController.index);
route.get('/users/:id', UserController.select);
route.put(
  '/users',
  authMiddleware,
  upload.single('avatar'),
  UserController.update
);

route.post('/users/follow/:id', authMiddleware, FollowController.store);
route.delete('/users/follow/:id', authMiddleware, FollowController.delete);

route.post('/tweet', authMiddleware, TweetController.store);
route.get('/tweet', authMiddleware, TweetController.index);
route.put('/tweet/:tweetId', authMiddleware, TweetController.update);
route.delete('/tweet/:tweetId', authMiddleware, TweetController.delete);

route.get('/usersToFollow', authMiddleware, UsersToFollowController.index);
route.get('/profileMetrics', authMiddleware, ProfileMetricsController.index);

route.post('/testUpload', upload.single('avatar'), (req, res) => {
  return res.json({ file: req.file });
});

export default route;
