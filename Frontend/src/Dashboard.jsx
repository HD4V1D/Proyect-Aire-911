import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FaUserCircle } from 'react-icons/fa';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [preferences, setPreferences] = useState({ goals: [], sessionLength: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  // Traducciones
  const translations = {
    en: {
      welcomeBack: "Welcome back",
      progressTitle: "Your Progress",
      progressDescription: "Weekly mental well-being score",
      preferencesTitle: "Your Preferences",
      preferencesDescription: "Selected goals and session length",
      sessionLength: "Session Length",
      logout: "Log out",
      startSession: "Start Today's Session",
      quote: `"The mind is everything. What you think you become." - Buddha`,
    },
    es: {
      welcomeBack: "Bienvenido de nuevo",
      progressTitle: "Tu Progreso",
      progressDescription: "Puntaje semanal de bienestar mental",
      preferencesTitle: "Tus Preferencias",
      preferencesDescription: "Metas seleccionadas y duración de la sesión",
      sessionLength: "Duración de la Sesión",
      logout: "Cerrar sesión",
      startSession: "Inicia la sesión de hoy",
      quote: `"La mente lo es todo. En lo que piensas, te conviertes." - Buda`,
    },
  };

  // Detectar el idioma del navegador
  const userLanguage = navigator.language.slice(0, 2);
  const language = translations[userLanguage] || translations.en;

  useEffect(() => {
    const name = localStorage.getItem("userName") || "Usuario";
    setUserName(name);

    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/progress");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching progress data:", error);
      }
    };
    fetchData();

    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      setPreferences(JSON.parse(storedPreferences));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userName");
    navigate('/');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleStartSession = () => {
    navigate('/InsightsSections');
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{language.welcomeBack}, {userName}!</h1>
        <div className="relative">
          <Button onClick={toggleDropdown} className="px-4 py-2 text-lg">
            <FaUserCircle className="text-2xl" />
          </Button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-white border rounded-md shadow-lg w-48">
              <ul>
                <li>
                  <Button 
                    onClick={handleLogout} 
                    className="w-full text-left px-4 py-2 text-sm"
                  >
                    {language.logout}
                  </Button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language.progressTitle}</CardTitle>
            <CardDescription>{language.progressDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language.preferencesTitle}</CardTitle>
            <CardDescription>{language.preferencesDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-2">
              {preferences.goals.map(goal => <li key={goal}>{goal}</li>)}
              <li>{language.sessionLength}: {preferences.sessionLength} minutes</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <p className="text-center text-lg mb-4">{language.quote}</p>
          <Button className="w-full text-lg py-6" onClick={handleStartSession}>
            {language.startSession}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}