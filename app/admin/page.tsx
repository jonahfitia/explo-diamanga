"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Trophy, Plus, Edit, Trash2, Eye, BarChart } from 'lucide-react';

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

export default function AdminPanel() {
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [tops, setTops] = useState<TopLevel[]>([]);
  const [newPatrol, setNewPatrol] = useState({ name: '', password: '' });
  const [newTop, setNewTop] = useState({
    title: '',
    description: '',
    secretCode: '',
    points: 100,
    hint: ''
  });
  const [editingTop, setEditingTop] = useState<TopLevel | null>(null);
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const ADMIN_PASSWORD = 'admin2025';

  // Données de base pour les TOP
  const defaultTops: TopLevel[] = [
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

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = () => {
    // Charger les patrouilles
    const savedPatrols = JSON.parse(localStorage.getItem('adventist-patrols') || '[]');
    setPatrols(savedPatrols);

    // Charger ou initialiser les TOP
    const savedTops = JSON.parse(localStorage.getItem('adventist-tops') || 'null');
    if (savedTops) {
      setTops(savedTops);
    } else {
      setTops(defaultTops);
      localStorage.setItem('adventist-tops', JSON.stringify(defaultTops));
    }
  };

  const handleAdminLogin = () => {
    if (adminPassword === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Mot de passe incorrect');
    }
  };

  const addPatrol = () => {
    if (!newPatrol.name || !newPatrol.password) return;

    const newPatrolData: Patrol = {
      id: `patrol_${Date.now()}`,
      name: newPatrol.name,
      password: newPatrol.password,
      currentTop: 1,
      completedTops: [],
      score: 0,
      attempts: 0
    };

    const updatedPatrols = [...patrols, newPatrolData];
    setPatrols(updatedPatrols);
    localStorage.setItem('adventist-patrols', JSON.stringify(updatedPatrols));
    setNewPatrol({ name: '', password: '' });
  };

  const deletePatrol = (patrolId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette patrouille ?')) {
      const updatedPatrols = patrols.filter(p => p.id !== patrolId);
      setPatrols(updatedPatrols);
      localStorage.setItem('adventist-patrols', JSON.stringify(updatedPatrols));
    }
  };

  const resetPatrolProgress = (patrolId: string) => {
    if (confirm('Êtes-vous sûr de vouloir remettre à zéro cette patrouille ?')) {
      const updatedPatrols = patrols.map(p => 
        p.id === patrolId 
          ? { ...p, currentTop: 1, completedTops: [], score: 0, attempts: 0 }
          : p
      );
      setPatrols(updatedPatrols);
      localStorage.setItem('adventist-patrols', JSON.stringify(updatedPatrols));
    }
  };

  const addTop = () => {
    if (!newTop.title || !newTop.description || !newTop.secretCode) return;

    const newTopData: TopLevel = {
      id: Math.max(...tops.map(t => t.id), 0) + 1,
      ...newTop,
      points: Number(newTop.points)
    };

    const updatedTops = [...tops, newTopData];
    setTops(updatedTops);
    localStorage.setItem('adventist-tops', JSON.stringify(updatedTops));
    setNewTop({ title: '', description: '', secretCode: '', points: 100, hint: '' });
  };

  const updateTop = () => {
    if (!editingTop) return;

    const updatedTops = tops.map(t => 
      t.id === editingTop.id ? editingTop : t
    );
    setTops(updatedTops);
    localStorage.setItem('adventist-tops', JSON.stringify(updatedTops));
    setEditingTop(null);
  };

  const deleteTop = (topId: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce TOP ?')) {
      const updatedTops = tops.filter(t => t.id !== topId);
      setTops(updatedTops);
      localStorage.setItem('adventist-tops', JSON.stringify(updatedTops));
    }
  };

  const resetAllProgress = () => {
    if (confirm('Êtes-vous sûr de vouloir remettre à zéro TOUTES les patrouilles ?')) {
      const resetPatrols = patrols.map(p => ({
        ...p,
        currentTop: 1,
        completedTops: [],
        score: 0,
        attempts: 0
      }));
      setPatrols(resetPatrols);
      localStorage.setItem('adventist-patrols', JSON.stringify(resetPatrols));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Settings className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl text-blue-900">Administration</CardTitle>
            <p className="text-gray-600">Panneau de contrôle du grand jeu</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="admin-password">Mot de passe administrateur</Label>
              <Input
                id="admin-password"
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                placeholder="Entrez le mot de passe"
              />
            </div>
            <Button onClick={handleAdminLogin} className="w-full">
              Se connecter
            </Button>
            <p className="text-xs text-center text-gray-500">
              Mot de passe par défaut : admin2025
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Settings className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <h1 className="text-3xl font-bold text-blue-900">Administration</h1>
              <p className="text-gray-600">Gestion du Grand Jeu Inter-Club</p>
            </div>
          </div>
          <Button onClick={() => setIsAuthenticated(false)} variant="outline">
            Déconnexion
          </Button>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart className="h-4 w-4" />
              Tableau de bord
            </TabsTrigger>
            <TabsTrigger value="patrols" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Patrouilles
            </TabsTrigger>
            <TabsTrigger value="tops" className="flex items-center gap-2">
              <Trophy className="h-4 w-4" />
              TOP Gestion
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Paramètres
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Patrouilles Actives</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{patrols.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">TOP Disponibles</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{tops.length}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Score Total</CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {patrols.reduce((sum, p) => sum + p.score, 0)}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Classement des Patrouilles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {patrols
                    .sort((a, b) => b.score - a.score)
                    .map((patrol, index) => (
                      <div key={patrol.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <Badge variant={index === 0 ? 'default' : 'secondary'}>
                            #{index + 1}
                          </Badge>
                          <div>
                            <p className="font-medium">{patrol.name}</p>
                            <p className="text-sm text-gray-500">
                              {patrol.completedTops.length} TOP réussis • {patrol.attempts} tentatives
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{patrol.score}</p>
                          <p className="text-sm text-gray-500">points</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patrols">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Ajouter une Patrouille
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="patrol-name">Nom de la patrouille</Label>
                    <Input
                      id="patrol-name"
                      value={newPatrol.name}
                      onChange={(e) => setNewPatrol({ ...newPatrol, name: e.target.value })}
                      placeholder="Ex: Les Aventuriers"
                    />
                  </div>
                  <div>
                    <Label htmlFor="patrol-password">Mot de passe</Label>
                    <Input
                      id="patrol-password"
                      value={newPatrol.password}
                      onChange={(e) => setNewPatrol({ ...newPatrol, password: e.target.value })}
                      placeholder="mot_de_passe_secret"
                    />
                  </div>
                  <Button onClick={addPatrol} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter la Patrouille
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Patrouilles Existantes</CardTitle>
                    <Button onClick={resetAllProgress} variant="outline" size="sm">
                      Reset Général
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {patrols.map((patrol) => (
                      <div key={patrol.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{patrol.name}</p>
                          <p className="text-sm text-gray-500">
                            Score: {patrol.score} • TOP {patrol.currentTop} • {patrol.completedTops.length} réussis
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => resetPatrolProgress(patrol.id)}
                            size="sm"
                            variant="outline"
                          >
                            Reset
                          </Button>
                          <Button
                            onClick={() => deletePatrol(patrol.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tops">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    {editingTop ? 'Modifier le TOP' : 'Ajouter un TOP'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Titre</Label>
                    <Input
                      value={editingTop ? editingTop.title : newTop.title}
                      onChange={(e) => {
                        if (editingTop) {
                          setEditingTop({ ...editingTop, title: e.target.value });
                        } else {
                          setNewTop({ ...newTop, title: e.target.value });
                        }
                      }}
                      placeholder="Ex: Mission Secrète"
                    />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Textarea
                      value={editingTop ? editingTop.description : newTop.description}
                      onChange={(e) => {
                        if (editingTop) {
                          setEditingTop({ ...editingTop, description: e.target.value });
                        } else {
                          setNewTop({ ...newTop, description: e.target.value });
                        }
                      }}
                      placeholder="Description de la mission..."
                    />
                  </div>
                  <div>
                    <Label>Code Secret</Label>
                    <Input
                      value={editingTop ? editingTop.secretCode : newTop.secretCode}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        if (editingTop) {
                          setEditingTop({ ...editingTop, secretCode: value });
                        } else {
                          setNewTop({ ...newTop, secretCode: value });
                        }
                      }}
                      placeholder="CODE123"
                    />
                  </div>
                  <div>
                    <Label>Points</Label>
                    <Input
                      type="number"
                      value={editingTop ? editingTop.points : newTop.points}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (editingTop) {
                          setEditingTop({ ...editingTop, points: value });
                        } else {
                          setNewTop({ ...newTop, points: value });
                        }
                      }}
                    />
                  </div>
                  <div>
                    <Label>Indice (optionnel)</Label>
                    <Input
                      value={editingTop ? editingTop.hint || '' : newTop.hint}
                      onChange={(e) => {
                        if (editingTop) {
                          setEditingTop({ ...editingTop, hint: e.target.value });
                        } else {
                          setNewTop({ ...newTop, hint: e.target.value });
                        }
                      }}
                      placeholder="Indice pour aider les patrouilles..."
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={editingTop ? updateTop : addTop} 
                      className="flex-1"
                    >
                      {editingTop ? 'Modifier' : 'Ajouter'}
                    </Button>
                    {editingTop && (
                      <Button 
                        onClick={() => setEditingTop(null)} 
                        variant="outline"
                      >
                        Annuler
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>TOP Existants</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {tops.map((top) => (
                      <div key={top.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">TOP {top.id} - {top.title}</p>
                          <p className="text-sm text-gray-500">{top.points} points</p>
                          <p className="text-xs text-blue-600">Code: {top.secretCode}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setEditingTop(top)}
                            size="sm"
                            variant="outline"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => deleteTop(top.id)}
                            size="sm"
                            variant="destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres du Jeu</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Actions Rapides</h3>
                    <div className="space-y-3">
                      <Button onClick={resetAllProgress} variant="outline" className="w-full">
                        Remettre à zéro toutes les patrouilles
                      </Button>
                      <Button 
                        onClick={() => {
                          localStorage.removeItem('adventist-patrols');
                          localStorage.removeItem('adventist-tops');
                          setPatrols([]);
                          setTops([]);
                        }}
                        variant="destructive" 
                        className="w-full"
                      >
                        Effacer toutes les données
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Informations</h3>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Patrouilles inscrites: {patrols.length}</p>
                      <p>• TOP configurés: {tops.length}</p>
                      <p>• Total des tentatives: {patrols.reduce((sum, p) => sum + p.attempts, 0)}</p>
                      <p>• Score cumulé: {patrols.reduce((sum, p) => sum + p.score, 0)} points</p>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-3">URLs d'accès</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Jeu principal:</strong> <code>/</code></p>
                    <p><strong>Administration:</strong> <code>/admin</code></p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}