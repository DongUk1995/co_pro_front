import {
  faFacebookSquare,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styled from "styled-components";
import routes from "../routes";
import AuthLayout from "../Components/auth/AuthLayout";
import BottomBox from "../Components/auth/BottomBox";
import Button from "../Components/auth/Button";
import FormBox from "../Components/auth/Formbox";
import FormError from "../Components/auth/FormError";
import PageTitle from "../Components/PageTitle";
import Input from "../Components/auth/Input";
import Separator from "../Components/auth/Separator";
import { useForm } from "react-hook-form";
import { gql, useMutation } from "@apollo/client";
import { logUserIn } from "../apollo";
import { useLocation } from "react-router-dom";

const FaceBookLogin = styled.div`
  color: #385285;
  span {
    margin-left: 10px;
    font-size: 12px;
    font-weight: 600;
  }
`;
const Notification = styled.div`
  color: #2ecc71;
  margin-top: 10px;
`;

const LOGIN_MUTATION = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      error
    }
  }
`;
function Login() {
  const location = useLocation();
  const {
    register,
    handleSubmit,
    formState: { errors },
    formState,
    getValues,
    setError,
    clearErrors,
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: location?.state?.username || "",
      password: location?.state?.password || "",
    },
  });

  const onCompleted = (data) => {
    const {
      login: { ok, error, token },
    } = data;
    if (!ok) {
      return setError("result", {
        message: error,
      });
    }
    if (token) {
      logUserIn(token);
    }
  };
  const [login, { loading }] = useMutation(LOGIN_MUTATION, {
    onCompleted,
  });
  const onSubmitValid = (data) => {
    if (loading) {
      return;
    }
    const { username, password } = getValues(); //Form에 작성한 유저네임과 패스워드를 불러와준다.
    login({
      variables: { username, password },
    });
  };
  const clearLoginError = () => {
    clearErrors("result");
  };
  //const onSubmitInvalid = (data) => {
  //console.log(data, "invalid");
  //};
  return (
    <AuthLayout>
      <PageTitle title="LogIn" />
      <FormBox>
        <div>
          <FontAwesomeIcon icon={faInstagram} size="3x" />
        </div>
        <Notification>{location?.state?.message}</Notification>
        <form onSubmit={handleSubmit(onSubmitValid)}>
          <Input
            {...register("username", {
              required: "username is required",
              minLength: {
                value: 5,
                message: "Username should be longer than 5 cahrs",
              },
              //validate: (currentValue) => currentValue.includes(""),
            })}
            onChange={clearLoginError}
            type="text"
            placeholder="username"
            $hasError={Boolean(errors.username?.message)}
          />
          <FormError message={errors.username?.message} />
          <Input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Passwrod"
            $hasError={Boolean(errors.password?.message)}
            onChange={clearLoginError}
          />
          <FormError message={errors.password?.message} />
          <Button
            type="submit"
            value={loading ? "Loding..." : "Log In"}
            disabled={!formState.isValid || loading}
          />
          <FormError message={errors.result?.message} />
        </form>
        <Separator />
        <FaceBookLogin>
          <FontAwesomeIcon icon={faFacebookSquare} />
          <span>Log in with FaceBook</span>
        </FaceBookLogin>
      </FormBox>
      <BottomBox
        cta="Don't have an account?"
        linkText="Sign up"
        link={routes.signUp}
      />
    </AuthLayout>
  );
}
export default Login;
