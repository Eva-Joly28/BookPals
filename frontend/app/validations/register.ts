import { object, ref, string } from 'yup';


const registerSchema = object().shape({
  username: string().required('Entrez un nom').min(2, 'pseudo trop court').max(40, 'pseudo trop long'),
  email: string()
    .email('Entrez une adresse mail valide')
    .required('Entrez une adresse mail'),
  password: string().required('Entrez un mot de passe').min(8,'minimum 8 caractères'),
  confirmPassword: string()
    .oneOf([ref('password')], 'les mots de passe ne correspondent pas')
    .required('veuillez confirmer le mot de passe'),
});

export default registerSchema;
