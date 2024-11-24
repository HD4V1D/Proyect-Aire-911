import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";

export default function Component() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();

  const translations = {
    en: {
      login: "Login",
      register: "Register",
      welcomeTitle: "Welcome to MindTrain",
      welcomeDescription: "Train your mind, transform your life",
      forgotPassword: "Forgot your password?",
      createAccount: "Create Account",
      fullName: "Full Name",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      loginBtn: "Login",
      registerBtn: "Create Account",
      loggingIn: "Logging in...",
      registering: "Creating account...",
    },
    es: {
      login: "Iniciar Sesión",
      register: "Registrarse",
      welcomeTitle: "Bienvenido a MindTrain",
      welcomeDescription: "Entrena tu mente, transforma tu vida",
      forgotPassword: "¿Olvidaste tu contraseña?",
      createAccount: "Crear Cuenta",
      fullName: "Nombre completo",
      email: "Email",
      password: "Contraseña",
      confirmPassword: "Confirmar contraseña",
      loginBtn: "Iniciar Sesión",
      registerBtn: "Crear cuenta",
      loggingIn: "Iniciando sesión...",
      registering: "Creando cuenta...",
    },
  };

  const userLanguage = navigator.language.slice(0, 2);
  const language = translations[userLanguage] || translations.en;

  const handleSubmit = async (e, type) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(""); // Limpiar mensajes previos
    setShowMessage(false);

    const formData = {
      name: e.target["register-name"]?.value || "",
      email: e.target[type === "register" ? "register-email" : "email"].value,
      password: e.target[type === "register" ? "register-password" : "password"].value,
    };

    if (type === "register") {
      const confirmPassword = e.target["register-confirm-password"].value;
      if (formData.password !== confirmPassword) {
        setMessage("Las contraseñas no coinciden.");
        setShowMessage(true);
        setIsLoading(false);
        return;
      }
    }

    try {
      const endpoint = type === "register" ? "/register" : "/login";
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(errorData?.detail || "Error al procesar la solicitud.");
        setShowMessage(true);
      } else {
        const data = await response.json();
        localStorage.setItem("userName", data?.user?.name || "");
        navigate("/onboarding"); // Redirigir al onboarding
      }
    } catch (error) {
      setMessage("No se pudo conectar con el servidor. Inténtalo más tarde.");
      setShowMessage(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // El mensaje desaparece después de 5 segundos
      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-teal-50 p-4">
      <Tabs defaultValue="login" className="w-full max-w-md">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="login">{language.login}</TabsTrigger>
          <TabsTrigger value="register">{language.register}</TabsTrigger>
        </TabsList>

        {/* Login */}
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>{language.welcomeTitle}</CardTitle>
              <CardDescription>{language.welcomeDescription}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, "login")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{language.email}</Label>
                  <Input id="email" type="email" placeholder="correo@ejemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">{language.password}</Label>
                  <Input id="password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? language.loggingIn : language.loginBtn}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Register */}
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>{language.createAccount}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={(e) => handleSubmit(e, "register")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">{language.fullName}</Label>
                  <Input id="register-name" type="text" placeholder="Juan Pérez" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-email">{language.email}</Label>
                  <Input id="register-email" type="email" placeholder="correo@ejemplo.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-password">{language.password}</Label>
                  <Input id="register-password" type="password" placeholder="••••••••" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">{language.confirmPassword}</Label>
                  <Input id="register-confirm-password" type="password" placeholder="••••••••" required />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? language.registering : language.registerBtn}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Mensaje de error innovador con símbolo de mente */}
      {showMessage && (
        <div
          className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-indigo-500 text-white p-4 rounded-md shadow-lg transition-transform duration-500 ease-out"
          style={{
            animation: "fadeOut 5s ease-in-out forwards",
          }}
        >
          <div className="flex items-center">
            <span role="img" aria-label="brain" className="text-2xl mr-3">🧠</span>
            <span>{message}</span>
          </div>
        </div>
      )}
    </div>
  );
}