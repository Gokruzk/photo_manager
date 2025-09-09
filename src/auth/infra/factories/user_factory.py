from auth.infra.web.schemas import AuthenticatedUser, RegisterUser, UserRetrieve


class UserFactory:
    @staticmethod
    def create(data: RegisterUser):
        from auth.utils.managers import PasswordManager
        return {
            "cod_ubi": int(data.cod_ubi),
            "cod_state": int(data.cod_state),
            "username": str(data.username),
            "email": str(data.email),
            "password": PasswordManager.hash_password(data.password)
        }

    @staticmethod
    def create_authenticated_user(data: UserRetrieve) -> AuthenticatedUser:
        return AuthenticatedUser(
            cod_user=data.cod_user,
            cod_ubi=data.cod_ubi,
            cod_state=data.cod_state,
            username=data.username,
            email=data.email,
        )

    @staticmethod
    def create_retrieved_user(data: UserRetrieve) -> UserRetrieve:
        return UserRetrieve(
            cod_user=data.cod_user,
            cod_ubi=data.cod_ubi,
            cod_state=data.cod_state,
            username=data.username,
            email=data.email,
        )
