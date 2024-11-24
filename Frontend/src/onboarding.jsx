import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/Label";

export default function Onboarding() {
    const [step, setStep] = useState(1);
    const [goals, setGoals] = useState([]);
    const [sessionLength, setSessionLength] = useState('');
    const navigate = useNavigate(); // Usa useNavigate para redirigir

    // Traducciones
    const translations = {
        en: {
            title: "Let's Get Started",
            description: "Customize your MindTrain experience",
            goalPrompt: "What are your mental training goals?",
            goals: ["Creativity", "Emotional Intelligence", "Inner Well-being", "Imagination", "Vision"],
            sessionLengthPrompt: "Choose your preferred daily session length:",
            minutesOptions: ["10 minutes", "15 minutes", "20 minutes", "30 minutes"],
            welcomeMessage: "Welcome to MindTrain!",
            benefits: [
                "Daily personalized mental training sessions",
                "Track your progress and insights",
                "Improve your mental well-being over time"
            ],
            next: "Next",
            getStarted: "Get Started"
        },
        es: {
            title: "Comencemos",
            description: "Personaliza tu experiencia en MindTrain",
            goalPrompt: "¿Cuáles son tus metas de entrenamiento mental?",
            goals: ["Creatividad", "Inteligencia Emocional", "Bienestar Interior", "Imaginación", "Visión"],
            sessionLengthPrompt: "Elige la duración de tu sesión diaria preferida:",
            minutesOptions: ["10 minutos", "15 minutos", "20 minutos", "30 minutos"],
            welcomeMessage: "¡Bienvenido a MindTrain!",
            benefits: [
                "Sesiones de entrenamiento mental personalizadas diarias",
                "Sigue tu progreso y percepciones",
                "Mejora tu bienestar mental con el tiempo"
            ],
            next: "Siguiente",
            getStarted: "Empezar"
        }
    };

    const userLanguage = navigator.language.slice(0, 2); // Detecta el idioma del navegador
    const language = translations[userLanguage] || translations.en; // Usa el idioma detectado o por defecto 'en'

    const handleGoalChange = (goal) => {
        setGoals(prev =>
            prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
        );
    };

    const handleNext = () => {
        if (step < 3) {
            setStep(step + 1);
        } else {
            localStorage.setItem('userPreferences', JSON.stringify({ goals, sessionLength }));
            // Redirige al usuario al dashboard cuando llega al paso final
            navigate('/dashboard');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-100 to-teal-100">
            <Card className="w-[400px]">
                <CardHeader>
                    <CardTitle>{language.title}</CardTitle>
                    <CardDescription>{language.description}</CardDescription>
                </CardHeader>
                <CardContent>
                    {step === 1 && (
                        <div className="grid gap-4">
                            <Label>{language.goalPrompt}</Label>
                            {language.goals.map((goal) => (
                                <div className="flex items-center space-x-2" key={goal}>
                                    <Checkbox id={goal} checked={goals.includes(goal)} onCheckedChange={() => handleGoalChange(goal)} />
                                    <Label htmlFor={goal}>{goal}</Label>
                                </div>
                            ))}
                        </div>
                    )}
                    {step === 2 && (
                        <div className="grid gap-4">
                            <Label>{language.sessionLengthPrompt}</Label>
                            <RadioGroup value={sessionLength} onValueChange={setSessionLength}>
                                {language.minutesOptions.map((length) => (
                                    <div className="flex items-center space-x-2" key={length}>
                                        <RadioGroupItem value={length.toString()} id={`length-${length}`} />
                                        <Label htmlFor={`length-${length}`}>{length} {language.minutes}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    )}
                    {step === 3 && (
                        <div className="grid gap-4">
                            <h3 className="text-lg font-semibold">{language.welcomeMessage}</h3>
                            <p>{language.description}</p>
                            <ul className="list-disc list-inside space-y-2">
                                {language.benefits.map((benefit, index) => <li key={index}>{benefit}</li>)}
                            </ul>
                        </div>
                    )}
                </CardContent>
                <CardFooter>
                    <Button onClick={handleNext} className="w-full">
                        {step < 3 ? language.next : language.getStarted}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
