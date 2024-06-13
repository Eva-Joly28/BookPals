import * as Yup from 'yup';

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().required('entrez l\'adresse mail').email('adresse mail invalide'),
});

export default forgotPasswordSchema;
