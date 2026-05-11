import { FormEvent, useState } from "react";
import { loginUser, registerUser, getCurrentUser } from "../api/authApi";
import { useAppDispatch } from "../hooks/redux";
import { setUser } from "../store/userSlice";
import { getFavoriteMovies } from "../api/moviesApi";
import { setFavoriteMovies } from "../store/favoritesSlice";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type AuthMode = "login" | "register";

export function AuthModal({
  isOpen,
  onClose,
}: AuthModalProps): JSX.Element | null {
  const dispatch = useAppDispatch();

  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [isEmailTouched, setIsEmailTouched] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordTouched, setIsPasswordTouched] = useState(false);
  const [name, setName] = useState("");
  const [isNameTouched, setIsNameTouched] = useState(false);
  const [surname, setSurname] = useState("");
  const [isSurnameTouched, setIsSurnameTouched] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedName = name.trim();
  const normalizedSurname = surname.trim();

  if (!isOpen) {
    return null;
  }

  function resetForm(): void {
    setEmail("");
    setPassword("");
    setName("");
    setSurname("");
    setErrorMessage("");
    setSuccessMessage("");
    setIsEmailTouched(false);
    setIsPasswordTouched(false);
    setIsSurnameTouched(false);
    setIsNameTouched(false);
  }

  function switchToLogin(): void {
    setMode("login");
    resetForm();
  }

  function switchToRegister(): void {
    setMode("register");
    resetForm();
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    if (!email || !password || (mode === "register" && (!name || !surname))) {
      setErrorMessage("Все поля обязательны для заполнения");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      if (mode === "login") {
        const loginResponse = await loginUser({
          email: normalizedEmail,
          password,
        });

        if (!loginResponse.result) {
          setErrorMessage("Неверный email или пароль");
          return;
        }

        try {
          const currentUser = await getCurrentUser();
          dispatch(setUser(currentUser));
        } catch (error) {
          setErrorMessage(
            "Вход выполнен, но сессия не сохранилась. Проверьте cookies, VPN и proxy.",
          );
          return;
        }

        try {
          const favoriteMovies = await getFavoriteMovies();
          dispatch(setFavoriteMovies(favoriteMovies));
        } catch (error) {
          dispatch(setFavoriteMovies([]));
        }

        onClose();
        resetForm();
        setMode("login");
        return;
      }

      await registerUser({
        email: normalizedEmail,
        password,
        name: normalizedName,
        surname: normalizedSurname,
      });
      setMode("login");
      setPassword("");
      setName("");
      setSurname("");
      setErrorMessage("");
      setSuccessMessage(
        "Регистрация прошла успешно. Теперь войдите с этим email и паролем.",
      );
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrorMessage("Пользователь с таким email уже существует");
        return;
      }

      if (error.response?.status === 400) {
        setErrorMessage("Проверь правильность введённых данных");
        return;
      }

      setErrorMessage(
        mode === "login"
          ? "Не удалось выполнить вход"
          : "Не удалось выполнить регистрацию",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  const hasEmailError = isEmailTouched && !email.trim();
  const hasPasswordError = isPasswordTouched && !password.trim();
  const hasNameError = mode === "register" && isNameTouched && !name.trim();
  const hasSurnameError =
    mode === "register" && isSurnameTouched && !surname.trim();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="auth-modal__close" onClick={onClose}>
          ×
        </button>

        <h2 className="auth-modal__title">
          {mode === "login" ? "Вход" : "Регистрация"}
        </h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {successMessage && (
            <p className="auth-form__success">{successMessage}</p>
          )}

          {mode === "register" && (
            <>
              <input
                type="text"
                placeholder="Имя"
                className={`auth-form__input ${hasNameError ? "auth-form__input_error" : ""}`}
                onBlur={() => setIsNameTouched(true)}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <input
                type="text"
                placeholder="Фамилия"
                className={`auth-form__input ${hasSurnameError ? "auth-form__input_error" : ""}`}
                onBlur={() => setIsSurnameTouched(true)}
                value={surname}
                onChange={(event) => setSurname(event.target.value)}
              />
            </>
          )}
          <input
            type="email"
            placeholder="Электронная почта"
            className={`auth-form__input ${hasEmailError ? "auth-form__input_error" : ""}`}
            onBlur={() => setIsEmailTouched(true)}
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />

          <input
            type="password"
            placeholder="Пароль"
            className={`auth-form__input ${hasPasswordError ? "auth-form__input_error" : ""}`}
            onBlur={() => setIsPasswordTouched(true)}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {errorMessage && <p className="auth-form__error">{errorMessage}</p>}

          <button
            type="submit"
            className="auth-form__submit"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? mode === "login"
                ? "Входим..."
                : "Регистрируем..."
              : mode === "login"
                ? "Войти"
                : "Зарегистрироваться"}
          </button>
        </form>

        <div className="auth-modal__footer">
          {mode === "login" ? (
            <button
              type="button"
              className="auth-modal__switch"
              onClick={switchToRegister}
            >
              Регистрация
            </button>
          ) : (
            <button
              type="button"
              className="auth-modal__switch"
              onClick={switchToLogin}
            >
              У меня уже есть аккаунт
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
