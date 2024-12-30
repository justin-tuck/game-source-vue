import * as yup from 'yup';

const ArticleSchema = {
    game:yup.string()
    .required('The game is required'),
    title:yup.string()
    .required('The title is required')
    .min(20, 'Make the title longer')
    .max(70, 'Make the title shorter'),
    excerpt:yup.string()
    .required('The excerpt is required')
    .min(100, 'Make the excerpt longer')
    .max(500, 'Make the excerpt shorter'),
    editor:yup.string()
    .required('The editor is required')
    .min(100, 'Make the editor text longer'),
    rating:yup.string()
    .required('The rating is required')
    .notOneOf(['Select a rating'], 'You need to select a rating'),
    img:yup.string()
    .required('The image is required')
    .url('Is this a valid url?'),
}

export default ArticleSchema; 