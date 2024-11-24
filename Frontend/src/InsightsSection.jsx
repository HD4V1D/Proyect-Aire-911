import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const translations = {
  en: {
    dailyInsights: "Your Daily Insights",
    selectActivity: "Select an activity:",
    next: "Next",
    howTo: "How to do it:",
    insights: [
      {
        title: "Creativity Boost",
        description: "Try taking a different route to work today to stimulate new neural pathways."
      },
      {
        title: "Emotional Check-in",
        description: "Reflect on a challenging emotion you felt recently."
      },
      {
        title: "Mindfulness Moment",
        description: "Take three deep breaths and focus on the present moment whenever you feel stressed."
      }
    ],
    activities: {
      drawing: {
        title: "Intuitive Drawing",
        description: "Express your emotions and meditative experiences visually.",
        steps: [
          "With paper and colored pencils, start drawing what came up during your meditation.",
          "Don't focus on perfection; just let your hand move freely.",
          "The drawing can reflect your moods, images, or sensations."
        ]
      },
      emotional: {
        title: "Emotion Journal",
        description: "Dedicate a few minutes each day to write about your emotions.",
        steps: [
          "Choose a quiet moment to reflect.",
          "Write down the date and note the emotions you've felt during the day.",
          "Describe what situations or interactions triggered those emotions and how you responded.",
          "Review your entries periodically to identify patterns."
        ]
      },
      perspective: {
        title: "Perspective Shift",
        description: "View a problem or idea from different angles.",
        steps: [
          "Take a specific problem you're facing and write it in the center of a sheet.",
          "Ask yourself how different people would see it (a child, an elder, an artist, a scientist, etc.).",
          "Write down the answers and see if any of them inspire a new solution or idea."
        ]
      }
    }
  },
  es: {
    dailyInsights: "Tus Ideas Diarias",
    selectActivity: "Selecciona una actividad:",
    next: "Siguiente",
    howTo: "Cómo hacerlo:",
    insights: [
      {
        title: "Impulso Creativo",
        description: "Intenta tomar una ruta diferente al trabajo hoy para estimular nuevas conexiones neuronales."
      },
      {
        title: "Chequeo Emocional",
        description: "Reflexiona sobre una emoción desafiante que hayas sentido recientemente."
      },
      {
        title: "Momento de Atención Plena",
        description: "Toma tres respiraciones profundas y concéntrate en el momento presente cuando te sientas estresado."
      }
    ],
    activities: {
      drawing: {
        title: "Dibujo Intuitivo",
        description: "Expresar visualmente tus emociones y experiencias meditativas.",
        steps: [
          "Con papel y lápices de colores, comienza a dibujar lo que surgió durante tu meditación.",
          "No te fijes en la perfección; simplemente deja que tu mano se mueva libremente.",
          "El dibujo puede reflejar tus estados de ánimo, imágenes o sensaciones."
        ]
      },
      emotional: {
        title: "Diario de Emociones",
        description: "Dedica unos minutos cada día para escribir sobre tus emociones.",
        steps: [
          "Elige un momento tranquilo para reflexionar.",
          "Anota la fecha y escribe sobre las emociones que has sentido durante el día.",
          "Describe qué situaciones o interacciones provocaron esas emociones y cómo respondiste.",
          "Revisa tus entradas periódicamente para identificar patrones."
        ]
      },
      perspective: {
        title: "Cambio de Perspectiva",
        description: "Ver un problema o idea desde diferentes ángulos.",
        steps: [
          "Toma un problema específico que estés enfrentando y escríbelo en el centro de una hoja.",
          "Pregúntate cómo lo verían diferentes personas (un niño, un anciano, un artista, un científico, etc.).",
          "Anota las respuestas y observa si alguna de ellas te inspira una nueva solución o idea."
        ]
      }
    }
  }
};

export default function InsightsSection() {
  const [activeInsight, setActiveInsight] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeIn, setFadeIn] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);

  // Get user's browser language
  const userLanguage = navigator.language.slice(0, 2);
  const language = translations[userLanguage] || translations.en;

  const handleActivitySelect = (activity) => {
    if (selectedActivity === activity) {
      setShowModal(false);
      setSelectedActivity(null);
      setCurrentStep(0);
    } else {
      setSelectedActivity(activity);
      setShowModal(true);
      setCurrentStep(0);
      setFadeIn(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setFadeIn(false);
    setSelectedActivity(null);
    setCurrentStep(0);
  };

  const nextStep = () => {
    if (currentStep < selectedActivity.steps.length - 1) {
      setFadeIn(false);
      setCurrentStep(currentStep + 1);
      setTimeout(() => setFadeIn(true), 100);
    }
  };

  const renderActivityButton = (activity, title) => (
    <button
      onClick={() => handleActivitySelect(activity)}
      className="mt-2 block w-full text-center bg-blue-600 text-white px-4 py-2 rounded transition hover:bg-blue-500"
    >
      {title}
    </button>
  );

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">{language.dailyInsights}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {language.insights.map((insight, index) => (
          <Card key={index} className="transition-transform transform hover:scale-105">
            <CardHeader>
              <CardTitle
                onClick={() => setActiveInsight(activeInsight === insight.title ? null : insight.title)}
                className="cursor-pointer text-lg font-semibold text-gray-800"
              >
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {activeInsight && (
        <div className="mt-4 border p-4 rounded bg-gray-100 shadow-lg">
          <h3 className="text-lg font-bold">{language.selectActivity}:</h3>
          {activeInsight === language.insights[0].title && 
            renderActivityButton(language.activities.perspective, language.activities.perspective.title)}
          {activeInsight === language.insights[1].title && 
            renderActivityButton(language.activities.emotional, language.activities.emotional.title)}
          {activeInsight === language.insights[2].title && 
            renderActivityButton(language.activities.drawing, language.activities.drawing.title)}
        </div>
      )}

      {showModal && selectedActivity && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
            <button onClick={closeModal} className="absolute top-2 right-2 text-gray-600">
              X
            </button>
            <h3 className="text-xl font-bold mb-2">{selectedActivity.title}</h3>
            <p className="mb-4">{selectedActivity.description}</p>
            <h4 className="font-bold">{language.howTo}</h4>
            <p className={`transition-opacity duration-300 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
              {selectedActivity.steps[currentStep]}
            </p>
            {currentStep < selectedActivity.steps.length - 1 && (
              <button onClick={nextStep} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded transition hover:bg-blue-500">
                {language.next}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}