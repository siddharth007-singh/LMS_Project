import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useLoginUserMutation, useRegisterUserMutation } from "@/features/api/authApi"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const Login = () => {

    const [signupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: "",
    });
    const [loginInput, setLoginInput] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const [registerUser, {data:registerData, error:registerError, isLoading:registerIsLoading, isSuccess:registerIsSuccess}] = useRegisterUserMutation();
    const [loginUser, {data:loginData, error:loginError, isLoading:loginIsLoading, isSuccess:loginIsSuccess}] = useLoginUserMutation();



    const handleChange = (e, type) => {
        const { name, value } = e.target;

        if (type === "signup") {
            //name ke andar value dalna gya
            setSignupInput({ ...signupInput, [name]: value });
        }
        else {
            setLoginInput({ ...loginInput, [name]: value });
        }

    }

    const handleRegister = async(type) => {
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser:loginUser;
        await action(inputData);
        if(type === "signup") {
            setSignupInput({
                name:"",
                email:"",
                password:""
            })
        }
        else {
            setLoginInput({
                email:"",
                password:""
            })
        }
    }

    //Messaging 
    useEffect(() => {
        if(registerIsSuccess && registerData){
            toast.success(registerData.message || "User registered successfully");
        }
        if(registerError){
            toast.error(registerError.data.message || "Something went wrong");
        }
        if(loginIsSuccess && loginData){
            toast.success(loginData.message || "Login successfully");
            navigate("/");
        }
        if(loginError){
            toast.error(loginError.data.message || "Something went wrong");
        }
    },[loginIsLoading, registerIsLoading, loginData, registerData, loginError, registerError]);


    return (
        <div className="flex items-center justify-center w-full mt-10">
            <Tabs defaultValue="login" className="w-[400px]">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signup">SignUp</TabsTrigger>
                    <TabsTrigger value="login">Login</TabsTrigger>
                </TabsList>
                <TabsContent value="signup">
                    <Card>
                        <CardHeader>
                            <CardTitle>SignUp</CardTitle>
                            <CardDescription>
                                Create a new account and click signup when you're done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="name">Name</Label>
                                <Input type="text" name="name" value={signupInput.name} onChange={(e) => handleChange(e, "signup")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="email">Email</Label>
                                <Input name="email" value={signupInput.email} type="email" onChange={(e) => handleChange(e, "signup")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input name="password" value={signupInput.password} type="password" onChange={(e) => handleChange(e, "signup")} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={registerIsLoading} onClick={() => handleRegister("signup")}>
                                {registerIsLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please
                                        wait
                                    </>
                                ) : (
                                    "Signup"
                                )}
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
                <TabsContent value="login">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login</CardTitle>
                            <CardDescription>
                                Login your password here. After signup, you'll be logged in.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="space-y-1">
                                <Label htmlFor="current">Email</Label>
                                <Input name="email" value={loginInput.email} type="email" placeholder="Eg. xyz@gmail.com" onChange={(e) => handleChange(e, "login")} />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="new">Password</Label>
                                <Input type="password" onChange={(e) => handleChange(e, "login")} name="password" value={loginInput.password} />
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button disabled={loginIsLoading} onClick={() => handleRegister("login")}>
                                {
                                    loginIsLoading ? (
                                        <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/> Please Wait !
                                        </>
                                    ):(
                                        "Login"
                                    )
                                }
                            </Button>
                        </CardFooter>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default Login