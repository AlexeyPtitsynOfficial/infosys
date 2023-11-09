import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

import { useDispatch } from "react-redux"
import { setCredentials } from "./authSlice"
import { useLoginMutation } from "../api/authApiSlice"
import { Button, FormControl, Grid, Stack, TextField, Typography } from "@mui/material"

const Login = () => {
    const userRef = useRef<HTMLInputElement>(null)
    const errRef = useRef<HTMLParagraphElement>(null)
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [errorMsg ,setErrorMsg] = useState('')
    const navigate = useNavigate()

    const [login, {isLoading}] = useLoginMutation()
    const dispatch = useDispatch()

    useEffect(() => {
        userRef?.current?.focus()
    },[])

    useEffect(() => {
        setErrorMsg('')
    }, [username, password])

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            const userData = await login({username, password}).unwrap()
            dispatch(setCredentials({ ...userData, username}))
            setUsername('')
            setPassword('')
            navigate('/')
        } catch (error: any) {
            if(!error.response) {
                setErrorMsg('No server Response')
            } else if (error.response.status === 400) {
                setErrorMsg('Missing Username or Password')
            } else if (error.response.status === 401) {
                setErrorMsg('Unauthorized')
            } else {
                setErrorMsg('Login failed')
            }
            errRef?.current?.focus()
        }
    }

    const handleUserInput = (e: any) => setUsername(e.target.value)
    const handlePwdInput = (e: any) => setPassword(e.target.value)

    const content = isLoading ? <h1>Загрузка...</h1> : (
            <Stack spacing={1} sx={{width: 300}} justifyContent="center">
                <Typography>Необходима авторизация</Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={1}>
                        <TextField size="small"
                            type='text'
                            id="username"
                            label="Username"
                            ref={userRef}
                            value={username}
                            onChange={handleUserInput}
                            autoComplete="off"
                            required
                            />
                        <TextField size="small"
                            type='password'
                            id="password"
                            label="Password"
                            ref={userRef}
                            value={password}
                            onChange={handlePwdInput}
                            autoComplete="off"
                            required
                            />
                        <Button size="small" type="submit" variant="contained">Войти</Button>
                    </Stack>
                </form>
            </Stack>
    )

    return content
}

export default Login