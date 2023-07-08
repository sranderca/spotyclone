import {
  TextInput,
  PasswordInput,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Button,
} from '@mantine/core';
import {useAtomValue} from "jotai";
import {globalPocketbase} from "../globalState.ts";
import {useState} from "react";

export function Auth() {
  const pb = useAtomValue(globalPocketbase)
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  async function loginOrRegister() {
    if (isLogin) {
      try {
        await pb.collection("users").authWithPassword(email, password)
        window.location.reload()
      } catch {
        alert("Error al iniciar sesion")
      }
    } else {
      try {
        await pb.collection("users").create({
          email,
          name,
          password,
          passwordConfirm
        })
        setIsLogin(true)
      } catch {
        alert("Error al registrarse")
      }
    }
  }

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({fontFamily: `Greycliff CF, ${theme.fontFamily}`, fontWeight: 900})}
      >
        Bienvenido
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        {isLogin ?
          "No tienes una cuenta?"
          : "Ya tienes una cuenta?"} {' '}
        <Anchor size="sm" component="button" onClick={() => setIsLogin((prev) => !prev)}>
          {isLogin ? "Registrate" : "Inicia Sesion"}
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        {!isLogin ?
          <TextInput value={name} onChange={(e) => setName(e.target.value)} label="Nombre" placeholder="Tu Nombre"
                     required/>
          : null}
        <TextInput value={email} onChange={(e) => setEmail(e.target.value)} label="Correo"
                   placeholder="correo@email.com" required/>
        <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} label="Contraseña"
                       placeholder="Tu Contraseña" required mt="md"/>
        {!isLogin ?
          <PasswordInput value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)}
                         label="Confirmar Contraseña" placeholder="Tu Contraseña" required mt="md"/>
          : null}

        <Button fullWidth mt="xl" onClick={() => loginOrRegister()}>
          {isLogin ?
            "Iniciar Sesion" : "Registrase"}
        </Button>
      </Paper>
    </Container>
  );
}