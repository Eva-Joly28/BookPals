import * as Yup from 'yup';

const passwordRecoveryValidation = Yup.object().shape({
  password: Yup.string().required('Entrez le nouveau mot de passe'),
  confirmPassword: Yup.string()
    .required('veuillez confirmer le mot de passe')
    .oneOf([Yup.ref('password')], 'les mots de passe doivent correspondre'),
});

// jscpd:ignore-end

export default passwordRecoveryValidation;
