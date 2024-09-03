import * as Yup from 'yup';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('nom d\'utilisateur'),
  password: Yup.string().required('mot de passe').min(8, 'mot de passe incomplet'),
});

export default loginSchema;
