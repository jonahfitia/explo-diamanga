"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Lock, CheckCircle, Users, Star } from 'lucide-react';

interface Patrol {
  id: string;
  name: string;
  password: string;
  currentTop: number;
  completedTops: number[];
  score: number;
  attempts: number;
}

interface TopLevel {
  id: number;
  title: string;
  description: string;
  secretCode: string;
  points: number;
  hint?: string;
}

export default function AdventistGame() {
  const [currentPatrol, setCurrentPatrol] = useState<Patrol | null>(null);
  const [loginForm, setLoginForm] = useState({ name: '', password: '' });
  const [codeInput, setCodeInput] = useState('');
  const [selectedTop, setSelectedTop] = useState<TopLevel | null>(null);
  const [message, setMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Données de base - dans un vrai projet, ces données viendraient d'une API
  const tops: TopLevel[] = [
    {
      id: 1,
      title: "Première Mission",
      description: "Trouvez le code secret caché dans le temple adventiste",
      secretCode: "ADVENT2025",
      points: 100,
      hint: "Pensez à l'année actuelle et au nom de notre église"
    },
    {
      id: 2,
      title: "Les Pionniers",
      description: "Découvrez le code lié aux fondateurs de l'église adventiste",
      secretCode: "ELLEN1827",
      points: 150,
      hint: "Le nom d'une prophétesse et son année de naissance"
    },
    {
      id: 3,
      title: "Les Commandements",
      description: "Le code se trouve dans les dix commandements",
      secretCode: "SABBAT7",
      points: 200,
      hint: "Le jour saint et son numéro dans la semaine"
    },
    {
      id: 4,
      title: "Mission Finale",
      description: "La dernière épreuve pour les vrais aventuriers",
      secretCode: "MARANATHA",
      points: 300,
      hint: "Une expression araméenne que nous utilisons souvent"
    }
  ];

  const defaultPatrols: Patrol[] = [
    {
      id: 'patrol1',
      name: 'Les Pionniers',
      password: 'pioneer123',
      currentTop: 1,
      completedTops: [],
      score: 0,
      attempts: 0
    },
    {
      id: 'patrol2',
      name: 'Les Conquistadors',
      password: 'conquest456',
      currentTop: 1,
      completedTops: [],
      score: 0,
      attempts: 0
    },
    {
      id: 'patrol3',
      name: 'Les Aventuriers',
      password: 'adventure789',
      currentTop: 1,
      completedTops: [],
      score: 0,
      attempts: 0
    }
  ];

  useEffect(() => {
    // Initialiser les patrouilles si elles n'existent pas
    const savedPatrols = localStorage.getItem('adventist-patrols');
    if (!savedPatrols) {
      localStorage.setItem('adventist-patrols', JSON.stringify(defaultPatrols));
    }
  }, []);

  const handleLogin = () => {
    const savedPatrols = JSON.parse(localStorage.getItem('adventist-patrols') || '[]');
    const patrol = savedPatrols.find(
      (p: Patrol) => p.name.toLowerCase() === loginForm.name.toLowerCase() && p.password === loginForm.password
    );

    if (patrol) {
      setCurrentPatrol(patrol);
      setMessage('Connexion réussie ! Bienvenue dans le grand jeu !');
    } else {
      setMessage('Nom de patrouille ou mot de passe incorrect');
    }
  };

  const handleCodeSubmit = () => {
    if (!currentPatrol || !selectedTop) return;

    const savedPatrols = JSON.parse(localStorage.getItem('adventist-patrols') || '[]');
    const patrolIndex = savedPatrols.findIndex((p: Patrol) => p.id === currentPatrol.id);
    
    if (patrolIndex === -1) return;

    savedPatrols[patrolIndex].attempts++;

    if (codeInput.toUpperCase() === selectedTop.secretCode) {
      // Code correct
      savedPatrols[patrolIndex].completedTops.push(selectedTop.id);
      savedPatrols[patrolIndex].score += selectedTop.points;
      savedPatrols[patrolIndex].currentTop = selectedTop.id + 1;
      
      localStorage.setItem('adventist-patrols', JSON.stringify(savedPatrols));
      setCurrentPatrol(savedPatrols[patrolIndex]);
      
      setMessage(`🎉 Excellent ! TOP ${selectedTop.id} réussi ! +${selectedTop.points} points`);
      setCodeInput('');
      setSelectedTop(null);
      setShowHint(false);
    } else {
      // Code incorrect
      localStorage.setItem('adventist-patrols', JSON.stringify(savedPatrols));
      setCurrentPatrol(savedPatrols[patrolIndex]);
      
      setMessage('❌ Code incorrect. Essayez encore !');
    }
  };

  const handleLogout = () => {
    setCurrentPatrol(null);
    setLoginForm({ name: '', password: '' });
    setCodeInput('');
    setSelectedTop(null);
    setMessage('');
    setShowHint(false);
  };

  const getTopStatus = (topId: number) => {
    if (!currentPatrol) return 'locked';
    if (currentPatrol.completedTops.includes(topId)) return 'completed';
    if (currentPatrol.currentTop === topId) return 'available';
    return 'locked';
  };

  const calculateProgress = () => {
    if (!currentPatrol) return 0;
    return (currentPatrol.completedTops.length / tops.length) * 100;
  };

  if (!currentPatrol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <Trophy className="h-12 w-12 text-yellow-500 mr-3" />
              <h1 className="text-4xl font-bold text-blue-900">Grand Jeu Inter-Club</h1>
            </div>
            <p className="text-xl text-gray-600 mb-2">Club de Jeunesse Adventiste</p>
            <div className="flex items-center justify-center text-blue-600">
              <Star className="h-5 w-5 mr-1" />
              <span className="font-medium">Aventure • Découverte • Fraternité</span>
              <Star className="h-5 w-5 ml-1" />
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <Card className="shadow-xl border-0 bg-white/90 backdrop-blur">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl text-blue-900">Connexion Patrouille</CardTitle>
                <p className="text-gray-600">Entrez vos identifiants pour commencer l'aventure</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="patrol-name" className="text-blue-900 font-medium">Nom de la patrouille</Label>
                  <Input
                    id="patrol-name"
                    type="text"
                    value={loginForm.name}
                    onChange={(e) => setLoginForm({ ...loginForm, name: e.target.value })}
                    placeholder="Ex: Les Pionniers"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="text-blue-900 font-medium">Mot de passe</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Votre mot de passe secret"
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>
                <Button 
                  onClick={handleLogin} 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                >
                  <Users className="h-4 w-4 mr-2" />
                  Se connecter
                </Button>
                {message && (
                  <p className={`text-center text-sm ${message.includes('réussie') ? 'text-green-600' : 'text-red-600'}`}>
                    {message}
                  </p>
                )}
              </CardContent>
            </Card>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500 mb-2">Patrouilles disponibles pour la démo :</p>
              <div className="space-y-1 text-xs text-gray-400">
                <p>Les Pionniers / pioneer123</p>
                <p>Les Conquistadors / conquest456</p>
                <p>Les Aventuriers / adventure789</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Trophy className="h-8 w-8 text-yellow-500 mr-3" />
            <div>
              <h1 className="text-2xl font-bold text-blue-900">Grand Jeu Inter-Club</h1>
              <p className="text-blue-600 font-medium">{currentPatrol.name}</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="outline" className="border-blue-200 text-blue-700">
            Déconnexion
          </Button>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm">Score Total</p>
                  <p className="text-2xl font-bold">{currentPatrol.score}</p>
                </div>
                <Star className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm">TOP Réussis</p>
                  <p className="text-2xl font-bold">{currentPatrol.completedTops.length}/{tops.length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm">Progression</p>
                  <p className="text-2xl font-bold">{Math.round(calculateProgress())}%</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm">Tentatives</p>
                  <p className="text-2xl font-bold">{currentPatrol.attempts}</p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Progress Bar */}
        <Card className="mb-8 border-0 bg-white/90 backdrop-blur">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-blue-900">Progression Générale</h3>
              <span className="text-sm text-gray-600">{currentPatrol.completedTops.length} / {tops.length} TOP réussis</span>
            </div>
            <Progress value={calculateProgress()} className="h-3" />
          </CardContent>
        </Card>

        {/* TOP Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {tops.map((top) => {
            const status = getTopStatus(top.id);
            return (
              <Card
                key={top.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg border-0 ${
                  status === 'completed'
                    ? 'bg-gradient-to-r from-green-400 to-green-500 text-white transform hover:scale-105'
                    : status === 'available'
                    ? 'bg-gradient-to-r from-blue-400 to-blue-500 text-white transform hover:scale-105'
                    : 'bg-gray-100 text-gray-500'
                }`}
                onClick={() => status === 'available' && setSelectedTop(top)}
              >
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3">
                    {status === 'completed' ? (
                      <CheckCircle className="h-10 w-10" />
                    ) : status === 'available' ? (
                      <Trophy className="h-10 w-10" />
                    ) : (
                      <Lock className="h-10 w-10" />
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2">TOP {top.id}</h3>
                  <p className="text-sm mb-3">{top.title}</p>
                  <Badge
                    variant={status === 'completed' ? 'secondary' : status === 'available' ? 'default' : 'outline'}
                    className={`${
                      status === 'completed'
                        ? 'bg-white/20 text-white'
                        : status === 'available'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {status === 'completed' ? '✓ Réussi' : status === 'available' ? 'Disponible' : 'Verrouillé'}
                  </Badge>
                  {status === 'available' && (
                    <div className="mt-2 text-xs opacity-90">
                      +{top.points} points
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Code Input Modal */}
        {selectedTop && (
          <Card className="max-w-2xl mx-auto border-0 bg-white/95 backdrop-blur shadow-2xl">
            <CardHeader className="text-center border-b">
              <div className="flex justify-center mb-3">
                <Trophy className="h-12 w-12 text-blue-500" />
              </div>
              <CardTitle className="text-2xl text-blue-900">TOP {selectedTop.id} - {selectedTop.title}</CardTitle>
              <p className="text-gray-600 mt-2">{selectedTop.description}</p>
              <Badge className="mx-auto bg-yellow-500 text-white">+{selectedTop.points} points</Badge>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <Label htmlFor="secret-code" className="text-blue-900 font-medium">Code Secret</Label>
                <Input
                  id="secret-code"
                  type="text"
                  value={codeInput}
                  onChange={(e) => setCodeInput(e.target.value.toUpperCase())}
                  placeholder="Entrez le code secret..."
                  className="border-blue-200 focus:border-blue-500 text-center text-lg font-mono"
                />
              </div>

              {selectedTop.hint && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowHint(!showHint)}
                    className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                  >
                    {showHint ? 'Masquer l\'indice' : 'Afficher un indice 💡'}
                  </Button>
                  {showHint && (
                    <div className="mt-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-yellow-800 italic">💡 {selectedTop.hint}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-3">
                <Button 
                  onClick={handleCodeSubmit}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
                  disabled={!codeInput.trim()}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Valider le Code
                </Button>
                <Button 
                  onClick={() => {
                    setSelectedTop(null);
                    setCodeInput('');
                    setShowHint(false);
                  }}
                  variant="outline"
                  className="border-gray-300"
                >
                  Annuler
                </Button>
              </div>

              {message && (
                <div className={`text-center p-3 rounded-lg ${
                  message.includes('🎉') 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                }`}>
                  {message}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {currentPatrol.completedTops.length === tops.length && (
          <div className="text-center mt-8">
            <Card className="max-w-md mx-auto border-0 bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-2xl">
              <CardContent className="p-8">
                <Trophy className="h-16 w-16 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">🎉 FÉLICITATIONS ! 🎉</h2>
                <p className="text-yellow-100 mb-4">Vous avez terminé tous les TOP !</p>
                <p className="text-2xl font-bold">Score Final: {currentPatrol.score} points</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}