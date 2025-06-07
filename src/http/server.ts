import express, { ErrorRequestHandler } from 'express';
import swaggerUi from 'swagger-ui-express';
import morgan from 'morgan';

import swaggerDocs from '../libs/swaggerConfig';
import userRoutes from '../routes/userRoutes';
import genreRoutes from '../routes/genreRoutes';
import errorHandler from '../middlewares/errorHandler';
import genreMovieRoutes from '../routes/genreMovieRoutes';
import movieRoutes from '../routes/movieRoutes';
import reviewRoutes from '../routes/reviewRoutes';
import authRoutes from '../routes/authRoutes';

const app = express();
const port = 3000;

// ----- Middlewares -----
app.use(express.json());
app.use(morgan('dev'));

// ----- Docs -----
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ----- Routes -----
app.use('/api', userRoutes);
app.use('/api', genreRoutes);
app.use('/api', genreMovieRoutes);
app.use('/api', movieRoutes);
app.use('/api', reviewRoutes);

app.use('/api', authRoutes);

app.use(errorHandler);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
